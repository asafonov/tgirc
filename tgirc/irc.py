import tgirc.utils
import socket, select, time

def start(privmsg, get_messages, disconnect):
    HOST = tgirc.utils.get_env_value('HOST', '127.0.0.1')
    PORT = int(tgirc.utils.get_env_value('PORT', 9099))
    NICK = tgirc.utils.get_env_value('NICK', 'tgirc')
    PASS = tgirc.utils.get_env_value('PASS', 'tgirc')

    listen_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listen_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    listen_socket.bind((HOST, PORT))
    listen_socket.listen(1)

    print('Starting tgirc on ' + HOST + ':' + str(PORT) + ' ...')

    client_connection, client_address = listen_socket.accept()
    last_ping = time.time()
    _nick = ''
    _pass = ''
    _authorized = False
    _quit = False
    _channels = {}

    while True:
        ready = select.select([client_connection], [], [], 5)

        if not ready[0]:
            if _authorized:
                messages = get_messages()

                if len(messages) > 0:
                    for i in range(len(messages)):
                        body = messages[i][2].split('\n')
                        for j in range(len(body)):
                            command = ':' + messages[i][0] + ' PRIVMSG ' + messages[i][1] + ' :' + body[j]

                            if messages[i][0] != messages[i][1] and messages[i][1] not in _channels:
                                join_command = 'JOIN ' + messages[i][1]
                                client_connection.sendall((join_command + '\n').encode('utf-8'))
                                _channels[messages[i][1]] = True
                                print(join_command)

                            client_connection.sendall((command + '\n').encode('utf-8'))
                            print(command)

            if time.time() - last_ping > 60:
                last_ping = time.time()
                client_connection.sendall(('PING ' + str(time.time()) + '\n').encode('utf-8'))

            continue

        request = client_connection.recv(1024)
        req_s = request.decode('utf-8').split("\n")

        if len(req_s) == 1 and req_s[0] == '':
            _nick = ''
            _pass = ''
            _authorized = False
            client_connection.close()
            client_connection, client_address = listen_socket.accept()

        for i in range(len(req_s)):
            if len(req_s[i]) > 0:
                print('> ' + req_s[i])
                req_s[i] = req_s[i].replace('\r', '')
            if req_s[i][0:4] == 'QUIT':
                _quit = True
            if req_s[i][0:4] == 'NICK':
                _nick = req_s[i][5:]
            if req_s[i][0:4] == 'PASS':
                _pass = req_s[i][5:]
            if req_s[i][0:7] == 'PRIVMSG' and _authorized:
                pos = req_s[i].find(':')
                privmsg(req_s[i][8:pos].strip(), req_s[i][pos+1:])

        if _nick == NICK and _pass == PASS and not _authorized:
            client_connection.sendall(('375 ' + NICK + ' :- Welcome to tgirc!\n').encode('utf-8'))
            _authorized = True

        if _quit:
            break

    client_connection.close()
