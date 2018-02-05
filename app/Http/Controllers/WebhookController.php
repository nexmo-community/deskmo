<?php

namespace App\Http\Controllers;

use App\TicketEntry;
use Illuminate\Http\Request;

class WebhookController extends Controller
{

    public function answer(TicketEntry $ticket) {
        if ($ticket->exists) {
            $content = $ticket->content;
        } else {
            $content = 'Sorry, there has been an error fetching your ticket information';
        }

        return response()->json([
            [
                'action' => 'talk',
                'text' => $content
            ]
        ]);
    }
}
