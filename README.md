tgirc
=====

tgirc is a bridge between telegram and irc so you can chat with your friends on telegram using your favorite irc client.

Installation
------------

Installation is pretty straightforward for a nodejs application:

```bash
npm install tgirc
```

That's it, now you can use it

Configuration
-------------

To start using `tgirc`you need to get `api_id` and `api_hash` for the application:

* Login to [your Telegram account](https://my.telegram.org)
* Select API Development Tools
* Create new application. Remember that your `api_hash` is secret

Usage
-----

First you need to login to your telegram account. To do it use `tgirc` command. Just follow the instructions there. You will be asked for you telegram phone number and OTP code. Please note that 2FA and QR-Code auth currently not supported. Next you will be asked to configure the parameters of irc server to connect for using telegram from your irc client

When you're done with registering your tgirc application it will start automatically right after registration

```bash
asafonov@isengard:~$ tgirc
tgirc started on 127.0.0.1:9099
```

If you see something like this, you may connect to your localhost machine. Here is and example for `irssi`:

```
servers = (
  {
    address = "localhost";
    port = "9099";
    password = "tgirc";
  }
);
```

Have fun!
---------
