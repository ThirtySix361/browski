<div align="center">

[![version](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/ThirtySix361/browski/master/src/version.json?&style=for-the-badge&logo=wikidata)](https://github.com/ThirtySix361/browski)
[![Docker Image CI/CD](https://img.shields.io/github/actions/workflow/status/ThirtySix361/browski/docker.yml?style=for-the-badge&logo=github&label=Docker%20Pipeline)](https://github.com/ThirtySix361/browski/actions/workflows/docker.yml) <br>
[![mail](https://img.shields.io/badge/contact-dev%4036ip.de-blue?style=for-the-badge&&logo=maildotru)](mailto:dev@36ip.de)
[![discord](https://img.shields.io/badge/discord-.thirtysix-5865F2?style=for-the-badge&logo=discord)](https://discord.com/users/323043165021929482)

</div>

# Browski

<div align="center">

This container offers a headless browser with an API interface. <br>
It lets you programmatically scrape websites with flexible options <br>
which enables full web scraping without manually opening a browser.

[![features](https://raw.githubusercontent.com/ThirtySix361/browski/master/doc/features.png)](https://github.com/ThirtySix361/browski/)

</div>

## 🌐 links

[source code](https://github.com/ThirtySix361/browski)

## 🔗 dependencies

docker

## 🚀 quick start

step 1.

```bash
git clone https://github.com/ThirtySix361/browski.git
cd browski
```

step 2.

```bash
bash run.sh
# default port is: 7777
# or for custom port use:
bash run.sh <port>
```

## 📖 usage

`Required`: Specify the URL to visit. <br>
`Required`: Execute code or full scripts. <br>
`Optionally`: wait for a CSS selector before running code. <br>
`Optionally`: Use a proxie. <br>
`Optionally`: provide a dataDir to persist browser sessions, allowing reuse of cookies, logins, and other session data across requests.

code eval example
```
curl -X POST http://localhost:7777/run -H "Content-Type: application/json" -d '{
    "url": "https://36ip.de",
    "code": "document.body.innerText"
}'
```

script file example (place your scripts into the mnt scripts directory)
```
curl -X POST http://localhost:7777/run -H "Content-Type: application/json" -d '{
    "url": "https://36ip.de",
    "code": "scripts/body.js"
}'
```

persistant dataDir and waitfor example (place your session into the mnt sessions directory)
```
curl -X POST http://localhost:7777/run -H "Content-Type: application/json" -d '{
    "url": "https://36ip.de",
    "code": "document.body.innerText",
    "waitfor": "body",
    "dataDir": "sessions/mySession"
}'
```

proxy example
```
curl -X POST http://localhost:7777/run -H "Content-Type: application/json" -d '{
    "url": "https://api.ipify.org/?format=json",
    "code": "document.body.innerText",
    "waitfor": "body",
    "dataDir": "sessions/mySession",
    "proxy": "http://139.59.1.14:8080"
}'
```

## 📝 todo list

- [x] container
    - [x] runs as user instead of root
    - [x] allowing multiple instances at same time for unlimited parallel scaling
- [x] api usage
    - [x] code
    - [x] script
    - [x] proxy
    - [x] persistant session
