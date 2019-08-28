<?php

namespace App\Http\Controllers;

use Auth;
use App\User;
use App\Ticket;
use App\TicketEntry;
use App\TicketSubscription;
use Illuminate\Http\Request;
use App\Notifications\TicketCreated;
use Notification;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Nexmo;

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
            'notification_method' => 'required',
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

        if ($data['notification_method'] === 'sms') {
            Notification::send($ticket->subscribedUsers()->get(), new TicketCreated($entry));
        } elseif ($data['notification_method'] === 'voice') {
            $currentHost = env('PUBLIC_URL', url('/'));
            $call_options = [
                'to' => [[
                    'type' => 'phone',
                    'number' => $cc->user->phone_number
                ]],
                'from' => [
                    'type' => 'phone',
                    'number' => env('NEXMO_NUMBER')
                ],
                'answer_url' => [$currentHost.'/webhook/answer/'.$entry->id],
                'event_url' => [$currentHost.'/webhook/event']
            ];
            Nexmo::calls()->create($call_options);
        } else {
            throw new \Exception('Invalid notification method provided');
        }

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
        return view('ticket.show', [
            'ticket' => $ticket,
            'user_jwt' => Nexmo::generateJwt([
                'exp' => time() + 3600,
                'sub' => Auth::user()->email,
                'acl' => ["paths" => ["/v1/sessions/**" => (object)[], "/v1/users/**" => (object)[], "/v1/conversations/**" => (object)[]]],
            ]),
            'conversation_id' => $ticket->conversation_id,
        ]);
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
