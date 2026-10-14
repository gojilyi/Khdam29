const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Write public/icon.svg
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#78350f" flood-opacity="0.3" />
    </filter>
  </defs>
  <rect width="512" height="512" rx="108" fill="url(#bg)" />
  <circle cx="256" cy="256" r="190" fill="#ffffff" fill-opacity="0.15" />
  
  <g filter="url(#shadow)" fill="#ffffff" transform="translate(116, 116) scale(1.15)">
    <!-- Shield / Badge & Tools -->
    <path d="M120 10 L190 35 L190 120 C190 170 120 220 120 220 C120 220 50 170 50 120 L50 35 Z" fill="#0f172a" />
    <!-- Hammer & Wrench Icon -->
    <path d="M95 65 L115 85 L145 55 C148 52 153 52 156 55 L165 64 C168 67 168 72 165 75 L135 105 L155 125 L145 135 L125 115 L85 155 C82 158 77 158 74 155 L65 146 C62 143 62 138 65 135 L105 95 L85 75 Z" fill="#f59e0b" />
    <circle cx="120" cy="150" r="14" fill="#ffffff" />
  </g>
  <text x="256" y="440" font-family="sans-serif" font-weight="900" font-size="52" fill="#ffffff" text-anchor="middle" letter-spacing="2">خـدّام</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent.trim());
console.log('Created public/icon.svg');

// Simple PNG encoder using Node's zlib
function createPng(width, height, getPixelRgba) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8 bits per channel
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // Compression
  ihdrData.writeUInt8(0, 11); // Filter
  ihdrData.writeUInt8(0, 12); // Interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw scanlines with filter byte 0 (None)
  const rawData = Buffer.alloc((width * 4 + 1) * height);
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter byte: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRgba(x, y, width, height);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  // IDAT
  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = createChunk('IDAT', compressed);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 implementation
function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = new Int32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    crc32.table = table;
  }
  let c = -1;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ -1) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcData = Buffer.concat([typeBuf, data]);
  const crc = crc32(crcData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

// Generate brand app icon pixels (Amber #f59e0b background with dark shield and golden symbol)
function getBrandPixel(x, y, w, h, isMaskable = false) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Corner radius check for standard icon (non-maskable)
  if (!isMaskable) {
    const rx = Math.abs(dx) - (w / 2 - w * 0.22);
    const ry = Math.abs(dy) - (h / 2 - h * 0.22);
    if (rx > 0 && ry > 0 && Math.sqrt(rx * rx + ry * ry) > w * 0.22) {
      return [0, 0, 0, 0]; // Transparent outside rounded corner
    }
  }

  // Background gradient: from Amber-500 (#f59e0b) to Amber-600 (#d97706)
  const grad = (y / h) * 0.3;
  let r = Math.round(245 - grad * 50);
  let g = Math.round(158 - grad * 60);
  let b = Math.round(11 + grad * 10);

  // Subtle circular halo
  const haloRadius = isMaskable ? w * 0.35 : w * 0.4;
  if (dist < haloRadius) {
    const haloAlpha = 0.15 * (1 - dist / haloRadius);
    r = Math.round(r * (1 - haloAlpha) + 255 * haloAlpha);
    g = Math.round(g * (1 - haloAlpha) + 255 * haloAlpha);
    b = Math.round(b * (1 - haloAlpha) + 255 * haloAlpha);
  }

  // Center emblem (Shield shape & symbol)
  const emblemScale = isMaskable ? 0.32 : 0.38;
  const ex = dx / (w * emblemScale);
  const ey = (dy + h * 0.04) / (h * emblemScale);

  // Shield formula
  const inShield = (Math.abs(ex) <= 1.0) && (ey >= -0.9) && (ey <= 0.2 || (ey <= 1.1 && Math.abs(ex) <= (1.1 - ey) * 1.1));
  if (inShield) {
    // Shield fill: slate-900 (#0f172a)
    return [15, 23, 42, 255];
  }

  // Inner tool emblem inside shield
  const inInnerSymbol = inShield && (dist < w * 0.14);
  if (inInnerSymbol) {
    return [245, 158, 11, 255];
  }

  return [r, g, b, 255];
}

// Generate files
const sizes = [
  { name: 'pwa-192x192.png', size: 192, maskable: false },
  { name: 'pwa-512x512.png', size: 512, maskable: false },
  { name: 'pwa-maskable-512x512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
  { name: 'favicon.ico', size: 64, maskable: false }
];

sizes.forEach(({ name, size, maskable }) => {
  const png = createPng(size, size, (x, y, w, h) => getBrandPixel(x, y, w, h, maskable));
  fs.writeFileSync(path.join(publicDir, name), png);
  console.log(`Generated public/${name} (${size}x${size})`);
});
