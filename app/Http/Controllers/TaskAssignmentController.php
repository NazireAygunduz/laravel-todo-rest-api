<?php

namespace App\Http\Controllers;

use App\Models\TaskAssignment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TaskAssignmentController extends Controller
{
    public function store(Request $request,string $todoId): JsonResponse{
        $validated =$request->validate([
            'user_id'=>['required','integer','exists:users,id'],
        ]);

        $todo=$request->user()->todos()->findOrFail($todoId);

        if((int) $validated['user_id']==(int)$request->user()->id){
            return response()->json([
                'message'=> 'Kendinize görev atayamazsınız',
            ],422);
        }

        $alreadyAssigned = $todo->assignments()
        ->where('user_id',$validated['user_id'])
        ->exists();

        if($alreadyAssigned){
            return response()->json([
                'message' => 'Bu görev zaten bu kullanıcıya atanmış',
            ],422);
        }

        $assignment =$todo->assignments()->create([
            'user_id'=>$validated['user_id'],
            'assigned_by_user_id'=>$request->user()->id,
            'status'=>'pending',
        ]);

        return response()->json([
            'message' => 'Görev kullanıcıya atandı',
            'data'=> $assignment,
        ],201);
    }


    public function incoming(Request $request): JsonResponse{
        $assignments = TaskAssignment::with(['todo','assignedBy:id,name,email'])
        ->where('user_id',$request->user()->id)
        ->latest()->get();

        return response()->json([
            'data'=>$assignments,
        ],200);
    }



    public function accept(Request $request, string $id): JsonResponse{
    $assignment = TaskAssignment::where('user_id', $request->user()->id)->findOrFail($id);

    if ($assignment->status !== 'pending') {
        return response()->json([
            'message' => 'Bu görev zaten cevaplanmış.',
        ], 422);
    }

    $assignment->update([
        'status' => 'accepted',
        'rejection_note' => null,
        'responded_at' => now(),
    ]);

    return response()->json([
        'message' => 'Görev kabul edildi.',
        'data' => $assignment,
    ], 200);
    }




    public function reject(Request $request, string $id): JsonResponse{
    $validated = $request->validate(['rejection_note' => ['required', 'string', 'max:1000'], ]);

    $assignment = TaskAssignment::where('user_id', $request->user()->id)->findOrFail($id);

    if ($assignment->status !== 'pending') {
        return response()->json(['message' => 'Bu görev zaten cevaplanmış.',], 422);
    }

    $assignment->update([
        'status' => 'rejected',
        'rejection_note' => $validated['rejection_note'],
        'responded_at' => now(),
    ]);

    return response()->json([
        'message' => 'Görev reddedildi.',
        'data' => $assignment,
    ], 200);
    }

}
