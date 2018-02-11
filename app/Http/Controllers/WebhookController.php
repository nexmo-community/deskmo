<?php

namespace App\Http\Controllers;

use App\TicketEntry;
use Illuminate\Http\Request;
use Log;

class WebhookController extends Controller
{

    public function answer(TicketEntry $ticket) {
        if (!$ticket->exists) {
            return response()->json([
                [
                    'action' => 'talk',
                    'text' => 'Sorry, there has been an error fetching your ticket information'
                ]
            ]);
        }

        return response()->json([
            [
                'action' => 'talk',
                'text' => $ticket->content
            ]
        ]);
    }

    public function event(Request $request) {
        Log::info('Call event', $request->all());
        return response('', 204);
    }
}
