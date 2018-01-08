@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="panel panel-default">
                <div class="panel-heading" style="text-align:right;"><a href="{{ route('ticket.create') }}">New Ticket &raquo;</a></div>
                <table class="table table-striped table-bordered">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Entries</th>
                    </tr>
                    </thead>
                    <tbody>
                    @forelse ($tickets as $ticket)
                        <tr>
                            <td><a href="{{ route("ticket.show", $ticket->id) }}">{{ $ticket->id }}</a></td>
                            <td><a href="{{ route("ticket.show", $ticket->id) }}">{{ $ticket->title }}</a></td>
                            <td>{{ $ticket->status }}</td>
                            <td>{{ $ticket->entries()->count() }}</td>
                        </tr>
                    @empty
                        <tr>
                        <td colspan="4">No tickets found</td>
                        </tr>
                    @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
@endsection
