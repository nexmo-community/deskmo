@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="panel panel-default">
                <div class="panel-heading"># {{ $ticket->id }} / {{ $ticket->status }} / {{ $ticket->title }}</div>

                <div class="panel-body">
                    @forelse ($ticket->entries as $entry)
                        <strong>
                            {{ $entry->user->email }} /
                            {{ $entry->channel }} /
                            {{ $entry->created_at->diffForHumans() }}
                        </strong>
                        <p>{{ $entry->content }}</p>
                        <hr />
                    @empty
                        <p>No entries found</p>
                    @endforelse
                </div>
            </div>
        </div>
    </div>
@endsection
