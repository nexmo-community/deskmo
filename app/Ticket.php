<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\User;
use App\TicketEntry;
use App\TicketSubscription;

class Ticket extends Model
{
    protected $fillable = ['title', 'status'];

    public function entries()
    {
        return $this->hasMany(TicketEntry::class);
    }

    public function subscribedUsers()
    {
        return $this->belongsToMany(User::class, 'ticket_subscriptions');
    }
}
