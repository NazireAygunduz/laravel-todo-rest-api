<?php

namespace App\Notifications;

use App\Models\TaskAssignment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TaskAssignmentRespondedNotification extends Notification
{
    use Queueable;

    public function __construct(public TaskAssignment $assignment) {
    }

    public function via(object $notifiable): array{
        return ['database'];
    }

    public function toArray(object $notifiable): array {
        return [
            'type' => 'task_assignment_responded',
            'assignment_id' => $this->assignment->id,
            'todo_id' => $this->assignment->todo_id,
            'todo_title' => $this->assignment->todo->title,

            'responded_by_user_id' => $this->assignment->user_id,
            'responded_by_name' => $this->assignment->user->name,

            'status' => $this->assignment->status,
            'rejection_note' => $this->assignment->rejection_note,
            'responded_at' => $this->assignment->responded_at,
        ];
    }
}