import {
  useState,
  type FormEvent,
} from 'react'

import {
  apiRequest,
  removeToken,
} from './api'

type DeleteAccountFormProps = {
  onDeleted: () => void
  onCancel: () => void
}

type DeleteAccountResponse = {
  message?: string
  errors?: {
    password?: string[]
  }
}

function DeleteAccountForm({
  onDeleted,
  onCancel,
}: DeleteAccountFormProps) {
  const [password, setPassword] =
    useState('')

  const [error, setError] =
    useState('')

  const [isDeleting, setIsDeleting] =
    useState(false)

  async function handleDeleteAccount(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const confirmed = window.confirm(
      'Hesabınız ve bütün görevleriniz kalıcı olarak silinecek. Devam etmek istiyor musunuz?',
    )

    if (!confirmed) {
      return
    }

    setError('')
    setIsDeleting(true)

    try {
      const response = await apiRequest(
        '/account',
        {
          method: 'DELETE',

          body: JSON.stringify({
            password,
          }),
        },
      )

      const data =
        (await response.json()) as DeleteAccountResponse

      if (!response.ok) {
        const passwordError =
          data.errors?.password?.[0]

        setError(
          passwordError ??
            data.message ??
            'Hesap silinemedi.',
        )

        return
      }

      removeToken()
      onDeleted()
    } catch (caughtError) {
      console.error(
        'Hesap silme hatası:',
        caughtError,
      )

      setError(
        'Sunucuya bağlanırken hata oluştu.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <section className="delete-account-card">
      <h2>Hesabımı Sil</h2>

      <p>
        Bu işlem hesabınızı ve bütün
        görevlerinizi kalıcı olarak siler.
      </p>

      <form onSubmit={handleDeleteAccount}>
        <label htmlFor="delete-password">
          Mevcut şifreniz
        </label>

        <input
          id="delete-password"
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          required
        />

        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}

        <div className="delete-account-actions">
          <button
            type="submit"
            className="delete-account-confirm-button"
            disabled={isDeleting}
          >
            {isDeleting
              ? 'Hesap siliniyor...'
              : 'Hesabı Kalıcı Olarak Sil'}
          </button>

          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={isDeleting}
          >
            İptal
          </button>
        </div>
      </form>
    </section>
  )
}

export default DeleteAccountForm