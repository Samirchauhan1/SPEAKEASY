import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const exerciseData: Record<string, { emoji: string; label: string; sound: string; tip: string }> = {
  rabbit: { emoji: '🐰', label: 'Rabbit', sound: 'R', tip: 'Curl your tongue slightly and let air flow around it.' },
  rain: { emoji: '🌧️', label: 'Rain', sound: 'R', tip: 'Start with a gentle "rr" vibration at the back of your throat.' },
  red: { emoji: '🍎', label: 'Red', sound: 'R', tip: 'Keep your tongue tip raised slightly behind your upper teeth.' },
  road: { emoji: '🛣️', label: 'Road', sound: 'R', tip: 'Take a slow breath and relax your lips before starting.' },
  lion: { emoji: '🦁', label: 'Lion', sound: 'L', tip: 'Touch your tongue tip lightly to the spot behind your upper teeth.' },
  lamp: { emoji: '🕯️', label: 'Lamp', sound: 'L', tip: 'The "L" sound is made with the tongue tip up.' },
  R: { emoji: '🔤', label: 'R', sound: 'R', tip: 'Curl your tongue slightly. Air flows around the sides.' },
  L: { emoji: '🔤', label: 'L', sound: 'L', tip: 'Tongue tip touches the ridge behind upper teeth.' },
  S: { emoji: '🔤', label: 'S', sound: 'S', tip: 'Air streams over the tongue tip. Keep teeth close together.' },
  SH: { emoji: '🔤', label: 'SH', sound: 'SH', tip: 'Lips are slightly rounded. Tongue is raised.' },
  CH: { emoji: '🔤', label: 'CH', sound: 'CH', tip: 'Start with a T position then release air.' },
  TH: { emoji: '🔤', label: 'TH', sound: 'TH', tip: 'Tongue tip touches or nearly touches the upper front teeth.' },
  kamal: { emoji: '🌸', label: 'कमल', sound: 'क', tip: 'Tongue back touches the soft palate.' },
  sher: { emoji: '🦁', label: 'शेर', sound: 'श', tip: 'Tongue is raised toward the hard palate.' },
  rang: { emoji: '🎨', label: 'रंग', sound: 'र', tip: 'Tongue flaps briefly against the palate.' },
  surya: { emoji: '☀️', label: 'सूरज', sound: 'स', tip: 'Air flows over the tongue tip smoothly.' },
  'क': { emoji: '🌸', label: 'क', sound: 'क', tip: 'Tongue back touches soft palate. Short burst of air.' },
  'ग': { emoji: '🐄', label: 'ग', sound: 'ग', tip: 'Voiced version of क. Vibrate your vocal cords.' },
  'श': { emoji: '🦁', label: 'श', sound: 'श', tip: 'Tongue raised toward palate. Hissing sound.' },
  'र': { emoji: '🎨', label: 'र', sound: 'र', tip: 'Tongue flaps quickly against ridge behind upper teeth.' },
  'ल': { emoji: '💧', label: 'ल', sound: 'ल', tip: 'Tongue tip lightly touches behind upper teeth.' },
  'स': { emoji: '☀️', label: 'स', sound: 'स', tip: 'Like English "S". Smooth airflow over the tongue.' },
  s1: { emoji: '🐰', label: 'The rabbit is running rapidly.', sound: 'R', tip: 'Focus on each R sound. Take your time.' },
  s2: { emoji: '🌹', label: 'She likes red roses.', sound: 'R', tip: 'Smooth transitions between words.' },
  s3: { emoji: '☀️', label: 'The sun shines in the sky.', sound: 'S', tip: 'Keep the S sounds smooth and consistent.' },
  s4: { emoji: '🐔', label: 'The child chased the chicken.', sound: 'CH', tip: 'CH sound: tongue bunches up, quick release.' },
  hs1: { emoji: '🌙', label: 'राम रोज़ रात को खाना खाता है।', sound: 'र', tip: 'Focus on the र sounds. Speak slowly.' },
  hs2: { emoji: '🦁', label: 'शेर जंगल का राजा है।', sound: 'श', tip: 'Clear श sound with raised tongue.' },
  hs3: { emoji: '☀️', label: 'सूरज सुबह उगता है।', sound: 'स', tip: 'Smooth स sounds at the start of each word.' },
}

type Stage = 'listen' | 'record' | 'review'

export default function Exercise() {
  const { selectedExercise } = useApp()
  const navigate = useNavigate()

  const data = selectedExercise ? (exerciseData[selectedExercise] || exerciseData['rabbit']) : exerciseData['rabbit']

  const [stage, setStage] = useState<Stage>('listen')
  const [playing, setPlaying] = useState(false)
  const [recording, setRecording] = useState(false)
  const [recorded, setRecorded] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const playAudio = () => {
    setPlaying(true)
    setTimeout(() => setPlaying(false), 2000)
  }

  const startRecording = () => {
    setRecording(true)
    setRecorded(false)
    setRecordingTime(0)
    timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000)
  }

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setRecording(false)
    setRecorded(true)
    setAttempts(a => a + 1)
  }

  useEffect(() => {
    if (recording && recordingTime >= 8) stopRecording()
  }, [recordingTime, recording])

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const submit = () => navigate('/result')
  const tryAgain = () => { setRecorded(false); setStage('record') }

  const isSentence = ['s1', 's2', 's3', 's4', 'hs1', 'hs2', 'hs3'].includes(selectedExercise || '')

  return (
    <div className="p-5 pb-24 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[var(--color-text-muted)] text-sm font-600 hover:text-[var(--color-text)]">
          ← Back
        </button>
        <div className="flex items-center gap-2 text-xs font-700 px-3 py-1.5 rounded-full"
          style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
          Target Sound: <span className="font-800 ml-1">{data.sound}</span>
        </div>
      </div>

      <div className="rounded-2xl p-6 mb-5 text-center"
        style={{ background: 'white', border: '1px solid var(--color-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        {!isSentence ? (
          <>
            <div className="text-7xl mb-4">{data.emoji}</div>
            <div className="font-display font-800 text-3xl text-[var(--color-text)] mb-1">{data.label}</div>
            <div className="text-sm text-[var(--color-text-muted)] font-500">{data.tip}</div>
          </>
        ) : (
          <>
            <div className="text-4xl mb-4">{data.emoji}</div>
            <div className="font-700 text-xl text-[var(--color-text)] mb-2 leading-relaxed">"{data.label}"</div>
            <div className="text-sm text-[var(--color-text-muted)] font-500">{data.tip}</div>
          </>
        )}
      </div>

      <div className="flex gap-2 mb-5">
        {(['listen', 'record', 'review'] as Stage[]).map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-1">
            <div className={`w-full h-1.5 rounded-full transition-all ${
              stage === s ? 'opacity-100' : i < ['listen','record','review'].indexOf(stage) ? 'opacity-60' : 'opacity-20'
            }`} style={{ background: 'var(--color-primary)' }} />
            <span className="text-[10px] font-700 capitalize" style={{ color: stage === s ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
              {s === 'listen' ? '1. Listen' : s === 'record' ? '2. Record' : '3. Review'}
            </span>
          </div>
        ))}
      </div>

      {stage === 'listen' && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl p-5" style={{ background: 'var(--color-primary-light)' }}>
            <div className="font-display font-700 text-sm text-[var(--color-primary)] mb-3">
              Correct Pronunciation
            </div>
            <button
              onClick={playAudio}
              className={`w-full py-4 rounded-xl text-white font-display font-700 text-lg flex items-center justify-center gap-3 transition-all active:scale-95 ${playing ? 'opacity-80' : ''}`}
              style={{ background: playing ? 'var(--color-primary-dark)' : 'var(--color-primary)' }}
            >
              {playing ? (
                <>
                  <span className="animate-pulse">🔊</span>
                  <span>Playing...</span>
                  <span className="flex gap-0.5 items-end">
                    {[3,5,4,6,3].map((h,i) => (
                      <span key={i} className="w-1 rounded-full animate-pulse bg-white/70 inline-block"
                        style={{ height: h * 4, animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </span>
                </>
              ) : (
                <>🔊 Play Pronunciation</>
              )}
            </button>
            <p className="text-xs text-[var(--color-primary)] mt-2 text-center font-500">
              Replay as needed before recording.
            </p>
          </div>
          <button
            onClick={() => setStage('record')}
            className="w-full py-4 rounded-2xl text-white font-display font-700 text-lg transition-all active:scale-95"
            style={{ background: 'var(--color-accent-green)', boxShadow: '0 4px 16px rgba(114,176,138,0.3)' }}
          >
            I'm Ready to Record →
          </button>
        </div>
      )}

      {stage === 'record' && !recorded && (
        <div className="flex flex-col items-center gap-5">
          <div className="text-center">
            <p className="font-display font-700 text-lg text-[var(--color-text)] mb-1">
              Your Turn to Speak
            </p>
            <p className="text-sm text-[var(--color-text-muted)] font-500">
              Press record and clearly say the sound.
            </p>
          </div>

          {recording && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-0.5 items-end h-12">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-1.5 rounded-full animate-pulse"
                    style={{
                      height: Math.random() * 36 + 8,
                      background: 'var(--color-accent-peach)',
                      animationDelay: `${i * 0.07}s`,
                    }} />
                ))}
              </div>
              <div className="font-display font-800 text-2xl" style={{ color: '#E55353' }}>
                {recordingTime}s
              </div>
            </div>
          )}

          <button
            onPointerDown={startRecording}
            onPointerUp={stopRecording}
            className={`w-28 h-28 rounded-full flex items-center justify-center text-4xl transition-all select-none ${recording ? 'scale-110' : 'active:scale-95 hover:scale-105'}`}
            style={{
              background: recording ? '#FDECEA' : 'var(--color-primary-light)',
              border: `4px solid ${recording ? '#E55353' : 'var(--color-primary)'}`,
              boxShadow: recording ? '0 0 0 8px rgba(229,83,83,0.15)' : '0 6px 20px rgba(107,159,212,0.25)',
            }}
          >
            {recording ? '🔴' : '🎙️'}
          </button>
          <p className="text-xs text-[var(--color-text-muted)] font-500">
            {recording ? 'Release to stop recording' : 'Hold to record'}
          </p>

          <button
            onClick={playAudio}
            className="text-sm font-600 px-4 py-2 rounded-xl"
            style={{ color: 'var(--color-primary)', background: 'var(--color-primary-light)' }}
          >
            🔊 Replay example
          </button>
        </div>
      )}

      {(stage === 'record' && recorded) && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl p-5" style={{ background: 'var(--color-accent-green-light)' }}>
            <p className="font-700 text-sm text-[var(--color-accent-green)] mb-3">
              Recording captured
            </p>
            <button
              onClick={playAudio}
              className="w-full py-3 rounded-xl font-700 text-sm flex items-center justify-center gap-2"
              style={{ background: 'white', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
            >
              ▶ Play My Recording
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-500">
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent-green)' }} />
            Attempt {attempts} recorded
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={tryAgain}
              className="py-3 rounded-xl font-700 text-sm"
              style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              🔄 Try Again
            </button>
            <button
              onClick={submit}
              className="py-3 rounded-xl text-white font-700 text-sm"
              style={{ background: 'var(--color-primary)' }}
            >
              Submit Practice ✓
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
