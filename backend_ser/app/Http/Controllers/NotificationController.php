<?php
namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\NotificationRead;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->query('user_id', 'unknown');

        $notifications = Notification::orderBy('created_at', 'desc')
            ->take(30)
            ->get()
            ->map(function ($n) use ($userId) {
                $isRead = NotificationRead::where('notification_id', $n->id)
                    ->where('user_id', $userId)
                    ->exists();
                return [
                    'id'              => (string) $n->id,
                    'type'            => $n->type,
                    'title'           => $n->title,
                    'message'         => $n->message,
                    'link'            => $n->link,
                    'date'            => $n->created_at->toISOString(),
                    'read'            => $isRead,
                    'userId'          => $n->created_by,
                    'userName'        => $n->created_by_name,
                ];
            });

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
        $userId = $request->user_id ?? 'unknown';
        NotificationRead::firstOrCreate([
            'notification_id' => $id,
            'user_id'         => $userId,
        ]);
        return response()->json(['ok' => true]);
    }

    public function markAllRead(Request $request)
    {
        $userId = $request->user_id ?? 'unknown';
        $notifIds = Notification::pluck('id');
        foreach ($notifIds as $id) {
            NotificationRead::firstOrCreate([
                'notification_id' => $id,
                'user_id'         => $userId,
            ]);
        }
        return response()->json(['ok' => true]);
    }

    public function destroy($id)
    {
        Notification::findOrFail($id)->delete();
        return response()->json(['ok' => true]);
    }

    public function clearAll()
    {
        Notification::truncate();
        return response()->json(['ok' => true]);
    }
}