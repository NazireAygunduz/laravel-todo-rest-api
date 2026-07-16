<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;


class TodoController extends Controller
{
    
    public function index() //butun todo kayıtlarını getirir
    {
        $todos = Todo::all();//tum todos kayitlari
        return response()->json([//postmana json cevap gonderir
            'data'=> $todos
        ],200);//durum basariyla gerceklesti
    }

    
    public function store(Request $request)//yeni kayit olusturur
    { //request: postmandan gelen tum veriler
        $validated =$request->validate([ //bu veriler dogru mu
            'title'=> ['required', 'string','max:255'], //zorunlu,metin tipli,en fazla 255 karakter olmali
            'description'=> ['nullable','string'], //bos olabilir,metin olmalı
            'is_completed'=> ['sometimes','boolean'],//zorunlu değil, true/false dondurmeli
        ]);
        //validated icinde sadece dogrulanmıs olanlar vardir

        $todo=Todo::create($validated);//dogrulanmis veri todos tablosuna gider

        return response()->json([ //postmana cevap gonderiyoruz
            'message'=> 'Todo oluşturuldu!',
            'data'=>$todo
        ],201);//yeni kayit basariyle olusturuldu
    }

    
    public function show(string $id) //tek bir kaydi goruntuluyoruz show(2) gibi
    {
        $todo = Todo::findOrFail($id); //idsi verilen görevi todos tablosunda bulur

        return response()->json([ //bulunan görevi postmana json olarak gönderir
            'data' => $todo
        ],200);//islem basarili
    }

    
    public function update(Request $request, $id)
    {
        $validated = $request->validate([ //veri kontrol
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description'=> ['sometimes','nullable','string'],
            'is_completed' => ['sometimes', 'boolean'],
        ]);

        $todo = Todo::findOrFail($id);//idye ait todoyu bulur
        $todo->update($validated);//doğrulanan verileri günceller

        return response()->json([
            'message'=> 'Todo başarıyla güncellendi!',
            'data'=> $todo
        ],200);


    }

   
    public function destroy( $id)
    {
        $todo=Todo::findOrFail($id); //silinecek idyi bulur
        $todo->delete(); 
        return response()->json(null,204); 
        //204:silme başarılı cevap gövdesinde gösterilicek bir şey yok
    }
}
