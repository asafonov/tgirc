from telethon import TelegramClient
import tgirc.api

async def signin():
    client = TelegramClient(tgirc.api.session_file, tgirc.api.config['api_id'], tgirc.api.config['api_hash'])
    await client.connect()
    print('Please enter your phone number:')
    phone = input()
    await client.send_code_request(phone)
    print('Enter OTP:')
    otp = input()
    await client.sign_in(phone, otp)
    print('Done. Press return to quit')
    input()
