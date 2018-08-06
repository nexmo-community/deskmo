<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class NexmoNumber extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'country', 'number'
    ];

    public function users() {
        return $this->hasMany(User::class);
    }
}
