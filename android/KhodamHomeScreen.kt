package dz.khodam.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

/**
 * =========================================================================
 * تطبيق "خـدّام" - واجهة المستخدم الرئيسية (Jetpack Compose - Material Design 3)
 * =========================================================================
 * تصميم هادئ، نظيف، وبدون تدرجات لونية (No Gradients) ولا ظلال مبالغ فيها (Flat / Minimal Shadows).
 * الألوان الأساسية:
 *  - الكحلي الرصين (Deep Navy): #1A2B4C
 *  - القرميدي الصادق (Terracotta/Brick Red): #C84B31
 *  - خلفية رمادية فاتحة نقية: #F8F9FA
 *  - أسطح البطاقات: #FFFFFF بحدود ناعمة #E2E8F0
 */

// 1. نظام الألوان الصلبة (Solid Material Colors)
object KhodamThemeColors {
    val PrimaryNavy = Color(0xFF1A2B4C)       // الكحلي كلون أساسي يعبر عن الثقة والاحتراف
    val SecondaryTerracotta = Color(0xFFC84B31) // القرميدي كلون ثانوي يعبر عن الحرف اليدوية
    val BackgroundLight = Color(0xFFF8F9FA)   // رمادي فاتح جداً هادئ ومريح للعين
    val SurfaceWhite = Color(0xFFFFFFFF)      // أبيض صلب للبطاقات
    val BorderSubtle = Color(0xFFE2E8F0)      // حدود رقيقة بدون ظلال مزعجة
    val TextPrimary = Color(0xFF1E293B)       // نص داكن مقروء وعالي التباين
    val TextSecondary = Color(0xFF64748B)     // نص رمادي مريح للشروحات
    val StarGold = Color(0xFFEAB308)          // لون نجمة التقييم
    val VerifiedGreen = Color(0xFF10B981)     // وسم التوثيق
}

// 2. نماذج البيانات (Data Models)
data class ServiceItem(
    val id: String,
    val titleAr: String,
    val icon: ImageVector
)

data class ArtisanItem(
    val id: String,
    val name: String,
    val trade: String,
    val rating: Double,
    val reviewCount: Int,
    val avatarUrl: String,
    val hourlyRateDzd: Int,
    val isVerified: Boolean = true
)

// 3. الشاشة الرئيسية لتطبيق خـدّام (HomeScreen Composable)
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KhodamHomeScreen(
    onSearchQueryChange: (String) -> Unit = {},
    onServiceClick: (ServiceItem) -> Unit = {},
    onArtisanContactClick: (ArtisanItem) -> Unit = {},
    onArtisanClick: (ArtisanItem) -> Unit = {}
) {
    var searchQuery by remember { mutableStateOf("") }

    // قائمة خدمات الحرف المنزلية (Material Icons Outlined)
    val services = remember {
        listOf(
            ServiceItem("plumbing", "سباكة وترصيص", Icons.Outlined.Plumbing),
            ServiceItem("electric", "كهرباء منزلية", Icons.Outlined.ElectricBolt),
            ServiceItem("carpentry", "نجارة وأثاث", Icons.Outlined.Handyman),
            ServiceItem("painting", "دهان وديكور", Icons.Outlined.FormatPaint),
            ServiceItem("auto", "ميكانيك سيارات", Icons.Outlined.DirectionsCar),
            ServiceItem("cleaning", "تنظيف وتعقيم", Icons.Outlined.CleaningServices),
            ServiceItem("moving", "نقل وشحن", Icons.Outlined.LocalShipping),
            ServiceItem("gardening", "حدائق وتشجير", Icons.Outlined.Yard)
        )
    }

    // قائمة أفضل الحرفيين المعتمدين
    val topArtisans = remember {
        listOf(
            ArtisanItem(
                id = "1",
                name = "المعلم كمال بلقاسم",
                trade = "سباك معتمد وموثق",
                rating = 4.9,
                reviewCount = 142,
                avatarUrl = "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200",
                hourlyRateDzd = 1800
            ),
            ArtisanItem(
                id = "2",
                name = "ياسين بن عمارة",
                trade = "كهربائي شبكات ومباني",
                rating = 4.85,
                reviewCount = 98,
                avatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
                hourlyRateDzd = 2000
            ),
            ArtisanItem(
                id = "3",
                name = "عمر تلمساني",
                trade = "نجار أثاث وتشطيبات",
                rating = 4.95,
                reviewCount = 115,
                avatarUrl = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
                hourlyRateDzd = 2200
            ),
            ArtisanItem(
                id = "4",
                name = "حسان قادري",
                trade = "دهان وديكور داخلي",
                rating = 4.8,
                reviewCount = 76,
                avatarUrl = "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200",
                hourlyRateDzd = 1500
            )
        )
    }

    // دعم كامل للاتجاه العربي من اليمين لليسار (RTL)
    CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
        Scaffold(
            containerColor = KhodamThemeColors.BackgroundLight,
            topBar = {
                // شريط علوي بسيط ونظيف بدون ظلال مبالغ فيها
                Surface(
                    color = KhodamThemeColors.SurfaceWhite,
                    border = BorderStroke(1.dp, KhodamThemeColors.BorderSubtle)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 20.dp, vertical = 14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(
                                text = "تطبيق خـدّام",
                                style = MaterialTheme.typography.titleLarge.copy(
                                    fontWeight = FontWeight.Black,
                                    fontSize = 22.sp,
                                    color = KhodamThemeColors.PrimaryNavy
                                )
                            )
                            Text(
                                text = "الأيدي الأمينة والحرفيون المعتمدون في خدمتك",
                                style = MaterialTheme.typography.bodySmall.copy(
                                    color = KhodamThemeColors.TextSecondary,
                                    fontSize = 12.sp
                                )
                            )
                        }

                        // شارة التوثيق
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = KhodamThemeColors.BackgroundLight,
                            border = BorderStroke(1.dp, KhodamThemeColors.BorderSubtle)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Outlined.Verified,
                                    contentDescription = "توثيق رسمي",
                                    tint = KhodamThemeColors.VerifiedGreen,
                                    modifier = Modifier.size(16.dp)
                                )
                                Text(
                                    text = "100% موثق",
                                    color = KhodamThemeColors.PrimaryNavy,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 11.sp
                                )
                            }
                        }
                    }
                }
            }
        ) { innerPadding ->
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding),
                contentPadding = PaddingValues(vertical = 16.dp),
                verticalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                // ==========================================
                // 1. شريط البحث البسيط (Simple Search Bar)
                // ==========================================
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp)
                    ) {
                        OutlinedTextField(
                            value = searchQuery,
                            onValueChange = {
                                searchQuery = it
                                onSearchQueryChange(it)
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(54.dp),
                            placeholder = {
                                Text(
                                    text = "ابحث عن خدمة، سباك، كهربائي، أو حرفي...",
                                    color = KhodamThemeColors.TextSecondary,
                                    fontSize = 13.sp
                                )
                            },
                            leadingIcon = {
                                Icon(
                                    imageVector = Icons.Outlined.Search,
                                    contentDescription = "بحث",
                                    tint = KhodamThemeColors.PrimaryNavy,
                                    modifier = Modifier.size(20.dp)
                                )
                            },
                            shape = RoundedCornerShape(12.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedContainerColor = KhodamThemeColors.SurfaceWhite,
                                unfocusedContainerColor = KhodamThemeColors.SurfaceWhite,
                                focusedBorderColor = KhodamThemeColors.PrimaryNavy,
                                unfocusedBorderColor = KhodamThemeColors.BorderSubtle,
                                cursorColor = KhodamThemeColors.PrimaryNavy
                            ),
                            singleLine = true
                        )
                    }
                }

                // =====================================================================
                // 2. شبكة أيقونات الخدمات (Services Grid - Material Outlined Icons)
                // =====================================================================
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text(
                            text = "خدمات الحرف والصيانة",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = KhodamThemeColors.PrimaryNavy,
                                fontSize = 16.sp
                            )
                        )

                        // تقسيم شبكي لصفوف منتظمة (2 صفوف × 4 أعمدة)
                        val chunkedServices = services.chunked(4)
                        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            chunkedServices.forEach { rowServices ->
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                                ) {
                                    rowServices.forEach { service ->
                                        ServiceGridCard(
                                            service = service,
                                            modifier = Modifier.weight(1f),
                                            onClick = { onServiceClick(service) }
                                        )
                                    }
                                }
                            }
                        }
                    }
                }

                // =====================================================================
                // 3. قائمة أفقية لأفضل الحرفيين (LazyRow - Top Artisans Cards)
                // =====================================================================
                item {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "أفضل الحرفيين المتاحين الآن",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = KhodamThemeColors.PrimaryNavy,
                                    fontSize = 16.sp
                                )
                            )

                            Text(
                                text = "عرض الكل",
                                color = KhodamThemeColors.SecondaryTerracotta,
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                modifier = Modifier.clickable { /* انتقال للدليل الكامل */ }
                            )
                        }

                        // القائمة الأفقية (LazyRow)
                        LazyRow(
                            modifier = Modifier.fillMaxWidth(),
                            contentPadding = PaddingValues(horizontal = 16.dp),
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(topArtisans, key = { it.id }) { artisan ->
                                ArtisanCard(
                                    artisan = artisan,
                                    onContactClick = { onArtisanContactClick(artisan) },
                                    onCardClick = { onArtisanClick(artisan) }
                                )
                            }
                        }
                    }
                }

                // شارة الأمان والضمان في الأسفل
                item {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp),
                        shape = RoundedCornerShape(12.dp),
                        color = KhodamThemeColors.SurfaceWhite,
                        border = BorderStroke(1.dp, KhodamThemeColors.BorderSubtle)
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Surface(
                                shape = CircleShape,
                                color = KhodamThemeColors.PrimaryNavy,
                                modifier = Modifier.size(36.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        imageVector = Icons.Outlined.Security,
                                        contentDescription = "أمان",
                                        tint = Color.White,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            }
                            Column {
                                Text(
                                    text = "ضمان خـدّام للأعمال المنجزة",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 13.sp,
                                    color = KhodamThemeColors.PrimaryNavy
                                )
                                Text(
                                    text = "جميع الحرفيين خضعوا للتحقق من الهوية الوطنية والمؤهلات المهنية.",
                                    fontSize = 11.sp,
                                    color = KhodamThemeColors.TextSecondary
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

/**
 * مكوّن أيقونة الخدمة في الشبكة (Service Grid Card)
 */
@Composable
fun ServiceGridCard(
    service: ServiceItem,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Surface(
        modifier = modifier
            .aspectRatio(0.9f)
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp),
        color = KhodamThemeColors.SurfaceWhite,
        border = BorderStroke(1.dp, KhodamThemeColors.BorderSubtle),
        shadowElevation = 0.dp // مسطح تماماً بدون ظلال مبالغ فيها
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(8.dp),
            horizontalAlignment = Alignment.CenterVertically,
            verticalArrangement = Arrangement.Center
        ) {
            // صندوق الأيقونة بلون كحلي صلب
            Surface(
                shape = RoundedCornerShape(10.dp),
                color = KhodamThemeColors.BackgroundLight,
                border = BorderStroke(1.dp, KhodamThemeColors.BorderSubtle),
                modifier = Modifier.size(42.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = service.icon,
                        contentDescription = service.titleAr,
                        tint = KhodamThemeColors.PrimaryNavy,
                        modifier = Modifier.size(22.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = service.titleAr,
                style = MaterialTheme.typography.bodySmall.copy(
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = KhodamThemeColors.TextPrimary,
                    textAlign = TextAlign.Center
                ),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

/**
 * مكوّن بطاقة الحرفي في القائمة الأفقية (Artisan Horizontal Card)
 */
@Composable
fun ArtisanCard(
    artisan: ArtisanItem,
    modifier: Modifier = Modifier,
    onContactClick: () -> Unit,
    onCardClick: () -> Unit
) {
    Surface(
        modifier = modifier
            .width(185.dp)
            .clickable(onClick = onCardClick),
        shape = RoundedCornerShape(12.dp), // حواف دائرية خفيفة
        color = KhodamThemeColors.SurfaceWhite,
        border = BorderStroke(1.dp, KhodamThemeColors.BorderSubtle),
        shadowElevation = 0.dp // بدون ظلال مبالغ فيها، يعتمد على الحدود الأنيقة
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalAlignment = Alignment.CenterVertically
        ) {
            // صورة دائرية للحرفي مع إطار ناعم
            Box(
                modifier = Modifier
                    .size(68.dp)
                    .clip(CircleShape)
                    .border(2.dp, KhodamThemeColors.BorderSubtle, CircleShape)
            ) {
                AsyncImage(
                    model = artisan.avatarUrl,
                    contentDescription = artisan.name,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // اسم الحرفي
            Text(
                text = artisan.name,
                style = MaterialTheme.typography.bodyMedium.copy(
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp,
                    color = KhodamThemeColors.TextPrimary,
                    textAlign = TextAlign.Center
                ),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            // التخصص
            Text(
                text = artisan.trade,
                style = MaterialTheme.typography.bodySmall.copy(
                    fontSize = 11.sp,
                    color = KhodamThemeColors.TextSecondary,
                    textAlign = TextAlign.Center
                ),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(6.dp))

            // التقييم وعدد المهام
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Icon(
                    imageVector = Icons.Outlined.Star,
                    contentDescription = "تقييم",
                    tint = KhodamThemeColors.StarGold,
                    modifier = Modifier.size(14.dp)
                )
                Text(
                    text = "${artisan.rating}",
                    fontWeight = FontWeight.Bold,
                    fontSize = 12.sp,
                    color = KhodamThemeColors.TextPrimary
                )
                Text(
                    text = "(${artisan.reviewCount})",
                    fontSize = 10.sp,
                    color = KhodamThemeColors.TextSecondary
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // زر تواصل مباشر صلب بلون الكحلي أو القرميدي
            Button(
                onClick = onContactClick,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(36.dp),
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = KhodamThemeColors.PrimaryNavy,
                    contentColor = Color.White
                ),
                contentPadding = PaddingValues(horizontal = 8.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Outlined.Phone,
                        contentDescription = "اتصال",
                        modifier = Modifier.size(14.dp)
                    )
                    Text(
                        text = "تواصل مباشر",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

// معاينة التصميم في Android Studio
@Preview(showBackground = true, locale = "ar")
@Composable
fun PreviewKhodamHomeScreen() {
    KhodamHomeScreen()
}
