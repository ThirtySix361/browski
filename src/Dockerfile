FROM node:22-slim

RUN apt update
RUN apt upgrade -y

RUN apt-get install -y \
    libglib2.0-0 \
    libnspr4 \
    libnss3 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libcairo2 \
    libpango-1.0-0 \
    libasound2

RUN rm -rf /var/lib/apt/lists/*

RUN useradd -m -s /bin/bash browski
WORKDIR /home/browski/
USER browski

RUN npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth user-agents express body-parser

COPY --chown=browski:browski container/ /home/browski/

EXPOSE 8080

CMD ["bash", "/home/browski/entrypoint.sh"]
