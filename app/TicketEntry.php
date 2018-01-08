<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use App\Ticket;

class TicketEntry extends Model
{
    protected $fillable = ['content', 'channel'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }
}
