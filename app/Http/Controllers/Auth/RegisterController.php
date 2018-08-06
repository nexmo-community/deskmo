<?php

namespace App\Http\Controllers\Auth;

use App\NexmoNumber;
use App\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\RegistersUsers;
use Nexmo;
use Nexmo\User\User as NexmoUser;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * @var Nexmo\Client
     */
    private $nexmoClient;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Nexmo\Client $nexmoClient)
    {
        $this->middleware('guest');
        $this->nexmoClient = $nexmoClient;
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'phone_number' => 'required|unique:users',
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create(array $data)
    {
        $basicNumberInsight = $this->nexmoClient->insights()->basic($data['phone_number']);
        $nexmoNumber = NexmoNumber::where('country', '=' , $basicNumberInsight['country_code'])->firstOrFail();
        $user = (new NexmoUser())->setName($data['email']);
        $nexmoUser = Nexmo::user()->create($user);

        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'phone_number' => $data['phone_number'],
            'nexmo_id' => $nexmoUser->getId(),
            'nexmo_number_id' => $nexmoNumber->id
        ]);
    }
}
