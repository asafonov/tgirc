def main():
    import tgirc.irc, tgirc.telegram
    tgirc.irc.start(privmsg = tgirc.telegram.send, get_messages = tgirc.telegram.check_messages, disconnect=tgirc.telegram.disconnect)
    tgirc.telegram.client.run_until_disconnected()

if __name__ == "__main__":
    main()
