from telethon import TelegramClient, events
import tgirc.api
import asyncio

client = TelegramClient(tgirc.api.session_file, tgirc.api.config['api_id'], tgirc.api.config['api_hash'])
loop = asyncio.get_event_loop()
messages = []
seen_messages = {}

@client.on(events.NewMessage)
async def new_message_handler(event):
    global seen_messages

    if event.id in seen_messages:
        return

    seen_messages[event.id] = True
    chat = await event.get_chat()
    is_group = False

    try:
      is_group = chat.title
    except AttributeError:
      is_group = False

    sender = await event.get_sender()
    message = event.raw_text
    username = sender.username if sender.username is not None else sender.phone

    if username is None:
        username = 'id' + str(sender.id)

    if not sender.is_self or is_group:
        msg_username = '#' + str(chat.id) if is_group else str(username)
        msg_message = '<' + chat.title + '> ' + str(message) if is_group else str(message)
        messages.append([str(username), msg_username, msg_message])

async def _send(to, msg):
    if to[0:2] == 'id':
        to = int(to[2:])

    if to[0:1] == '#':
        to = int(to[1:])

    await client.send_message(to, msg)

def send(to, msg):
    loop.run_until_complete(_send(to, msg))

def disconnect():
    client.disconnect()

def check_messages():
    global messages
    ret = messages
    messages = []
    loop.run_until_complete(client.catch_up())
    return ret

client.start()
