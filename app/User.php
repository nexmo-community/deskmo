<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'phone_number'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function latestTicketWithActivity() {
        // Get all tickets this user is watching
        $watchedTickets = TicketSubscription::select('ticket_id')->where('user_id', $this->id)->get()->pluck('ticket_id');

        // Grab the latest ticket with activity that's in this list
        $latestTicketEntry = TicketEntry::select("ticket_id")->whereIn('ticket_id', $watchedTickets)->orderBy('created_at', 'desc')->limit(1)->first();

        // Fetch the actual ticket
        return $latestTicketEntry->ticket()->first();
    }
}
