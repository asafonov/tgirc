def get_env_value(name, default):
    import os
    env_name = 'TGIRC_' + name
    return os.environ[env_name] if env_name in os.environ else default

def get_user_dir():
    import os
    return os.path.expanduser('~')

def get_config_dir():
    return get_user_dir() + '/.config/tgirc'

def get_config():
    return load_json(get_config_dir() + '/config')

def load_json(filename):
    import json
    f = open(filename)
    data = json.loads(f.read())
    f.close()
    return data
