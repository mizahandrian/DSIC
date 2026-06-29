<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationRead extends Model
{
    protected $fillable = ['notification_id', 'user_id', 'is_hidden'];
}