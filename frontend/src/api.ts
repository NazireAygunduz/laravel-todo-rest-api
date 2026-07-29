//bu dosya her requestte tek tek yazmaya gerek kalmadan her yerde kullanmamızı sağlıyor 
const API_URL=import.meta.env.VITE_API_URL

export function getToken(): string | null{
    //export: fonksiyonu başka dosyalarda da kullanabiliriz
    //localStorage: tarayıcının içinde küçük veriler saklar
    return localStorage.getItem('token') 
    //getItem:tarayıcının deposundan token verisini arar
    //token yoksa null döndürür
}

export function saveToken(token: string): void{
    //login işleminden gelen tokenı tarayıcıya kaydeder
    localStorage.setItem('token',token)
    //setItem('a',b)-> a:verinin adı b:saklanacak veri
}

export function removeToken(): void{
    //çıkış yapıldığında tokenı tarayıcıdan sileriz
    localStorage.removeItem('token')
}

export async function apiRequest(path:string, options:RequestInit={},):
//path: endpoint yolu, options: fetch isteği ayarları
//zaman alan işlem -> async
//api cevap verene kadar bekle -> await
Promise<Response> { 
    //promise: gelecekte tamamlanacak işlem
    //response: sunucudan gelen http cevabı
    const token =getToken()//localstoragedeki token alınır
    const headers = new Headers(options.headers)
    headers.set('Accept','application/json')//cevap json olsun

    if(options.body && !headers.has('Content-Type')){
        //body var mı, contenttype ayarlanmış mı
        headers.set('Content-Type', 'application/json')
    }

    if(token){//token varsa request headera eklenir
        headers.set('Authorization',`Bearer ${token}`)
    }

    return fetch(`${API_URL}${path}`,{//fetch tarayıcıdan http isteği gönderir
        ...options,
        headers,
    })
}

