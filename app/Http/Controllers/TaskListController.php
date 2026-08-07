<?php

namespace App\Http\Controllers;

use App\Models\TaskAssignment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;


class TaskListController extends Controller
{
    public function index(Request $request): JsonResponse{
        $lists = $request->user()->taskLists()->latest()->get();

        return response()->json([
            'data'=> $lists,
        ],200);
    }


    public function store(Request $request): JsonResponse{
        $validated = $request->validate([
            'name' => ['required','string','max:255'],
            'description' => ['nullable','string','max:1000'],
        ]);
    $list = $request->user()->taskLists()->create($validated);
    return response()->json([
        'message' => 'Liste başarıyla oluşturuldu.',
        'data' => $list,
    ],201);
    }

    public function show(Request $request, string $id): JsonResponse{
        $list = $request ->user()->taskLists()->findOrFail($id);
        return response()->json([
            'data'=> $list,
        ],200);
    }

    public function update(Request $request, string $id): JsonResponse{
        $validated = $request->validate([
            'name'=> ['sometimes','required','string','max:255'],
            'description' => ['sometimes','nullable','string','max:1000'],
        ]);
        $list = $request->user()->taskLists()->findOrFail($id);
        $list->update($validated);
        return response()->json([
            'message'=>'Liste başariyla güncellendi',
            'data'=> $list,
        ],200);
    }

    public function destroy(Request $request,string $id): JsonResponse{
        $list = $request->user()->taskLists()->findOrFail($id);
        //findorfail verilen id var mı arar, başka kullanıcının listesini bulamaz
        $list->delete();
        return response()->json(null,204);  
    }

    public function todos(Request $request,string $id):JsonResponse{
        $list=$request->user()->taskLists()->findOrFail($id);
        $todos= $list->todos()->latest()->get();

        return response()->json([
            'data' => $todos,
        ],200);
    }


}
