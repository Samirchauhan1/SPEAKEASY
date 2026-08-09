import { useNavigate } from 'react-router-dom'

const recentAdult = [
  { emoji: '🐰', word: 'Rabbit', sound: 'R', score: 85, lang: 'English', time: '10 min ago' },
  { emoji: '🌧️', word: 'Raining', sound: 'R', score: 72, lang: 'English', time: '1 hr ago' },
  { emoji: '—', word: 'संगीत', sound: 'स', score: 90, lang: 'Hindi', time: 'Yesterday' },
]

function ProgressRing({ pct, size = 80, stroke = 7, color }: { pct: number; size?: number; stroke?: number; color: string }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E8E4DF" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()

  const stats = [
    { label: 'Sessions', value: '24', sub: 'this month' },
    { label: 'Exercises', value: '87', sub: 'completed' },
    { label: 'Practice Time', value: '6.2h', sub: 'total' },
  ]

  const recommended = [
    { sound: 'TH', desc: 'Needs practice', lang: 'English', color: 'var(--color-accent-peach-light)', badge: 'var(--color-accent-peach)' },
    { sound: 'श', desc: 'Good progress', lang: 'Hindi', color: 'var(--color-accent-green-light)', badge: 'var(--color-accent-green)' },
  ]

  return (
    <div className="p-6 pb-24 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-800 text-3xl text-[var(--color-text)] mb-1">Good morning, Priya</h1>
        <p className="text-[var(--color-text-muted)] font-500">You have 2 exercises recommended for today.</p>
      </div>

      <div className="rounded-2xl p-6 mb-6 flex items-center gap-6"
        style={{ background: 'white', border: '1px solid var(--color-border)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div className="relative">
          <ProgressRing pct={72} size={80} stroke={8} color="var(--color-primary)" />
          <div className="absolute inset-0 flex items-center justify-center font-display font-800 text-base" style={{ color: 'var(--color-primary)' }}>72%</div>
        </div>
        <div className="flex-1">
          <div className="font-display font-700 text-lg text-[var(--color-text)] mb-1">Overall Progress</div>
          <div className="text-sm text-[var(--color-text-muted)] font-500 mb-3">You're making steady improvement!</div>
          <div className="flex gap-4 text-xs">
            <span><strong className="text-[var(--color-text)]">English</strong> <span className="text-[var(--color-text-muted)]">82%</span></span>
            <span><strong className="text-[var(--color-text)]">Hindi</strong> <span className="text-[var(--color-text-muted)]">78%</span></span>
          </div>
        </div>
        <button
          onClick={() => navigate('/therapy')}
          className="px-5 py-2.5 rounded-xl text-white font-700 text-sm"
          style={{ background: 'var(--color-primary)' }}
        >
          Continue
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
            <div className="font-display font-800 text-2xl text-[var(--color-text)]">{s.value}</div>
            <div className="font-700 text-xs text-[var(--color-text)] mt-0.5">{s.label}</div>
            <div className="text-[10px] text-[var(--color-text-muted)]">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="font-display font-700 text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Recommended for You</h2>
        <div className="grid grid-cols-2 gap-3">
          {recommended.map(r => (
            <button key={r.sound} onClick={() => navigate('/therapy')}
              className="rounded-xl p-4 text-left transition-all hover:-translate-y-0.5"
              style={{ background: r.color, border: '1px solid var(--color-border)' }}>
              <div className="font-display font-800 text-3xl mb-2 text-[var(--color-text)]">{r.sound}</div>
              <div className="text-xs font-700 text-[var(--color-text)]">{r.desc}</div>
              <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{r.lang}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display font-700 text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Recent Activity</h2>
        <div className="flex flex-col gap-2">
          {recentAdult.map(ex => (
            <div key={ex.word} className="flex items-center gap-3 rounded-xl p-3.5"
              style={{ background: 'white', border: '1px solid var(--color-border)' }}>
              <div className="text-lg w-9 h-9 rounded-lg flex items-center justify-center font-700"
                style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                {ex.emoji === '—' ? ex.sound : ex.emoji}
              </div>
              <div className="flex-1">
                <div className="font-700 text-sm text-[var(--color-text)]">{ex.word}</div>
                <div className="text-xs text-[var(--color-text-muted)]">{ex.lang} · {ex.time}</div>
              </div>
              <div className="font-display font-700 text-sm px-2.5 py-1 rounded-lg"
                style={{ background: ex.score >= 80 ? 'var(--color-accent-green-light)' : 'var(--color-primary-light)', color: ex.score >= 80 ? 'var(--color-accent-green)' : 'var(--color-primary)' }}>
                {ex.score}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
