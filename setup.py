import setuptools

setuptools.setup(
    name="telegram-irc",
    version="0.1",
    author="Alexander Safonov",
    author_email="me@asafonov.org",
    description="Telegram to irc bridge",
    license="GPL3",
    install_requires=[
        "Telethon==1.24.0"
    ],
    entry_points={
        'console_scripts': [
            'telegramirc=telegramirc.__main__:main',
        ]
    }
)
