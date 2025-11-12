// src/components/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { supabase } from '../supabaseClient'

export type UserRole = 'administrador' | 'empleado' | 'dirigente'

interface User {
  username: string   // normalmente el email
  role: UserRole
  nombre: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)

  // Escucha cambios de sesión (login / logout / refresh)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email ?? ''
        const role =
          (session.user.user_metadata?.role as UserRole) ?? 'empleado'
        const nombre =
          (session.user.user_metadata?.nombre as string) ?? email

        setUser({ username: email, role, nombre })
      } else {
        setUser(null)
      }
    })

    // Al montar el componente, intentamos recuperar sesión ya existente
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session

      if (session?.user) {
        const email = session.user.email ?? ''
        const role =
          (session.user.user_metadata?.role as UserRole) ?? 'empleado'
        const nombre =
          (session.user.user_metadata?.nombre as string) ?? email

        setUser({ username: email, role, nombre })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      console.error('Error al hacer login:', error)
      return false
    }

    const role =
      (data.user.user_metadata?.role as UserRole) ?? 'empleado'
    const nombre =
      (data.user.user_metadata?.nombre as string) ??
      (data.user.email ?? '')

    setUser({
      username: data.user.email ?? '',
      role,
      nombre,
    })

    return true
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
