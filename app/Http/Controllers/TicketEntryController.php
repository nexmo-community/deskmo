<?php

namespace App\Http\Controllers;

use App\User;
use App\TicketEntry;
use App\Ticket;
use Illuminate\Http\Request;

class TicketEntryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $this->validate($request, [
            'nexmo_id' => 'required_without_all:msisdn',
            'ticket_id' => 'required_without_all:msisdn',
            'msisdn' => 'required_without_all:nexmo_id',
            'text' => 'required'
        ]);

        if (isset($data['msisdn'])) {
            $user = User::where('phone_number', $data['msisdn'])->firstOrFail();
            $ticket = $user->latestTicketWithActivity();
            $channel = 'sms';
        } else {
            $user = User::where('nexmo_id', $data['nexmo_id'])->firstOrFail();
            $ticket = Ticket::findOrFail($data['ticket_id']);
            $channel = 'web';
        }

        $entry = new TicketEntry([
            'content' => $data['text'],
            'channel' => $channel,
        ]);

        $entry->user()->associate($user);
        $entry->ticket()->associate($ticket);
        $entry->save();

        return response('', 204);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
