try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup
from tgirc.version import version

config = {
    'description': 'Telegram to irc bridge',
    'version': version,
    'packages': ['tgirc'],
    'scripts': [],
    'name': 'tgirc',
    'license': 'MIT',
    'author': 'Alexander Safonov',
    'author_email': 'me@asafonov.org',
    'install_requires': ['Telethon==1.27.0'],
    'entry_points': {
        'console_scripts': [
            'tgirc = tgirc.__main__:main'
        ]
    },
}

setup(**config)
