<?php

namespace App\Http\Controllers;

use App\Models\History;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HistoryController extends Controller
{
    public function index(Request $request)
    {
        $query = History::with('user')->latest();

        if ($request->search) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->action) {
            $query->where('action', $request->action);
        }

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('created_at', [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59',
            ]);
        }

        $histories = $query->paginate(5)->withQueryString();

        $actions = History::distinct()->pluck('action');

        return Inertia::render('History/LogsHistory', [
            'histories' => $histories,
            'filters' => [
                'search' => $request->search,
                'action' => $request->action,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ],
            'actions' => $actions,
        ]);
    }
}
