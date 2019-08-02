# Deskmo: A Multichannel Helpdesk Sample Application using Nexmo and Laravel

This application featured in Laravel News! Read the installments:

* [Part 1: Sending and receiving SMS Laravel Notifications with Nexmo](https://laravel-news.com/nexmo-sms-laravel-notifications)
* [Part 2: Text-To-Speech calls with Laravel and Nexmo](https://laravel-news.com/text-speech-calls-laravel-nexmo)
* [Part 3: Real-time messaging with Nexmo and Laravel](https://laravel-news.com/real-time-messaging-nexmo-laravel)

The dependencies for this application are:

* A Nexmo account! You can [sign up here](https://dashboard.nexmo.com/sign-up?utm_source=DEV_REL&utm_medium=github&utm_campaign=deskmo) and get a little free credit to play with
* Either a local PHP setup, or Docker (and docker-compose) installed.

If you'd just like to play with the application as-is, you can [run the application locally on your machine](#run-locally) or [use the docker setup](#use-docker),

## Run Locally

There are quite a lot of steps, we've tried to break things down to keep it manageable.

### Get the code

Clone this repository (or fork and clone, as you wish).

Run `composer install`.

Copy the `.env.example` file to `.env`.

You can run `php artisan key:generate` while you're here!

### Configure a database

Edit `.env` to configure your database settings.

Then run `php artisan migrate`.

### Stand by with ngrok

If you are running the project locally, you can use [ngrok](https://ngrok.com) to give the project a local URL. I find it helpful to start the tunnel now, so I have the URL to use in the configuration steps with my nexmo number! The Laravel app will run on port 8000 so the ngrok command will be:

```
ngrok http 8000
```

Copy the URL, you'll see this used later as `[ngrok_url]`.

### Prepare to work with Nexmo

If you don't already have a Nexmo account, you can [sign up here](https://dashboard.nexmo.com).

You will need your API key and secret for your nexmo account.

Install the [Nexmo CLI](https://github.com/Nexmo/nexmo-cli) tool - it's used in the next section.

### Buy and configure a Nexmo number

We will need a number for sending/receiving messages and calls. You can either buy a number through your account dashboard, or using the CLI:

`nexmo number:search [country] --sms`

Choose any number from the resulting list and buy it:

`nexmo number:buy [number] --confirm`

Now we will configure the number for SMS (this is the easy part):

```
nexmo link:sms [number] [ngrok_url]/ticket-entry
```

Next, we need to create an application and link it to our number for voice calls. It's not exactly tricky but it's a bit more involved than the one-liner for SMS!

```
nexmo app:create deskmo [ngrok_url]/webhook/answer [ngrok_url]/webhook/event --keyfile private.key
```

The command outputs a confirmation about the keyfile, and an application UUID. Copy this, it's used as `[app_id]` in the later examples. First we'll use it to link the number to the new app:

```
nexmo link:app [number] [app_id]
```

Now that the Nexmo side of things is set up, we need to add some configuration to the Laravel application itself.

### Configure Nexmo settings in the Laravel app

In the .env file, we have a few things to add:

| `.env` key | Value |
|------------|-------|
|`NEXMO_KEY` | Your API key, you can find this your account dashboard.
|`NEXMO_SECRET` | Your API secret, you can find this your account dashboard.
|`NEXMO_NUMBER` | The `[number]` you bought for this application
|`NEXMO_APPLICATION_ID` | The `[app_id]` you created
|`NEXMO_PRIVATE_KEY` | The *path* to the `private.key` file created when the application was created

You may also find it useful to set `APP_ENV` to "development" and `APP_DEBUG` to "true" in case there are any errors - this way you will see them in the web interface.

Finally, check the `config/services.php` file and update the `nexmo` block there to look like this:

```
'nexmo' => [
    'key' => env('NEXMO_KEY'),
    'secret' => env('NEXMO_SECRET'),
    'sms_from' => env('NEXMO_NUMBER'),
    'private_key' => env('NEXMO_PRIVATE_KEY'),
    'application_id' => env('NEXMO_APPLICATION_ID'),
],
```

### Run the application

Don't look now, I think we made it! Start the server: `php artisan serve` and then visit <http://localhost:8000>. Well done!!

## Use Docker

There is a `docker-compose` setup ready for you to use. Start by cloning the repo.

Copy `.env.docker` to `.env` - this file holds the configuration for the application.

Start the platform with `docker-compose up`.

Before you try to access the application, we need to configure the Laravel application:

* `docker-compose exec web php artisan key:generate` sets up the token for the application
* `docker-compose exec web php artisan migrate` prepares the database for use

## Contributing

We love questions, comments, issues - and especially pull requests. Either open an issue to talk to us, or reach us on twitter: <https://twitter.com/NexmoDev>.


