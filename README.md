#   bitbloq-frontend
This is the source code of the botbloq Intelligent tutor system frontend. 

The website use node, grunt, bower, and angular 1.x.

To start you need to:

1 . Clone the repo

2 . Execute this command to install all dependencies
```
npm install && bower install
```

3 . Then you need to add the enviroment files:

4 . Create a folder in app/res called config.

5 . Create a file in app/res/config called config.json with this content

```
{
    "env": "local",
    "defaultLang": "es-ES",
    "saveTime": 2000,
    "serverUrl_": "http://localhost:8000/botbloq/v1/its",
    "version": "v0.1.0"
}
```

8 . Execute the command 

```
grunt serve
```
