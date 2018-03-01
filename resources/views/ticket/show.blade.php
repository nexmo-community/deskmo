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

                @if ($conversation_id)
                <div class="panel-body">
                    <form action=""  method="POST" id="add-reply">
                        <div class="form-group">
                            <label for="reply">Add a reply</label>
                            <textarea class="form-control" id="reply" rows="3"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary mb-2" style="display:none;" id="reply-submit">Save</button>
                    </form>
                </div>
                @endif
            </div>
        </div>
    </div>

    <script>
        const USER_JWT = '{{$user_jwt}}';
        const CONVERSATION_ID = '{{$conversation_id}}';
        const TICKET_ID = '{{$ticket->id}}';
    </script>
@endsection
