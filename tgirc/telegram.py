from telethon import TelegramClient, events
import tgirc.api
import asyncio

client = TelegramClient(tgirc.api.session_file, tgirc.api.config['api_id'], tgirc.api.config['api_hash'])
loop = asyncio.get_event_loop()
messages = []
seen_messages = {}

@client.on(events.NewMessage)
async def ololo(event):
    global seen_messages

    if event.id in seen_messages:
        return

    seen_messages[event.id] = True
    chat = await event.get_chat()
    sender = await event.get_sender()
    message = event.raw_text

    if not sender.is_self:
        messages.append([sender.username, message])
        print('< ' + str(sender.username) + ': ' + str(message))

async def _send(to, msg):
    await client.send_message(to, msg)

def send(to, msg):
    loop.run_until_complete(_send(to, msg))

def check_messages():
    global messages
    ret = messages
    messages = []
    loop.run_until_complete(client.catch_up())
    return ret

client.start()
