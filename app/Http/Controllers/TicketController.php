<?php

namespace App\Http\Controllers;

use Auth;
use App\User;
use App\Ticket;
use App\TicketEntry;
use App\TicketSubscription;
use Illuminate\Http\Request;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class TicketController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('ticket/index', ['tickets' => Ticket::all()]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('ticket/create', [
            'ticket' => new Ticket,
            'persistRoute' => 'ticket.store'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required',
            'content' => 'required',
            'recipient' => 'required|exists:users,id',
            'channel' => 'required',
        ]);

        $user = Auth::user();

        $ticket = Ticket::create([
            'title' => $data['title'],
            'status' => 'open'
        ]);

        $entry = new TicketEntry([
            'content' => $data['content'],
            'channel' => $data['channel'],
        ]);

        $entry->user()->associate($user);
        $entry->ticket()->associate($ticket);
        $entry->save();

        $cc = new TicketSubscription();
        $cc->user()->associate(User::find($data['recipient']));
        $cc->ticket()->associate($ticket);
        $cc->save();

        return redirect(route('ticket.index'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Ticket $ticket)
    {
        return view('ticket.show', ['ticket' => $ticket]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        throw new NotFoundHttpException();
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
        throw new NotFoundHttpException();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        throw new NotFoundHttpException();
    }
}
