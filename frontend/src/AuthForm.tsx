import {
  useState,
  type FormEvent,
} from 'react'

import {
  apiRequest,
  saveToken,
} from './api'

export type User = {
  id: number
  name: string
  email: string
} 

type AuthResponse = {
  message: string
  user: User
  token: string
}

type AuthFormProps = {
  onAuthenticated: (user: User) => void
}

function AuthForm({onAuthenticated,}: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation,setPasswordConfirmation,] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>,) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const path =
        mode === 'login'
          ? '/login'
          : '/register'

      const requestBody =
        mode === 'login'
          ? {email,password,}
          : {name,email,password,password_confirmation:passwordConfirmation,}

      const response = await apiRequest(path, 
        {method: 'POST',
        body: JSON.stringify(requestBody),})

      const data =(await response.json()) as AuthResponse
        if (!response.ok) {
        setError( data.message ?? 'İşlem gerçekleştirilemedi.',)
        return
        }

      saveToken(data.token)
      onAuthenticated(data.user)
    }
     
    catch (error) {
      console.error( 'Authentication hatası:',error,)
      setError('Sunucuya bağlanırken hata oluştu.',)
    } 
    
    finally {
      setIsSubmitting(false)
    }
  }

  function changeMode() {
    setMode((currentMode) => currentMode === 'login'
        ? 'register'
        : 'login',
    )

    setName('')
    setEmail('')
    setPassword('')
    setPasswordConfirmation('')
    setError('')
  }

  return (
    <section className="auth-card">
      <h1>
        {mode === 'login'
          ? 'Giriş Yap'
          : 'Kayıt Ol'}
      </h1>

      <p>
        {mode === 'login'
          ? 'Görevlerini görmek için hesabına giriş yap.'
          : 'Kendine ait görev listesini oluştur.'}
      </p>

      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <>
            <label htmlFor="name">
              Ad
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />
          </>
        )}

        <label htmlFor="email">
          E-posta
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
        />

        <label htmlFor="password">
          Şifre
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          minLength={8}
          required
        />

        {mode === 'register' && (
          <>
            <label htmlFor="password-confirmation">
              Şifre tekrarı
            </label>

            <input
              id="password-confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(event) =>
                setPasswordConfirmation(
                  event.target.value,
                )
              }
              minLength={8}
              required
            />
          </>
        )}

        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'İşlem yapılıyor...'
            : mode === 'login'
              ? 'Giriş Yap'
              : 'Kayıt Ol'}
        </button>
      </form>

      <button
        type="button"
        className="auth-switch-button"
        onClick={changeMode}
      >
        {mode === 'login'
          ? 'Hesabın yok mu? Kayıt ol'
          : 'Zaten hesabın var mı? Giriş yap'}
      </button>
    </section>
  )
}

export default AuthForm