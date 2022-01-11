import tgirc.utils
import os

config = tgirc.utils.get_config()
config_dir = tgirc.utils.get_config_dir()
session_file = config_dir + '/tgirc.session'

if not os.path.exists(config_dir):
    os.mkdir(config_dir)
