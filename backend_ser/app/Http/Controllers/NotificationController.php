<?php
namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\NotificationRead;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
{
    $userId = (string) $request->query('user_id', 'unknown');

    $notifications = Notification::orderBy('created_at', 'desc')
        ->take(30)
        ->get()
        ->filter(function ($n) use ($userId) {
            $read = \App\Models\NotificationRead::where('notification_id', $n->id)
                ->where('user_id', $userId)
                ->first();
            return !($read && $read->is_hidden);
        })
        ->map(function ($n) use ($userId) {
            $read = \App\Models\NotificationRead::where('notification_id', $n->id)
                ->where('user_id', $userId)
                ->first();
            return [
                'id'       => (string) $n->id,
                'type'     => $n->type,
                'title'    => $n->title,
                'message'  => $n->message,
                'link'     => $n->link,
                'date'     => $n->created_at->toISOString(),
                'read'     => $read ? !$read->is_hidden : false,
                'userId'   => $n->created_by,
                'userName' => $n->created_by_name,
            ];
        })
        ->values();

    return response()->json($notifications);
}
    public function store(Request $request)
    {
        $notif = Notification::create([
            'type'             => $request->type,
            'title'            => $request->title,
            'message'          => $request->message,
            'link'             => $request->link,
            'created_by'       => $request->userId,
            'created_by_name'  => $request->userName,
            'is_global'        => true,
        ]);

        return response()->json(['id' => (string) $notif->id], 201);
    }

    public function markRead(Request $request, $id)
    {
        $userId = (string) ($request->user_id ?? 'unknown');
        NotificationRead::firstOrCreate([
            'notification_id' => $id,
            'user_id'         => $userId,
        ]);
        return response()->json(['ok' => true]);
    }

    public function markAllRead(Request $request)
    {
        $userId = (string) ($request->user_id ?? 'unknown');
        $notifIds = Notification::pluck('id');
        foreach ($notifIds as $id) {
            NotificationRead::firstOrCreate([
                'notification_id' => $id,
                'user_id'         => $userId,
            ]);
        }
        return response()->json(['ok' => true]);
    }

   public function destroy(Request $request, $id)
{
    $userId = (string) ($request->user_id ?? $request->query('user_id', 'unknown'));
    
    \App\Models\NotificationRead::updateOrCreate(
        ['notification_id' => $id, 'user_id' => $userId],
        ['is_hidden' => true]
    );
    
    return response()->json(['ok' => true]);
}

    public function clearAll(Request $request)
{
    $userId = (string) ($request->user_id ?? 'unknown');
    
    $notifIds = Notification::pluck('id');
    foreach ($notifIds as $id) {
        \App\Models\NotificationRead::updateOrCreate(
            ['notification_id' => $id, 'user_id' => $userId],
            ['is_hidden' => true]
        );
    }
    
    return response()->json(['ok' => true]);
}
}