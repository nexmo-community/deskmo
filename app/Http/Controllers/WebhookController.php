<?php

namespace App\Http\Controllers;

use App\TicketEntry;
use Illuminate\Http\Request;
use Log;
use App\Ticket;

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
            ],
            [
                'action' => 'talk',
                'text' => 'To add a reply, please leave a message after the beep, then press the pound key',
                'voiceName' => 'Brian'
            ],
            [
                "action" => "record",
                "endOnKey" => "#",
                "beepStart" => true
            ]
        ]);
    }

    public function event(Request $request) {
        $params = $request->all();
        Log::info('Call event', $params);
        if (isset($params['recording_url'])) {
            $voiceResponse = $this->transcribeRecording($params['recording_url']);

            $ticket = Ticket::all()->last();
            $user = $ticket->subscribedUsers()->first();

            $entry = new TicketEntry([
                'content' => $voiceResponse,
                'channel' => 'voice',
            ]);

            $entry->user()->associate($user);
            $entry->ticket()->associate($ticket);
            $entry->save();
        }
        return response('', 204);
    }

    public function transcribeRecording($recordingUrl) {
        $audio = \Nexmo::get($recordingUrl)->getBody();

        $client = new \GuzzleHttp\Client([
            'base_uri' => 'https://stream.watsonplatform.net/'
        ]);

        $transcriptionResponse = $client->request('POST', 'speech-to-text/api/v1/recognize', [
            'auth' => ['username', 'password'],
            'headers' => [
                'Content-Type' => 'audio/mpeg',
            ],
            'body' => $audio
        ]);

        $transcription = json_decode($transcriptionResponse->getBody());

        $voiceResponse = '';
        foreach ($transcription->results as $result) {
            $voiceResponse .= $result->alternatives[0]->transcript.' ';
        }

        return $voiceResponse;

    }
}
