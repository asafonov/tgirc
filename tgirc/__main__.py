def main():
    import tgirc.irc, tgirc.telegram
    tgirc.irc.start(privmsg = tgirc.telegram.send, get_messages = tgirc.telegram.check_messages)
    tgirc.telegram.client.run_until_disconnected()

def init():
    import tgirc.init
    import asyncio
    loop = asyncio.get_event_loop()
    loop.run_until_complete(tgirc.init.signin())
    loop.close()

if __name__ == "__main__":
    main()
