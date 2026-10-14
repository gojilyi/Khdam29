import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Sparkles } from 'lucide-react';
import { generateSimulatedVoiceNoteWav } from '../utils/audioRecorder';

interface VoiceNotePlayerProps {
  audioUrl?: string;
  duration?: string;
  isMe?: boolean;
  className?: string;
}

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({
  audioUrl,
  duration = '0:16',
  isMe = false,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0); // 0 to 100
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');
  const [playbackRate, setPlaybackRate] = useState<1 | 1.5 | 2>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fallback sound if audioUrl is missing or changes
  const effectiveAudioUrl = audioUrl || generateSimulatedVoiceNoteWav(6);

  // Static bars heights for visual waveform
  const waveformBars = [
    35, 65, 45, 90, 75, 40, 85, 100, 65, 50, 80, 95, 70, 45, 85, 60, 40, 75, 90, 55, 35
  ];

  // Stop playing if another audio note starts
  useEffect(() => {
    const handleGlobalPause = (e: CustomEvent) => {
      if (e.detail?.url !== effectiveAudioUrl && isPlaying) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlaying(false);
      }
    };

    window.addEventListener('khodam_pause_other_audios' as any, handleGlobalPause as any);
    return () => {
      window.removeEventListener('khodam_pause_other_audios' as any, handleGlobalPause as any);
    };
  }, [effectiveAudioUrl, isPlaying]);

  useEffect(() => {
    let audio: HTMLAudioElement;
    try {
      audio = new Audio(effectiveAudioUrl);
      audioRef.current = audio;
      audio.playbackRate = playbackRate;

      audio.ontimeupdate = () => {
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
          const prog = (audio.currentTime / audio.duration) * 100;
          setPlaybackProgress(Math.min(100, Math.max(0, prog)));

          const mins = Math.floor(audio.currentTime / 60);
          const secs = Math.floor(audio.currentTime % 60);
          setCurrentTimeStr(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        }
      };

      audio.onended = () => {
        setIsPlaying(false);
        setPlaybackProgress(0);
        setCurrentTimeStr('0:00');
      };
    } catch (e) {
      console.warn('Audio init warning:', e);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [effectiveAudioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Notify other players to pause
      window.dispatchEvent(new CustomEvent('khodam_pause_other_audios', { detail: { url: effectiveAudioUrl } }));

      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn('Playback error or user interaction needed:', e);
        setIsPlaying(true);
      });
    }
  };

  const cyclePlaybackRate = () => {
    const nextRate: 1 | 1.5 | 2 = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
    setPlaybackRate(nextRate);
  };

  return (
    <div className={`flex items-center gap-2.5 min-w-[210px] sm:min-w-[240px] max-w-full ${className}`}>
      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-sm cursor-pointer ${
          isMe 
            ? 'bg-white text-amber-600 hover:bg-slate-100' 
            : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
        }`}
        title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل التسجيل الصوتي'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current rtl:translate-x-[-1px] ltr:translate-x-[1px]" />
        )}
      </button>

      {/* Waveform & Progress */}
      <div className="flex-1 space-y-1 min-w-0">
        <div 
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            if (audioRef.current && audioRef.current.duration) {
              audioRef.current.currentTime = clickPos * audioRef.current.duration;
              setPlaybackProgress(clickPos * 100);
            }
          }}
          className="flex items-center gap-[2px] h-6 cursor-pointer py-1"
          title="اضغط للتخطي أو التقديم"
        >
          {waveformBars.map((heightPercent, idx) => {
            const barPos = (idx / waveformBars.length) * 100;
            const isFilled = barPos <= playbackProgress;

            return (
              <span
                key={idx}
                style={{ height: `${heightPercent}%` }}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isFilled
                    ? isMe 
                      ? 'bg-white' 
                      : 'bg-amber-500'
                    : isMe 
                      ? 'bg-amber-200/50' 
                      : 'bg-slate-300 dark:bg-slate-700'
                } ${isPlaying && isFilled ? 'scale-y-110' : ''}`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono opacity-80 select-none">
          <span>{isPlaying ? currentTimeStr : duration}</span>
          <span className="flex items-center gap-1 text-[9px] opacity-75">
            <Volume2 className="w-2.5 h-2.5" />
            <span>تسجيل صوتي</span>
          </span>
        </div>
      </div>

      {/* Speed multiplier pill (1x, 1.5x, 2x) */}
      <button
        type="button"
        onClick={cyclePlaybackRate}
        className={`px-1.5 py-0.5 rounded-md text-[10px] font-black font-mono tracking-tight shrink-0 transition-colors ${
          isMe
            ? 'bg-amber-600/40 hover:bg-amber-600 text-white border border-white/20'
            : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
        }`}
        title="تغيير سرعة التشغيل"
      >
        {playbackRate}x
      </button>
    </div>
  );
};
