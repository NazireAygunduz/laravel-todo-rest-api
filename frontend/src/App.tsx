import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'

import AuthForm, {
  type User,
} from './AuthForm'

import DeleteAccountForm from './DeleteAccountForm'

import {
  apiRequest,
  getToken,
  removeToken,
} from './api'

import './App.css'

// Backend'den gelen Todo verisinin TypeScript karşılığı.
// list_id görevin hangi listeye ait olduğunu,
// due_date ise görevin son tarihini tutar.
type Todo = {
  id: number
  title: string
  description: string | null
  is_completed: boolean
  list_id: number | null
  due_date: string | null
}

// Backend'den gelen görev listelerinin TypeScript karşılığı.
type TaskList = {
  id: number
  name: string
  description: string | null
}

function App() {
  // Giriş yapmış kullanıcı bilgisini tutar.
  const [user, setUser] =
    useState<User | null>(null)

  // Sayfa ilk açıldığında oturum kontrolü sürerken true olur.
  const [isAuthLoading, setIsAuthLoading] =
    useState(true)

  // Hesap silme formunun açık/kapalı durumunu tutar.
  const [
    showDeleteAccount,
    setShowDeleteAccount,
  ] = useState(false)

  // Liste ekleme ve liste düzenleme alanının açık/kapalı durumunu tutar.
  const [
    showListManager,
    setShowListManager,
  ] = useState(false)

  // Görev ekleme alanının açık/kapalı durumunu tutar.
  const [
    showTodoForm,
    setShowTodoForm,
  ] = useState(false)

  // Yeni görev formundaki başlık ve açıklamayı tutar.
  const [title, setTitle] = useState('')
  const [description, setDescription] =
    useState('')

  // Kullanıcının backend'den gelen görev listelerini tutar.
  const [taskLists, setTaskLists] =
    useState<TaskList[]>([])

  // Yeni görev oluştururken seçilen liste ID'sini tutar.
  const [
    selectedListId,
    setSelectedListId,
  ] = useState('')

  // Yeni görev oluştururken seçilen son tarihi tutar.
  const [dueDate, setDueDate] =
    useState('')

  // "Listelerim" bölümünde oluşturulacak yeni listenin adını tutar.
  const [newListName, setNewListName] =
    useState('')

  // Yeni listenin isteğe bağlı açıklamasını tutar.
  const [
    newListDescription,
    setNewListDescription,
  ] = useState('')

  // Görevler bölümünde hangi listenin gösterileceğini tutar.
  // "all" ise tüm görevler, bir ID ise yalnızca o listenin görevleri gösterilir.
  const [
    selectedTaskListFilter,
    setSelectedTaskListFilter,
  ] = useState('all')

  // Hangi görev listesinin düzenleme modunda olduğunu tutar.
  const [
    editingTaskListId,
    setEditingTaskListId,
  ] = useState<number | null>(null)

  // Liste düzenleme formundaki geçici liste adını tutar.
  const [
    editTaskListName,
    setEditTaskListName,
  ] = useState('')

  // Liste düzenleme formundaki geçici açıklamayı tutar.
  const [
    editTaskListDescription,
    setEditTaskListDescription,
  ] = useState('')

  // Hangi görevin düzenleme modunda olduğunu tutar.
  const [editingId, setEditingId] =
    useState<number | null>(null)

  // Düzenleme formundaki geçici başlığı tutar.
  const [editTitle, setEditTitle] =
    useState('')

  // Düzenleme formundaki geçici açıklamayı tutar.
  const [
    editDescription,
    setEditDescription,
  ] = useState('')

  // Düzenleme sırasında seçilen görev listesinin ID'sini tutar.
  const [editListId, setEditListId] =
    useState('')

  // Düzenleme sırasında seçilen son tarihi tutar.
  const [editDueDate, setEditDueDate] =
    useState('')

  // Kullanıcının Todo kayıtlarını ekranda göstermek için tutar.
  const [todos, setTodos] =
    useState<Todo[]>([])

  // Sayfa ilk açıldığında localStorage'daki tokenı kontrol eder.
  // Token geçerliyse /user endpointine istek gönderip kullanıcıyı oturumda tutar.
  useEffect(() => {
    async function checkAuthentication() {
      const token = getToken()

      if (!token) {
        setIsAuthLoading(false)
        return
      }

      try {
        const response =
          await apiRequest('/user')

        if (!response.ok) {
          removeToken()
          setUser(null)
          return
        }

        const data = await response.json()

        setUser(data.user)
      } catch (error) {
        console.error(
          'Oturum kontrol edilirken hata oluştu:',
          error,
        )

        removeToken()
        setUser(null)
      } finally {
        setIsAuthLoading(false)
      }
    }

    checkAuthentication()
  }, [])

  // Kullanıcı giriş yaptığında backend'den kullanıcının görevlerini getirir.
  // GET /todos isteği gönderir ve gelen görevleri todos state'ine yazar.
  useEffect(() => {
    if (!user) {
      setTodos([])
      return
    }

    async function fetchTodos() {
      try {
        const response =
          await apiRequest('/todos')

        if (response.status === 401) {
          removeToken()
          setUser(null)
          return
        }

        if (!response.ok) {
          throw new Error(
            `Görevler alınamadı. Hata kodu: ${response.status}`,
          )
        }

        const data =
          await response.json()

        console.log(
          'Laravel API cevabı:',
          data,
        )

        if (Array.isArray(data)) {
          setTodos(data)
        } else if (
          Array.isArray(data.data)
        ) {
          setTodos(data.data)
        } else if (
          Array.isArray(data.todos)
        ) {
          setTodos(data.todos)
        } else {
          console.error(
            'API görev listesi döndürmedi:',
            data,
          )

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
  }, [user])

  // Kullanıcı giriş yaptığında backend'den görev listelerini getirir.
  // GET /lists isteği gönderir; gelen listeler formdaki select alanında gösterilir.
  useEffect(() => {
    if (!user) {
      setTaskLists([])
      return
    }

    async function fetchTaskLists() {
      try {
        const response =
          await apiRequest('/lists')

        if (response.status === 401) {
          removeToken()
          setUser(null)
          return
        }

        if (!response.ok) {
          throw new Error(
            `Listeler alınamadı. Hata kodu: ${response.status}`,
          )
        }

        const data =
          await response.json()

        setTaskLists(
          Array.isArray(data.data)
            ? data.data
            : [],
        )
      } catch (error) {
        console.error(
          'Listeler alınırken hata oluştu:',
          error,
        )
      }
    }

    fetchTaskLists()
  }, [user])

  // "Liste Oluştur" butonuna basıldığında çalışır.
  // POST /lists isteği gönderir ve yeni görev listesini backend'e kaydeder.
  async function handleCreateTaskList(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (newListName.trim() === '') {
      alert(
        'Liste adı boş bırakılamaz.',
      )
      return
    }

    try {
      const response =
        await apiRequest('/lists', {
          method: 'POST',

          body: JSON.stringify({
            name: newListName.trim(),
            description:
              newListDescription.trim() === ''
                ? null
                : newListDescription.trim(),
          }),
        })

      if (response.status === 401) {
        removeToken()
        setUser(null)
        return
      }

      if (!response.ok) {
        const errorData =
          await response.json()

        console.error(
          'Liste oluşturma hatası:',
          errorData,
        )

        throw new Error(
          `Liste oluşturulamadı. Hata kodu: ${response.status}`,
        )
      }

      const responseData =
        await response.json()

      const createdList: TaskList =
        responseData.data ??
        responseData

      // Yeni listeyi sayfayı yenilemeden "Listelerim" bölümüne ekler.
      setTaskLists(
        (currentTaskLists) => [
          createdList,
          ...currentTaskLists,
        ],
      )

      // Yeni oluşturulan listeyi görev oluşturma formunda otomatik seçer.
      setSelectedListId(
        String(createdList.id),
      )

      setNewListName('')
      setNewListDescription('')
    } catch (error) {
      console.error(
        'Liste oluşturulurken hata oluştu:',
        error,
      )

      alert('Liste oluşturulamadı.')
    }
  }

  // Bir listenin yanındaki "Düzenle" butonuna basıldığında çalışır.
  // Mevcut liste adı ve açıklamasını düzenleme alanlarına taşır.
  function handleTaskListEditStart(
    list: TaskList,
  ) {
    setEditingTaskListId(list.id)
    setEditTaskListName(list.name)
    setEditTaskListDescription(
      list.description ?? '',
    )
  }

  // Liste düzenleme modunu kapatır ve geçici alanları temizler.
  function handleTaskListEditCancel() {
    setEditingTaskListId(null)
    setEditTaskListName('')
    setEditTaskListDescription('')
  }

  // Liste düzenleme ekranındaki "Kaydet" butonuna basıldığında çalışır.
  // PATCH /lists/{id} isteği ile listenin adını ve açıklamasını günceller.
  async function handleTaskListEditSave(
    list: TaskList,
  ) {
    if (editTaskListName.trim() === '') {
      alert(
        'Liste adı boş bırakılamaz.',
      )
      return
    }

    try {
      const response =
        await apiRequest(
          `/lists/${list.id}`,
          {
            method: 'PATCH',

            body: JSON.stringify({
              name:
                editTaskListName.trim(),
              description:
                editTaskListDescription.trim() ===
                ''
                  ? null
                  : editTaskListDescription.trim(),
            }),
          },
        )

      if (response.status === 401) {
        removeToken()
        setUser(null)
        return
      }

      if (!response.ok) {
        const errorData =
          await response.json()

        console.error(
          'Liste güncelleme hatası:',
          errorData,
        )

        throw new Error(
          `Liste güncellenemedi. Hata kodu: ${response.status}`,
        )
      }

      const responseData =
        await response.json()

      const updatedList: TaskList =
        responseData.data ??
        responseData

      // Güncellenen listeyi sayfayı yenilemeden React state'inde değiştirir.
      setTaskLists(
        (currentTaskLists) =>
          currentTaskLists.map(
            (currentList) =>
              currentList.id === list.id
                ? updatedList
                : currentList,
          ),
      )

      handleTaskListEditCancel()
    } catch (error) {
      console.error(
        'Liste güncellenirken hata oluştu:',
        error,
      )

      alert(
        'Liste güncellenirken hata oluştu.',
      )
    }
  }

  // Bir listenin yanındaki "Sil" butonuna basıldığında çalışır.
  // DELETE /lists/{id} isteği gönderir.
  // Backend'deki nullOnDelete nedeniyle listedeki görevler silinmez;
  // yalnızca bu görevlerin list_id değeri null olur.
  async function handleTaskListDelete(
    list: TaskList,
  ) {
    const taskCount =
      todos.filter(
        (todo) =>
          todo.list_id === list.id,
      ).length

    const confirmationMessage =
      taskCount > 0
        ? `"${list.name}" listesini silmek istediğinize emin misiniz? Bu listedeki ${taskCount} görev silinmeyecek, sadece listesiz kalacak.`
        : `"${list.name}" listesini silmek istediğinize emin misiniz?`

    if (
      !window.confirm(
        confirmationMessage,
      )
    ) {
      return
    }

    try {
      const response =
        await apiRequest(
          `/lists/${list.id}`,
          {
            method: 'DELETE',
          },
        )

      if (response.status === 401) {
        removeToken()
        setUser(null)
        return
      }

      if (!response.ok) {
        const errorText =
          await response.text()

        console.error(
          'Liste silme hatası:',
          response.status,
          errorText,
        )

        throw new Error(
          `Liste silinemedi. Hata kodu: ${response.status}`,
        )
      }

      // Silinen listeyi Listelerim bölümünden kaldırır.
      setTaskLists(
        (currentTaskLists) =>
          currentTaskLists.filter(
            (currentList) =>
              currentList.id !== list.id,
          ),
      )

      // Backend'de nullOnDelete çalıştığı için bu listedeki görevleri
      // frontend tarafında da "listesiz" hale getirir.
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.list_id === list.id
            ? {
                ...todo,
                list_id: null,
              }
            : todo,
        ),
      )

      // Silinen liste filtre olarak seçiliyse tekrar tüm görevleri gösterir.
      if (
        selectedTaskListFilter ===
        String(list.id)
      ) {
        setSelectedTaskListFilter(
          'all',
        )
      }

      // Yeni görev formunda silinen liste seçiliyse seçimi temizler.
      if (
        selectedListId ===
        String(list.id)
      ) {
        setSelectedListId('')
      }

      // Bir görev düzenlenirken silinen liste seçiliyse seçim alanını temizler.
      if (
        editListId ===
        String(list.id)
      ) {
        setEditListId('')
      }

      if (
        editingTaskListId === list.id
      ) {
        handleTaskListEditCancel()
      }
    } catch (error) {
      console.error(
        'Liste silinirken hata oluştu:',
        error,
      )

      alert(
        'Liste silinirken hata oluştu.',
      )
    }
  }

  // "Görev Ekle" butonunun bağlı olduğu form gönderildiğinde çalışır.
  // Formu kontrol eder ve POST /todos ile yeni görevi backend'e gönderir.
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (title.trim() === '') {
      alert(
        'Görev başlığı boş bırakılamaz.',
      )
      return
    }

    if (description.trim() === '') {
      alert(
        'Görev açıklaması boş bırakılamaz.',
      )
      return
    }

    if (selectedListId === '') {
      alert(
        'Bir görev listesi seçmelisiniz.',
      )
      return
    }

    if (dueDate === '') {
      alert(
        'Görev için son tarih seçmelisiniz.',
      )
      return
    }

    try {
      const response =
        await apiRequest('/todos', {
          method: 'POST',

          body: JSON.stringify({
            title: title.trim(),
            description:
              description.trim(),
            is_completed: false,
            list_id:
              Number(selectedListId),
            due_date: dueDate,
          }),
        })

      if (response.status === 401) {
        removeToken()
        setUser(null)
        return
      }

      if (!response.ok) {
        const errorData =
          await response.json()

        console.error(
          'Laravel görev oluşturma hatası:',
          errorData,
        )

        throw new Error(
          `Görev oluşturulamadı. Hata kodu: ${response.status}`,
        )
      }

      const responseData =
        await response.json()

      console.log(
        'Oluşturulan görev cevabı:',
        responseData,
      )

      const createdTodo: Todo =
        responseData.todo ??
        responseData.data ??
        responseData

      // Yeni görevi sayfayı yenilemeden listenin en üstüne ekler.
      setTodos((currentTodos) => [
        createdTodo,
        ...currentTodos,
      ])

      // Görev başarıyla oluşturulduktan sonra formu temizler.
      setTitle('')
      setDescription('')
      setSelectedListId('')
      setDueDate('')
      setShowTodoForm(false)
    } catch (error) {
      console.error(
        'Görev eklenirken hata oluştu:',
        error,
      )

      alert('Görev eklenemedi.')
    }
  }

  // "Sil" butonuna basıldığında çalışır.
  // Kullanıcıdan onay alır ve DELETE /todos/{id} isteği gönderir.
  async function handleDelete(id: number) {
    const onay = window.confirm(
      'Bu görevi silmek istediğinize emin misiniz?',
    )

    if (!onay) {
      return
    }

    try {
      const response =
        await apiRequest(`/todos/${id}`, {
          method: 'DELETE',
        })

      if (response.status === 401) {
        removeToken()
        setUser(null)
        return
      }

      if (!response.ok) {
        throw new Error(
          'Görev silinemedi.',
        )
      }

      // Silinen görevi React state'inden de çıkarır.
      setTodos((currentTodos) =>
        currentTodos.filter(
          (todo) => todo.id !== id,
        ),
      )
    } catch (error) {
      console.error(error)

      alert(
        'Görev silinirken hata oluştu.',
      )
    }
  }

  // "Tamamla" veya "Geri Al" butonuna basıldığında çalışır.
  // PATCH /todos/{id} ile is_completed değerini tersine çevirir.
  async function handleToggle(todo: Todo) {
    const yeniDurum =
      !todo.is_completed

    try {
      const response =
        await apiRequest(
          `/todos/${todo.id}`,
          {
            method: 'PATCH',

            body: JSON.stringify({
              is_completed: yeniDurum,
            }),
          },
        )

      if (response.status === 401) {
        removeToken()
        setUser(null)
        return
      }

      if (!response.ok) {
        const hataMetni =
          await response.text()

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

      // Backend başarılıysa ekrandaki görevin tamamlanma durumunu da günceller.
      setTodos((currentTodos) =>
        currentTodos.map(
          (currentTodo) =>
            currentTodo.id === todo.id
              ? {
                  ...currentTodo,
                  is_completed:
                    yeniDurum,
                }
              : currentTodo,
        ),
      )
    } catch (error) {
      console.error(
        'Görev güncellenirken bağlantı hatası:',
        error,
      )

      alert(
        'Laravel API bağlantısında hata oluştu.',
      )
    }
  }

  // Görevin list_id değerinden ekranda gösterilecek liste adını bulur.
  // Örneğin list_id=4 ise "Staj Görevleri" gibi bir isim döndürür.
  function getTaskListName(
    listId: number | null,
  ) {
    if (listId === null) {
      return 'Liste yok'
    }

    const taskList = taskLists.find(
      (list) => list.id === listId,
    )

    return taskList?.name ?? `Liste #${listId}`
  }

  // Laravel'den gelen tarihi kullanıcıya gg.aa.yyyy biçiminde gösterir.
  // ISO tarih gelirse yalnızca tarih bölümünü kullanır.
  function formatDueDate(
    dateValue: string | null,
  ) {
    if (!dateValue) {
      return 'Son tarih yok'
    }

    const datePart =
      dateValue.slice(0, 10)

    const [year, month, day] =
      datePart.split('-')

    if (!year || !month || !day) {
      return dateValue
    }

    return `${day}.${month}.${year}`
  }

  // "Düzenle" butonuna basıldığında çalışır.
  // Seçilen görevin başlık, açıklama, liste ve tarih bilgilerini düzenleme alanlarına taşır.
  function handleEditStart(todo: Todo) {
    if (todo.is_completed) {
      alert(
        'Tamamlanmış görevler düzenlenemez.',
      )
      return
    }

    setEditingId(todo.id)
    setEditTitle(todo.title)
    setEditDescription(
      todo.description ?? '',
    )
    setEditListId(
      todo.list_id !== null
        ? String(todo.list_id)
        : '',
    )
    setEditDueDate(
      todo.due_date
        ? todo.due_date.slice(0, 10)
        : '',
    )
  }

  // "İptal" butonuna basıldığında düzenleme modunu kapatır
  // ve geçici düzenleme alanlarını temizler.
  function handleEditCancel() {
    setEditingId(null)
    setEditTitle('')
    setEditDescription('')
    setEditListId('')
    setEditDueDate('')
  }

  // Düzenleme modundaki "Kaydet" butonuna basıldığında çalışır.
  // PATCH /todos/{id} ile başlık, açıklama, görev listesi ve son tarihi günceller.
  async function handleEditSave(
    todo: Todo,
  ) {
    if (editTitle.trim() === '') {
      alert(
        'Görev başlığı boş bırakılamaz.',
      )
      return
    }

    if (
      editDescription.trim() === ''
    ) {
      alert(
        'Görev açıklaması boş bırakılamaz.',
      )
      return
    }

    if (editListId === '') {
      alert(
        'Bir görev listesi seçmelisiniz.',
      )
      return
    }

    if (editDueDate === '') {
      alert(
        'Görev için son tarih seçmelisiniz.',
      )
      return
    }

    try {
      const response =
        await apiRequest(
          `/todos/${todo.id}`,
          {
            method: 'PATCH',

            body: JSON.stringify({
              title: editTitle.trim(),
              description:
                editDescription.trim(),
              list_id:
                Number(editListId),
              due_date: editDueDate,
            }),
          },
        )

      if (response.status === 401) {
        removeToken()
        setUser(null)
        return
      }

      if (!response.ok) {
        const errorData =
          await response.json()

        console.error(
          'Görev düzenleme hatası:',
          errorData,
        )

        throw new Error(
          `Görev düzenlenemedi. Hata kodu: ${response.status}`,
        )
      }

      const responseData =
        await response.json()

      const updatedTodo: Todo =
        responseData.data ??
        responseData.todo ??
        responseData

      // Güncellenen görevi React state'inde eski görevin yerine koyar.
      setTodos((currentTodos) =>
        currentTodos.map(
          (currentTodo) =>
            currentTodo.id === todo.id
              ? updatedTodo
              : currentTodo,
        ),
      )

      handleEditCancel()
    } catch (error) {
      console.error(error)

      alert(
        'Görev düzenlenirken hata oluştu.',
      )
    }
  }

  // Login/Register başarılı olduğunda AuthForm bu fonksiyonu çağırır.
  // Gelen kullanıcıyı state'e yazar ve ana uygulama ekranını açar.
  function handleAuthenticated(
    authenticatedUser: User,
  ) {
    setUser(authenticatedUser)
  }

  // Hesap silme işlemi başarılı olduğunda oturumu ve ekrandaki verileri temizler.
  function handleAccountDeleted() {
    setShowDeleteAccount(false)
    setUser(null)
    setTodos([])
    setTaskLists([])
    setSelectedListId('')
    setSelectedTaskListFilter('all')
    setNewListName('')
    setNewListDescription('')
    setEditingTaskListId(null)
    setEditTaskListName('')
    setEditTaskListDescription('')
    setDueDate('')
    handleEditCancel()
  }

  // "Çıkış Yap" butonuna basıldığında POST /logout isteği gönderir.
  // İşlem sonunda tokenı ve kullanıcıya ait ekrandaki verileri temizler.
  async function handleLogout() {
    try {
      await apiRequest('/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error(
        'Çıkış isteği sırasında hata oluştu:',
        error,
      )
    } finally {
      removeToken()
      setShowDeleteAccount(false)
      setUser(null)
      setTodos([])
      setTaskLists([])
      setSelectedListId('')
      setDueDate('')
      handleEditCancel()
    }
  }

  // "Listelerim" bölümündeki seçime göre ekranda gösterilecek görevleri belirler.
  // Backend'den tüm görevler zaten alındığı için burada React tarafında filtreleme yapılır.
  const visibleTodos =
    selectedTaskListFilter === 'all'
      ? todos
      : todos.filter(
          (todo) =>
            todo.list_id ===
            Number(
              selectedTaskListFilter,
            ),
        )

  // Token kontrolü tamamlanana kadar kullanıcıya yüklenme mesajı gösterir.
  if (isAuthLoading) {
    return (
      <main className="page">
        <p>
          Oturum kontrol ediliyor...
        </p>
      </main>
    )
  }

  // Kullanıcı giriş yapmamışsa Todo ekranı yerine giriş/kayıt formunu gösterir.
  if (!user) {
    return (
      <main className="page">
        <AuthForm
          onAuthenticated={
            handleAuthenticated
          }
        />
      </main>
    )
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
            Görevlerini oluştur, takip et
            ve tamamla.
          </p>

          <div className="user-area">
            <span>
              Hoş geldin, {user.name}
            </span>

            <button
              type="button"
              onClick={() =>
                setShowDeleteAccount(
                  true,
                )
              }
            >
              Hesabımı Sil
            </button>

            <button
              type="button"
              onClick={handleLogout}
            >
              Çıkış Yap
            </button>
          </div>
        </header>

        {showDeleteAccount && (
          <DeleteAccountForm
            onDeleted={
              handleAccountDeleted
            }
            onCancel={() =>
              setShowDeleteAccount(
                false,
              )
            }
          />
        )}

        {/* Liste ekleme ve liste düzenleme alanı */}
        <section
          className={`collapsible-card ${
            showListManager ? 'open' : ''
          }`}
        >
          <button
            type="button"
            className="collapsible-card-header"
            onClick={() =>
              setShowListManager(
                (current) => !current,
              )
            }
            aria-expanded={showListManager}
          >
            <span>Liste Ekle</span>

            <span
              className="collapsible-arrow"
              aria-hidden="true"
            >
              ▼
            </span>
          </button>

          {showListManager && (
            <div className="collapsible-card-body">
              <form
                className="list-form"
                onSubmit={
                  handleCreateTaskList
                }
              >
                <div className="list-form-field">
                  <label htmlFor="new-list-name">
                    Liste adı
                  </label>

                  <input
                    id="new-list-name"
                    type="text"
                    maxLength={30}
                    value={newListName}
                    onChange={(event) =>
                      setNewListName(
                        event.target.value,
                      )
                    }
                    placeholder="Örn. Staj Görevleri"
                    required
                  />
                </div>

                <div className="list-form-field">
                  <label htmlFor="new-list-description">
                    Liste açıklaması
                  </label>

                  <input
                    id="new-list-description"
                    type="text"
                    value={
                      newListDescription
                    }
                    onChange={(event) =>
                      setNewListDescription(
                        event.target.value,
                      )
                    }
                    placeholder="İsteğe bağlı açıklama"
                  />
                </div>

                <button type="submit">
                  Liste Oluştur
                </button>
              </form>

              <div className="list-manager">
                <h3>Listeleri Düzenle</h3>

                {taskLists.length === 0 && (
                  <p className="empty-list-message">
                    Henüz görev listesi
                    oluşturmadın.
                  </p>
                )}

                {taskLists.map((list) => {
                  const isEditing =
                    editingTaskListId ===
                    list.id

                  return (
                    <div
                      className="list-manager-row"
                      key={list.id}
                    >
                      {isEditing ? (
                        <div className="list-manager-edit">
                          <input
                            type="text"
                            maxLength={30}
                            value={
                              editTaskListName
                            }
                            onChange={(
                              event,
                            ) =>
                              setEditTaskListName(
                                event.target
                                  .value,
                              )
                            }
                            placeholder="Liste adı"
                          />

                          <input
                            type="text"
                            value={
                              editTaskListDescription
                            }
                            onChange={(
                              event,
                            ) =>
                              setEditTaskListDescription(
                                event.target
                                  .value,
                              )
                            }
                            placeholder="Liste açıklaması"
                          />

                          <div className="list-manager-actions">
                            <button
                              type="button"
                              className="save-button"
                              onClick={() =>
                                handleTaskListEditSave(
                                  list,
                                )
                              }
                            >
                              Kaydet
                            </button>

                            <button
                              type="button"
                              className="cancel-button"
                              onClick={
                                handleTaskListEditCancel
                              }
                            >
                              İptal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="list-manager-info">
                            <strong>
                              {list.name}
                            </strong>

                            {list.description && (
                              <span>
                                {list.description}
                              </span>
                            )}
                          </div>

                          <div className="list-manager-actions">
                            <button
                              type="button"
                              className="edit-button"
                              onClick={() =>
                                handleTaskListEditStart(
                                  list,
                                )
                              }
                            >
                              Düzenle
                            </button>

                            <button
                              type="button"
                              className="delete-button"
                              onClick={() =>
                                handleTaskListDelete(
                                  list,
                                )
                              }
                            >
                              Sil
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </section>

        {/* Görev oluşturma alanı */}
        <section
          className={`collapsible-card ${
            showTodoForm ? 'open' : ''
          }`}
        >
          <button
            type="button"
            className="collapsible-card-header"
            onClick={() =>
              setShowTodoForm(
                (current) => !current,
              )
            }
            aria-expanded={showTodoForm}
          >
            <span>Görev Ekle</span>

            <span
              className="collapsible-arrow"
              aria-hidden="true"
            >
              ▼
            </span>
          </button>

          {showTodoForm && (
            <div className="collapsible-card-body">
              <form
                className="todo-form collapsible-todo-form"
                onSubmit={handleSubmit}
              >
                <label htmlFor="title">
                  Görev başlığı
                </label>

                <input
                  id="title"
                  type="text"
                  required
                  placeholder="Todo başlığı oluşturun."
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value,
                    )
                  }
                />

                <label htmlFor="description">
                  Görev açıklaması
                </label>

                <textarea
                  id="description"
                  required
                  placeholder="Görev hakkında kısa bir açıklama yaz"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                />

                <label htmlFor="task-list">
                  Görev listesi
                </label>

                <select
                  id="task-list"
                  value={selectedListId}
                  onChange={(event) =>
                    setSelectedListId(
                      event.target.value,
                    )
                  }
                  required
                >
                  <option value="">
                    Liste seçin
                  </option>

                  {taskLists.map((list) => (
                    <option
                      key={list.id}
                      value={list.id}
                    >
                      {list.name}
                    </option>
                  ))}
                </select>

                <label htmlFor="due-date">
                  Son tarih
                </label>

                <input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) =>
                    setDueDate(
                      event.target.value,
                    )
                  }
                  required
                />

                <button type="submit">
                  Görev Ekle
                </button>
              </form>
            </div>
          )}
        </section>

        {/* Listeler burada yalnızca görev filtrelemek için gösterilir. */}
        <section className="lists-shortcuts">
          <h2>Listelerim</h2>

          <div className="list-chip-row">
            <button
              type="button"
              className={`list-chip ${
                selectedTaskListFilter ===
                'all'
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                setSelectedTaskListFilter(
                  'all',
                )
              }
              title="Tüm Görevler"
            >
              <span className="list-chip-label">
                Tüm Görevler
              </span>

              <span className="list-chip-count">
                {todos.length}
              </span>
            </button>

            {taskLists.map((list) => {
              const taskCount =
                todos.filter(
                  (todo) =>
                    todo.list_id ===
                    list.id,
                ).length

              return (
                <button
                  type="button"
                  className={`list-chip ${
                    selectedTaskListFilter ===
                    String(list.id)
                      ? 'active'
                      : ''
                  }`}
                  key={list.id}
                  onClick={() =>
                    setSelectedTaskListFilter(
                      String(list.id),
                    )
                  }
                  title={list.name}
                >
                  <span className="list-chip-label">
                    {list.name}
                  </span>

                  <span className="list-chip-count">
                    {taskCount}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="todo-list">
          <h2>Görevlerim</h2>

          {visibleTodos.length === 0 && (
            <p className="empty-list-message">
              Bu listede henüz görev yok.
            </p>
          )}

          {visibleTodos.map((todo) => (
            <article
              className={`todo-card ${
                todo.is_completed
                  ? 'completed'
                  : ''
              }`}
              key={todo.id}
            >
              <div className="todo-content">
                {editingId ===
                todo.id ? (
                  <div className="edit-form">
                    <label>
                      Görev başlığı
                    </label>

                    <input
                      type="text"
                      value={editTitle}
                      onChange={(
                        event,
                      ) =>
                        setEditTitle(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Görev başlığı"
                    />

                    <label>
                      Görev açıklaması
                    </label>

                    <textarea
                      value={
                        editDescription
                      }
                      onChange={(
                        event,
                      ) =>
                        setEditDescription(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Görev açıklaması"
                    />

                    <label>
                      Görev listesi
                    </label>

                    <select
                      value={editListId}
                      onChange={(event) =>
                        setEditListId(
                          event.target.value,
                        )
                      }
                    >
                      <option value="">
                        Liste seçin
                      </option>

                      {taskLists.map(
                        (list) => (
                          <option
                            key={list.id}
                            value={list.id}
                          >
                            {list.name}
                          </option>
                        ),
                      )}
                    </select>

                    <label>
                      Son tarih
                    </label>

                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(event) =>
                        setEditDueDate(
                          event.target.value,
                        )
                      }
                    />
                  </div>
                ) : (
                  <>
                    <h3>
                      {todo.title}
                    </h3>

                    <p>
                      {todo.description}
                    </p>

                    <div className="todo-meta">
                      <span>
                        Liste:{' '}
                        <strong>
                          {getTaskListName(
                            todo.list_id,
                          )}
                        </strong>
                      </span>

                      <span>
                        Son tarih:{' '}
                        <strong>
                          {formatDueDate(
                            todo.due_date,
                          )}
                        </strong>
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="todo-actions">
                {editingId ===
                todo.id ? (
                  <>
                    <button
                      type="button"
                      className="save-button"
                      onClick={() =>
                        handleEditSave(
                          todo,
                        )
                      }
                    >
                      Kaydet
                    </button>

                    <button
                      type="button"
                      className="cancel-button"
                      onClick={
                        handleEditCancel
                      }
                    >
                      İptal
                    </button>
                  </>
                ) : (
                  <>
                    {!todo.is_completed && (
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() =>
                          handleEditStart(
                            todo,
                          )
                        }
                      >
                        Düzenle
                      </button>
                    )}

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
                        handleDelete(
                          todo.id,
                        )
                      }
                    >
                      Sil
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  )
}

export default App