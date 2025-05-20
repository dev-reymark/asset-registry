<?php

namespace App\Traits;

use App\Models\History;
use Illuminate\Support\Facades\Auth;

trait LogsHistory
{
    public function logAction(string $action, array $changes = []): void
    {
        History::create([
            'user_id'    => Auth::id(),
            'action'     => $action,
            'model_type' => get_class($this),
            'model_id' => $this->getKey(),
            'changes'    => $changes,
        ]);
    }
}
