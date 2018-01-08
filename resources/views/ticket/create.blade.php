@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="panel panel-default">
                <div class="panel-heading">Create Ticket</div>

                <div class="panel-body">
                    @if ($errors->any())
                        <div class="alert alert-danger">
                            <ul>
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif
                    {!! Form::model($ticket, ['route' => [$persistRoute]]) !!}
                    <div class="form-group">
                        {!! Form::label('title', 'Title'); !!}
                        {!! Form::text('title', '', ['class' => 'form-control']); !!}
                    </div>
                    <div class="form-group">
                        {!! Form::label('content', 'Content'); !!}
                        {!! Form::textarea('content', '', ['class' => 'form-control']); !!}
                    </div>
                    <div class="form-group">
                        {!! Form::label('recipient', 'Recipient User ID'); !!}
                        {!! Form::text('recipient', '', ['class' => 'form-control']); !!}
                    </div>
                    <div class="form-group">
                        {!! Form::hidden('channel', 'web'); !!}
                        {!! Form::submit('Submit', ['class' => 'btn btn-success']); !!}
                    </div>
                    {!! Form::close() !!}
                </div>
            </div>
        </div>
    </div>
@endsection
