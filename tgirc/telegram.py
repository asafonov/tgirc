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
    sender = await event.get_sender()
    message = event.raw_text
    username = sender.username if sender.username is not None else sender.phone

    if username is None:
        username = str(sender.first_name) + ' ' + str(sender.last_name)

    if not sender.is_self:
        messages.append([username, message])
        print('< ' + username + ': ' + message)

async def _send(to, msg):
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
