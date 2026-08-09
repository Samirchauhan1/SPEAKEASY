import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'english' | 'hindi'
export type Category = 'letters' | 'words' | 'sentences'

interface AppState {
  lang: Lang | null
  category: Category | null
  selectedExercise: string | null
  setLang: (l: Lang) => void
  setCategory: (c: Category) => void
  setSelectedExercise: (e: string | null) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang | null>('english')
  const [category, setCategory] = useState<Category | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)

  return (
    <Ctx.Provider value={{ lang, category, selectedExercise, setLang, setCategory, setSelectedExercise }}>
      {children}
    </Ctx.Provider>
  )
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
