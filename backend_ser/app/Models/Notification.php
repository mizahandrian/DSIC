<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'type', 'title', 'message', 'link',
        'created_by', 'created_by_name', 'is_global'
    ];

    public function reads()
    {
        return $this->hasMany(NotificationRead::class);
    }
}