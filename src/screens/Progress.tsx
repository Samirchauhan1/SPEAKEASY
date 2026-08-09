function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

const weekData = [
  { day: 'Mon', min: 18 },
  { day: 'Tue', min: 25 },
  { day: 'Wed', min: 12 },
  { day: 'Thu', min: 30 },
  { day: 'Fri', min: 20 },
  { day: 'Sat', min: 35 },
  { day: 'Sun', min: 8 },
]
const maxMin = Math.max(...weekData.map(d => d.min))

const recentSounds = [
  { sound: 'R', lang: 'English', pct: 82, trend: '↑' },
  { sound: 'S', lang: 'English', pct: 68, trend: '↑' },
  { sound: 'L', lang: 'English', pct: 91, trend: '↑' },
  { sound: 'श', lang: 'Hindi', pct: 65, trend: '→' },
  { sound: 'क', lang: 'Hindi', pct: 88, trend: '↑' },
]

export default function Progress() {
  return (
    <div className="p-5 pb-24 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-800 text-2xl text-[var(--color-text)] mb-1">
          Progress
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm font-500">Track your improvement over time.</p>
      </div>

      <div className="rounded-2xl p-6 mb-5 flex items-center gap-6"
        style={{ background: 'white', border: '1px solid var(--color-border)' }}>
        <div className="relative">
          <svg width={84} height={84} className="-rotate-90">
            <circle cx={42} cy={42} r={35} fill="none" stroke="#E8E4DF" strokeWidth={8} />
            <circle cx={42} cy={42} r={35} fill="none" stroke="var(--color-primary)" strokeWidth={8}
              strokeDasharray={220} strokeDashoffset={220 - 0.72 * 220} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-display font-800 text-lg" style={{ color: 'var(--color-primary)' }}>72%</div>
        </div>
        <div>
          <div className="font-display font-700 text-lg text-[var(--color-text)]">Overall Progress</div>
          <div className="text-sm text-[var(--color-text-muted)] font-500 mt-0.5">Across all exercises</div>
        </div>
      </div>

      <div className="rounded-2xl p-5 mb-5" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
        <h2 className="font-display font-700 text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-4">By Category</h2>
        <div className="flex flex-col gap-4">
          {[
            { label: 'Letters', pct: 80, color: 'var(--color-primary)' },
            { label: 'Words', pct: 70, color: 'var(--color-accent-green)' },
            { label: 'Sentences', pct: 60, color: 'var(--color-accent-lavender)' },
          ].map(c => (
            <div key={c.label}>
              <div className="flex justify-between text-sm font-600 mb-1.5">
                <span className="text-[var(--color-text)]">{c.label}</span>
                <span style={{ color: c.color }}>{c.pct}%</span>
              </div>
              <ProgressBar pct={c.pct} color={c.color} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'English', pct: 82, flag: '🇬🇧', color: 'var(--color-primary)' },
          { label: 'Hindi', pct: 78, flag: '🇮🇳', color: 'var(--color-accent-peach)' },
        ].map(l => (
          <div key={l.label} className="rounded-xl p-4" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{l.flag}</span>
              <span className="font-display font-700 text-sm text-[var(--color-text)]">{l.label}</span>
            </div>
            <div className="font-display font-800 text-2xl mb-1" style={{ color: l.color }}>{l.pct}%</div>
            <ProgressBar pct={l.pct} color={l.color} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { icon: '✓', value: '87', label: 'Exercises' },
          { icon: '📅', value: '24', label: 'Sessions' },
          { icon: '⏱️', value: '6.2h', label: 'Practice' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="font-display font-800 text-lg text-[var(--color-text)]">{s.value}</div>
            <div className="text-[10px] text-[var(--color-text-muted)] font-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-5 mb-5" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
        <h2 className="font-display font-700 text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Weekly Activity</h2>
        <div className="flex items-end gap-2 h-20">
          {weekData.map(d => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-lg transition-all"
                style={{
                  height: `${(d.min / maxMin) * 64}px`,
                  background: d.day === 'Sat' ? 'var(--color-primary)' : 'var(--color-primary-light)',
                }} />
              <span className="text-[9px] font-700 text-[var(--color-text-muted)]">{d.day}</span>
            </div>
          ))}
        </div>
        <div className="text-xs text-[var(--color-text-muted)] font-500 mt-2">Minutes practiced per day</div>
      </div>

      <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
        <h2 className="font-display font-700 text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Sound Performance</h2>
        <div className="flex flex-col gap-3">
          {recentSounds.map(s => (
            <div key={s.sound + s.lang} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-800 text-sm shrink-0"
                style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                {s.sound}
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs font-600 mb-1">
                  <span className="text-[var(--color-text)]">{s.lang}</span>
                  <span style={{ color: s.trend === '↑' ? 'var(--color-accent-green)' : 'var(--color-text-muted)' }}>
                    {s.trend} {s.pct}%
                  </span>
                </div>
                <ProgressBar pct={s.pct} color={s.pct >= 80 ? 'var(--color-accent-green)' : 'var(--color-primary)'} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
