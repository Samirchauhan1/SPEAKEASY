import { useState, useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react'
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

const maxRecordingSeconds = 8

function getSpeechErrorMessage(error: string) {
  switch (error) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Microphone access was blocked. Allow microphone access, then try again.'
    case 'no-speech':
      return 'We could not hear any speech. Move closer to your microphone and try again.'
    case 'audio-capture':
      return 'No microphone was found. Connect a microphone, then try again.'
    case 'network':
      return 'Speech recognition needs a network connection. Check your connection and try again.'
    default:
      return 'Speech recognition could not start. Please try recording again.'
  }
}

export default function Exercise() {
  const { selectedExercise, lang } = useApp()
  const navigate = useNavigate()

  const data = selectedExercise ? (exerciseData[selectedExercise] || exerciseData['rabbit']) : exerciseData['rabbit']

  const [stage, setStage] = useState<Stage>('listen')
  const [playing, setPlaying] = useState(false)
  const [recording, setRecording] = useState(false)
  const [recorded, setRecorded] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [speechError, setSpeechError] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const recordingRef = useRef(false)
  const finalTranscriptRef = useRef('')
  const recognitionSessionRef = useRef(0)

  const speechRecognitionSupported =
    typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)

  const playAudio = () => {
    setPlaying(true)
    setTimeout(() => setPlaying(false), 2000)
  }

  const clearRecordingTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const stopRecognition = () => {
    const recognition = recognitionRef.current
    if (!recognition) return

    try {
      recognition.stop()
    } catch {
      // Recognition may already have stopped after a final result.
    }
  }

  const startRecording = () => {
    if (recordingRef.current) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSpeechError('Speech recognition is not supported in this browser. Try the latest Chrome or Edge.')
      return
    }

    const session = recognitionSessionRef.current + 1
    recognitionSessionRef.current = session
    const recognition = new SpeechRecognition()

    recognition.lang = lang === 'hindi' ? 'hi-IN' : 'en-US'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      if (recognitionSessionRef.current === session) setIsListening(true)
    }

    recognition.onresult = event => {
      if (recognitionSessionRef.current !== session) return

      let nextTranscript = finalTranscriptRef.current
      let nextInterimTranscript = ''

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index]
        const spokenText = result[0]?.transcript.trim() || ''

        if (result.isFinal) {
          nextTranscript = `${nextTranscript} ${spokenText}`.trim()
        } else {
          nextInterimTranscript += `${spokenText} `
        }
      }

      finalTranscriptRef.current = nextTranscript
      setTranscript(nextTranscript)
      setInterimTranscript(nextInterimTranscript.trim())
    }

    recognition.onerror = event => {
      if (recognitionSessionRef.current !== session || event.error === 'aborted') return

      clearRecordingTimer()
      recordingRef.current = false
      setRecording(false)
      setIsListening(false)
      setSpeechError(getSpeechErrorMessage(event.error))
    }

    recognition.onend = () => {
      if (recognitionSessionRef.current !== session) return
      if (recognitionRef.current === recognition) recognitionRef.current = null
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recordingRef.current = true
    finalTranscriptRef.current = ''
    setRecording(true)
    setRecorded(false)
    setRecordingTime(0)
    setTranscript('')
    setInterimTranscript('')
    setSpeechError(null)
    timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000)

    try {
      recognition.start()
    } catch {
      clearRecordingTimer()
      recognitionRef.current = null
      recordingRef.current = false
      setRecording(false)
      setSpeechError('Speech recognition could not start. Please try recording again.')
    }
  }

  const stopRecording = () => {
    if (!recordingRef.current) return

    clearRecordingTimer()
    recordingRef.current = false
    setRecording(false)
    setIsListening(false)
    setInterimTranscript('')
    stopRecognition()
    setRecorded(true)
    setAttempts(a => a + 1)
  }

  useEffect(() => {
    if (recording && recordingTime >= maxRecordingSeconds) stopRecording()
  }, [recordingTime, recording])

  useEffect(() => () => {
    clearRecordingTimer()
    recordingRef.current = false
    recognitionSessionRef.current += 1
    const recognition = recognitionRef.current
    if (recognition) {
      recognition.onstart = null
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      try {
        recognition.abort()
      } catch {
        // Recognition has already ended.
      }
    }
  }, [])

  const submit = () => navigate('/result')
  const tryAgain = () => {
    recognitionSessionRef.current += 1
    stopRecognition()
    recognitionRef.current = null
    finalTranscriptRef.current = ''
    setRecorded(false)
    setRecordingTime(0)
    setTranscript('')
    setInterimTranscript('')
    setSpeechError(null)
    setStage('record')
  }

  const handleRecordPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    startRecording()
  }

  const handleRecordPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    stopRecording()
  }

  const handleRecordKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return
    event.preventDefault()
    startRecording()
  }

  const handleRecordKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    stopRecording()
  }

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
                {recordingTime}s / {maxRecordingSeconds}s
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={!speechRecognitionSupported}
            onPointerDown={handleRecordPointerDown}
            onPointerUp={handleRecordPointerUp}
            onPointerCancel={stopRecording}
            onKeyDown={handleRecordKeyDown}
            onKeyUp={handleRecordKeyUp}
            className={`w-28 h-28 rounded-full flex items-center justify-center text-4xl transition-all select-none disabled:cursor-not-allowed disabled:opacity-50 ${recording ? 'scale-110' : 'active:scale-95 hover:scale-105'}`}
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

          {!speechRecognitionSupported && (
            <p role="alert" className="text-center text-xs font-600 px-3 py-2 rounded-xl" style={{ background: 'var(--color-accent-peach-light)', color: '#B65E34' }}>
              Speech recognition is not available in this browser. Try the latest Chrome or Edge.
            </p>
          )}

          {speechError && (
            <p role="alert" className="text-center text-xs font-600 px-3 py-2 rounded-xl" style={{ background: '#FDECEA', color: '#B54444' }}>
              {speechError}
            </p>
          )}

          {recording && (
            <div className="w-full rounded-2xl p-4" style={{ background: 'var(--color-primary-light)' }} aria-live="polite">
              <div className="flex items-center gap-2 text-xs font-700 mb-2" style={{ color: 'var(--color-primary)' }}>
                <span className={`w-2 h-2 rounded-full ${isListening ? 'animate-pulse' : ''}`} style={{ background: isListening ? '#E55353' : 'var(--color-primary)' }} />
                {isListening ? 'Listening…' : 'Preparing microphone…'}
              </div>
              <p className="text-sm font-600 text-[var(--color-text)] min-h-5">
                {transcript || interimTranscript || 'Start speaking to see your transcript.'}
              </p>
            </div>
          )}

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
              Practice captured
            </p>
            <div className="rounded-xl p-4" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
              <p className="text-xs font-700 mb-1" style={{ color: 'var(--color-text-muted)' }}>Recognised speech</p>
              <p className="font-600 text-sm text-[var(--color-text)]" aria-live="polite">
                {transcript || 'No speech was recognised. Try again and speak clearly into your microphone.'}
              </p>
            </div>
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
