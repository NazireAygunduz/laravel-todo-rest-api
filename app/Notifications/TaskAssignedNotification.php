<?php

namespace App\Notifications;

use App\Models\TaskAssignment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TaskAssignedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public TaskAssignment $assignment
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'task_assigned',
            'assignment_id' => $this->assignment->id,
            'todo_id' => $this->assignment->todo_id,
            'todo_title' => $this->assignment->todo->title,
            'assigned_by_user_id' => $this->assignment->assigned_by_user_id,
            'assigned_by_name' => $this->assignment->assignedBy->name,
            'due_date' => $this->assignment->todo->due_date,
        ];
    }
}