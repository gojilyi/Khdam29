import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Lock
} from 'lucide-react';

export const VoiceCallModal: React.FC = () => {
  const { 
    callSession, 
    endCall, 
    toggleCallMute, 
    toggleCallSpeaker, 
    t, 
    language 
  } = useApp();

  if (!callSession.isActive) return null;

  // Realistic Audio generation using browser Web Audio API for call ringing & connection
  React.useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let oscillator: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;
    let intervalId: any = null;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();

        // If call just started (duration < 2s), play gentle telephone ring cadence
        if (callSession.durationSeconds < 2 && !callSession.isMuted) {
          const playRingBeep = () => {
            if (!audioCtx || audioCtx.state === 'closed') return;
            try {
              oscillator = audioCtx.createOscillator();
              gainNode = audioCtx.createGain();
              oscillator.type = 'sine';
              oscillator.frequency.setValueAtTime(425, audioCtx.currentTime); // Standard 425Hz dial tone
              gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
              oscillator.connect(gainNode);
              gainNode.connect(audioCtx.destination);
              oscillator.start();
              oscillator.stop(audioCtx.currentTime + 0.8);
            } catch (e) {
              console.log('Audio ring note', e);
            }
          };

          playRingBeep();
          intervalId = setInterval(playRingBeep, 2000);
        }
      }
    } catch (e) {
      console.log('Web audio unavailable', e);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (audioCtx && audioCtx.state !== 'closed') {
        try { audioCtx.close(); } catch {}
      }
    };
  }, [callSession.isActive, callSession.durationSeconds < 2, callSession.isMuted]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 text-center text-white shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Top security tag */}
        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full mb-6">
          <Lock className="w-3.5 h-3.5" />
          <span>{t.secureCommunicationNotice}</span>
        </div>

        {/* Participant avatar with pulsing audio rings */}
        <div className="relative my-4">
          <div className="w-24 h-24 rounded-full border-4 border-amber-500 overflow-hidden shadow-lg shadow-amber-500/20 mx-auto">
            <img 
              src={callSession.participantAvatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'} 
              alt={callSession.participantName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Animated audio wave rings */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-ping pointer-events-none" />
          <div className="absolute -inset-2 rounded-full border border-amber-400/30 animate-pulse pointer-events-none" />
        </div>

        {/* Participant Name & Status */}
        <h3 className="text-lg font-bold mt-2 flex items-center gap-1.5 justify-center">
          <span>{callSession.participantName}</span>
          <ShieldCheck className="w-4 h-4 text-amber-400" />
        </h3>
        
        <p className="text-xs text-slate-400 mt-1">
          {callSession.participantRole} · {language === 'ar' ? 'رقم آمن مشفر' : 'Masked VoIP'}
        </p>

        {/* Live Call Duration */}
        <div className="my-5 font-mono text-2xl font-bold tracking-widest text-emerald-400 tabular-nums">
          {formatDuration(callSession.durationSeconds)}
        </div>

        {/* In-Call Controls */}
        <div className="flex items-center justify-center gap-6 mt-4 w-full pt-4 border-t border-slate-800">
          {/* Mute button */}
          <button
            onClick={toggleCallMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              callSession.isMuted 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500' 
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title={t.mute}
          >
            {callSession.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End Call Button (Big Red) */}
          <button
            onClick={endCall}
            className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition-transform"
            title={t.endCall}
          >
            <PhoneOff className="w-7 h-7" />
          </button>

          {/* Speaker button */}
          <button
            onClick={toggleCallSpeaker}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              callSession.isSpeaker 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500' 
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title={t.speaker}
          >
            {callSession.isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
