# Deskmo: A Multichannel Helpdesk Sample Application using Nexmo and Laravel

This application was featured in Laravel News! Read the installments:

* [Part 1: Sending and receiving SMS Laravel Notifications with Nexmo](https://laravel-news.com/nexmo-sms-laravel-notifications)
* [Part 2: Text-To-Speech calls with Laravel and Nexmo](https://laravel-news.com/text-speech-calls-laravel-nexmo)
* [Part 3: Real-time messaging with Nexmo and Laravel](https://laravel-news.com/real-time-messaging-nexmo-laravel)

If you'd just like to play with the application as-is, you can [run the application locally on your machine](#run-locally) or [use the docker setup](#use-docker), either way, **read the Pre-Requisites first**.

## Pre-Requisites

Clone this repo to get your copy of the code.

Copy either `.env.example` or `.env.docker` to `.env` (depending on how you intend to run the project) so that you can add a configuration.

### Stand by with ngrok

You can use [ngrok](https://ngrok.com) to give the project a local URL (also use this if you have docker). I find it helpful to start the tunnel now, so I have the URL to use in the configuration steps with my nexmo number! The Laravel app will run on port 8000 so the ngrok command will be:

```
ngrok Http 8000
```

Copy the URL, you'll see this used later as `[ngrok_url]`.

### Prepare to Work with Nexmo

If you don't already have a Nexmo account, you can [sign up here](https://dashboard.nexmo.com/sign-up?utm_source=DEV_REL&utm_medium=github&utm_campaign=deskmo).

You will need your API key and secret for your nexmo account.

Install the [Nexmo CLI](https://github.com/Nexmo/nexmo-cli) tool - it's used in the next section.

### Buy and configure a Nexmo number

We will need several sending/receiving messages and calls. You can either buy a number through your account dashboard or using the CLI:

`nexmo number:search [country] --sms`

Choose any number from the resulting list and buy it:

`nexmo number:buy [number] --confirm`

We need to create an application and link it to our number for voice calls. Use your Ngrok URL in this command:

```
nexmo app:create deskmo [ngrok_url]/webhook/answer [ngrok_url]/webhook/event --keyfile private.key
```

The command outputs a confirmation about the keyfile that is created and an application UUID. Copy this UUID, it's used as `[app_id]` in the later examples. First, we'll use it to link the number to the new app:

```
nexmo link:app [number] [app_id]
```

Now we will configure the number for SMS (this is the easy part):

```
nexmo link:sms [number] [ngrok_url]/ticket-entry
```

That's the Nexmo side of things ready to go. Just a couple more pieces to include before we see the app in action!

### Sign up for IBM Speech to Text

If you want to be able to interact with the application with voice, we'll need to be able to transcribe the words. For this, we'll use the IBM Speech to Text Service.

* Sign in to the [IBM Dashboard](https://cloud.ibm.com) and click "Create Resource".
* Choose "Speech to Text"
* Navigate to the service credentials and copy the `apikey` value.

Now that the external services are set up, we need to add some configuration to the Laravel application itself.

### Configure Nexmo settings in the Laravel app

In the .env file, we have a few things to add:

| `.env` key | Value |
|------------|-------|
|`NEXMO_KEY` | Your API key, you can find this your account dashboard.
|`NEXMO_SECRET` | Your API secret, you can find this your account dashboard.
|`NEXMO_NUMBER` | The `[number]` you bought for this application
|`NEXMO_APPLICATION_ID` | The `[app_id]` you created
|`NEXMO_PRIVATE_KEY` | The *path* to the `private.key` file created when the application was created
|`PUBLIC_URL` | Your `[ngrok_url]` so we can build the webhook URLs correctly
|`IBM_API_KEY` | The `apikey` for the Speech to Text service to enable you to speak back when the app calls you and speaks the new ticket details

You may also find it useful to set `APP_ENV` to "development" and `APP_DEBUG` to "true" in case there are any errors - this way you will see them on the web interface.

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

We're ready to run! Instructions for [running locally](#run-locally) or [using the docker setup](#use-docker) are available.

## Run Locally

*(You did already follow the [Pre-Requisites](#pre-requisites), right??)*

Run `composer install`.

You can run `PHP artisan key: generate` while you're here!

### Configure a database

Edit `.env` to configure your database settings.

Then run `PHP artisan migrate`.

### Run the application

Don't look now, I think we made it! Start the server: `PHP artisan serve` and then visit <http://localhost:8000>. Well done!!

## Use Docker

*(You did already follow the [Pre-Requisites](#pre-requisites), right??)*

There is a `docker-compose` setup ready for you to use.

Start the platform with `docker-compose up`.

Before you try to access the application, we need to configure the Laravel application:

* `docker-compose exec web PHP artisan key: generate` sets up the token for the application
* `docker-compose exec web PHP artisan migrate` prepares the database for use

If both of those commands are completed successfully, then your app is ready for you! Look at <http://localhost:8000>

### Database Access on Docker

This should all work "out of the box" but if you need direct access to the database, you can:

* Run `docker-compose exec Postgres bash`
* Then at the bash prompt type `psql -U deskmo`
* To connect to the database (you already realized it's Postgres), type `\c deskmo`

## Usage

You will need to register before you begin

## Contributing

We love questions, comments, issues - and especially pull requests. Either open an issue to talk to us, or reach us on twitter: <https://twitter.com/NexmoDev>.
