tgirc
=====

tgirc is a bridge between telegram and irc so you can chat with your friends on telegram using your favorite irc client.

Installation
------------

Installation is pretty straightforward for a python3 application:

```bash
git clone https://github.com/asafonov/tgirc
cd tgirc
sudo python3 setup.py install
```

That's it, now you can use it

Configuration
-------------

To start using `tgirc`you need to get `api_id` and `api_hash` for the application:

* Login to [your Telegram account](https://my.telegram.org)
* Select API Development Tools
* Create new application. Remember that your `api_hash` is secret

Copy `config.example` as `~/.config/tgirc/config`
Edit `~/.config/tgirc/config` filling it with proper values

Usage
-----

First you need to login to your telegram account. To do it use `tgirc` command. Just follow the instructions there. You will be asked for you telegram phone number and OTP code. Please note that 2FA and QR-Code auth currently not supported.

When you're done with registering your tgirc application it will start automatically right after registration

```bash
(venv) asafonov@isengard:~$ tgirc
Starting tgirc on 127.0.0.1:9099 ...
```

If you see something like this, you may connect to your localhost machine on port 9099 with your irc client to use it. You need to login to tgirc server. By default nick is `tgirc` and password is `tgirc`. Here is and example for `irssi`:

```
servers = (
  {
    address = "localhost";
    port = "9099";
    password = "tgirc";
  }
);
```

By default tgirc can be accessed only from `127.0.0.1` ip address on port `9099`. To change the default behaviour you need to define environment variables to override default settings. So if you want to make tgirc accessable from everywhere on port `8000` with `admin` nick and `password` password you do the following:

```bash
export TGIRC_HOST=0.0.0.0
export TGIRC_PORT=8000
export TGIRC_NICK=admin
export TGIRC_PASSWORD=password
```

Have fun!
---------
