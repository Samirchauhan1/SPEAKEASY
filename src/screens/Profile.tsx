import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const navigate = useNavigate()

  return (
    <div className="p-5 pb-24 max-w-lg mx-auto">
      <h1 className="font-display font-800 text-2xl text-[var(--color-text)] mb-6">Profile</h1>

      <div className="rounded-2xl p-6 mb-5 text-center"
        style={{ background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-accent-lavender-light))', border: '1px solid var(--color-border)' }}>
        <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl mb-3"
          style={{ background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          👤
        </div>
        <div className="font-display font-800 text-xl text-[var(--color-text)]">
          Priya Patel
        </div>
        <div className="text-sm text-[var(--color-text-muted)] font-500 mt-0.5">
          Age 22
        </div>
      </div>

      <div className="rounded-2xl p-5 mb-5" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
        <h2 className="font-display font-700 text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Details</h2>
        {[
          { label: 'Language Preference', value: 'Hindi & English' },
          { label: 'Member Since', value: 'January 2025' },
          { label: 'Practice Goal', value: '15 min / day' },
        ].map(item => (
          <div key={item.label} className="flex justify-between py-2.5 text-sm"
            style={{ borderBottom: '1px solid var(--color-border)' }}>
            <span className="text-[var(--color-text-muted)] font-500">{item.label}</span>
            <span className="font-700 text-[var(--color-text)]">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-5 mb-5" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
        <h2 className="font-display font-700 text-sm text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Progress Summary</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Overall', value: '72%', color: 'var(--color-primary)' },
            { label: 'Sessions', value: '24', color: 'var(--color-accent-peach)' },
            { label: 'Exercises', value: '87 done', color: 'var(--color-accent-green)' },
            { label: 'Practice', value: '6.2h total', color: 'var(--color-accent-lavender)' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3" style={{ background: 'var(--color-bg)' }}>
              <div className="font-display font-800 text-lg" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-[var(--color-text-muted)] font-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate('/')}
        className="w-full py-3.5 rounded-2xl font-700 text-sm"
        style={{ background: 'var(--color-border)', color: 'var(--color-text-muted)' }}
      >
        Back to Welcome Screen
      </button>
    </div>
  )
}
