<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TicketSubscription extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }
}
