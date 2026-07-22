import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'

import './App.css'

type Todo = {
  id: number
  title: string
  description: string | null
  is_completed: boolean
}

function App() {
  const API_URL = import.meta.env.VITE_API_URL
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [todos, setTodos] = useState<Todo[]>([])
  useEffect(() => {
  async function fetchTodos() {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(
          `Görevler alınamadı. Hata kodu: ${response.status}`,
        )
      }

      const data = await response.json()
      console.log('Laravel API cevabı:',data)

      if (Array.isArray(data)) {
      setTodos(data)
      } else if (Array.isArray(data.data)) {
      setTodos(data.data)
      } else if (Array.isArray(data.todos)) {
      setTodos(data.todos)
      } else {
      console.error('API görev listesi döndürmedi:', data)
      setTodos([])
}

    } catch (error) {
      console.error(
        'Görevler alınırken hata oluştu:',
        error,
      )
    }
  }

  fetchTodos()
}, [API_URL])

  async function handleSubmit(
  event: FormEvent<HTMLFormElement>,
) {
  event.preventDefault()

  if (title.trim() === '') {
    alert('Görev başlığı boş bırakılamaz.')
    return
  }

  try {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },

      body: JSON.stringify({
        title: title.trim(),
        description:
          description.trim() === ''
            ? null
            : description.trim(),
        is_completed: false,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()

      console.error(
        'Laravel görev oluşturma hatası:',
        errorData,
      )

      throw new Error(
        `Görev oluşturulamadı. Hata kodu: ${response.status}`,
      )
    }

    const responseData = await response.json()

    console.log(
      'Oluşturulan görev cevabı:',
      responseData,
    )

    const createdTodo: Todo =
      responseData.todo ??
      responseData.data ??
      responseData

    setTodos((currentTodos) => [
      createdTodo,
      ...currentTodos,
    ])

    setTitle('')
    setDescription('')
  } catch (error) {
    console.error(
      'Görev eklenirken hata oluştu:',
      error,
    )

    alert('Görev eklenemedi.')
  }
}


 async function handleDelete(id: number) {
  const onay = window.confirm(
    'Bu görevi silmek istediğinize emin misiniz?',
  )

  if (!onay) {
    return
  }

  try {
    const response = await fetch(
      `${API_URL}/todos/${id}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      },
    )

    if (!response.ok) {
      throw new Error('Görev silinemedi.')
    }

    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== id),
    )
  } catch (error) {
    console.error(error)
    alert('Görev silinirken hata oluştu.')
  }
}

async function handleToggle(todo: Todo) {
  const yeniDurum = !todo.is_completed

  try {
    const response = await fetch(
      `${API_URL}/todos/${todo.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          title: todo.title,
          description: todo.description,
          is_completed: yeniDurum,
        }),
      },
    )

    if (!response.ok) {
      const hataMetni = await response.text()

      console.error(
        'Laravel güncelleme hatası:',
        response.status,
        hataMetni,
      )

      alert(
        `Görev güncellenemedi. Hata kodu: ${response.status}`,
      )

      return
    }

    setTodos((currentTodos) =>
      currentTodos.map((currentTodo) =>
        currentTodo.id === todo.id
          ? {
              ...currentTodo,
              is_completed: yeniDurum,
            }
          : currentTodo,
      ),
    )
  } catch (error) {
    console.error(
      'Görev güncellenirken bağlantı hatası:',
      error,
    )

    alert('Laravel API bağlantısında hata oluştu.')
  }
}

  return (
    <main className="page">
      <section className="todo-container">
        <header className="header">
          <p className="subtitle">
            Laravel REST API Projesi
          </p>

          <h1>Todo List</h1>

          <p>
            Görevlerini oluştur, takip et ve tamamla.
          </p>
        </header>

        <form
          className="todo-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="title">
            Görev başlığı
          </label>

          <input
            id="title"
            type="text"
            placeholder="Todo başlığı oluşturun."
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />

          <label htmlFor="description">
            Görev açıklaması
          </label>

          <textarea
            id="description"
            placeholder="Görev hakkında kısa bir açıklama yaz"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />

          <button type="submit">
            Görev Ekle
          </button>
        </form>

        <section className="todo-list">
          <h2>Görevler</h2>

          {todos.map((todo) => (
            <article
              className={`todo-card ${
                todo.is_completed ? 'completed' : ''
              }`}
              key={todo.id}
            >
              <div>
                <h3>{todo.title}</h3>

                {todo.description && (
                  <p>{todo.description}</p>
                )}
              </div>

              <div className="todo-actions">
                <button
                  type="button"
                  className="complete-button"
                  onClick={() =>
                    handleToggle(todo)
                  }
                >
                  {todo.is_completed
                    ? 'Geri Al'
                    : 'Tamamla'}
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() =>
                    handleDelete(todo.id)
                  }
                >
                  Sil
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  )
}

export default App