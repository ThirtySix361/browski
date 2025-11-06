
// ------------------------------------------------------------------------------- //

const fs = require('fs');
const path = require('path');

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const userAgent = require('user-agents');
const userAgentString = userAgent.random().toString();

// ------------------------------------------------------------------------------- //

function printUsage(pre) {
    console.error(`error: ${pre}`);
    console.error(`example usage: node ${__filename} "<url to webpage>" "<js code to exec on webpage or filepath>" "<optional: wait for css selector>" "<optional: userDataDir>" "<optional: debugmode>" "<optional: proxy>"`);
    process.exit(1);
}

async function killThisTask(msg="", delay=0) {
    if (timer) { clearTimeout(timer); }
    if ( !timer || !taskHasAlreadyBeenKilled ) {
        timer = setTimeout(async function() {
            taskHasAlreadyBeenKilled = true;
            if (msg) { console.log(msg) }
            if (browser) { try { await browser.close() } catch (e) {} }
        }, delay);
    }
}

// ------------------------------------------------------------------------------- //

var browser;
var timer;
var taskHasAlreadyBeenKilled = false;

var url = process.argv[2] != "#" ? process.argv[2] : "";
var code = process.argv[3] != "#" ? process.argv[3] : "";
var waitfor = process.argv[4] != "#" ? process.argv[4] : "";
var dataDir = process.argv[5] != "#" ? process.argv[5] : "";
var debug = process.argv[6] != "#" ? process.argv[6] : "";
var proxy = process.argv[7] != "#" ? process.argv[7] : "";

if (debug) { console.log(process.argv) }
if (!url) { printUsage("missing url to webpage") };
if (!code) { printUsage("missing js code or script file to exec on webpage") };
if (fs.existsSync(code) && fs.statSync(code).isFile()) { code = fs.readFileSync(code, 'utf-8'); }
if (dataDir) { dataDir = path.resolve(__dirname, dataDir); } else { dataDir = undefined; }

// ------------------------------------------------------------------------------- //

(async () => {

    browser = await puppeteer.launch({
        headless: "new",
        devtools: true,
        args: [...(debug ? ["--remote-debugging-port=9224"] : []), ...(proxy ? [`--proxy-server=${proxy}`] : []), '--window-size=1920,1080', '--start-maximized', '--ignore-certificate-errors', '--no-sandbox', '--disable-web-security', '--disable-setuid-sandbox', '--user-agent=' + userAgentString],
        ignoreDefaultArgs: ['--disable-extensions'],
        userDataDir: dataDir
    });

    [page] = await browser.pages();

    page.on('console', async function (msg) {
        if (msg.type() == "log") {
            console.log("page:", msg.text())
        }
    });

    page.on('load', async () => {

        if (waitfor) {
            try {
                await page.waitForSelector(waitfor, {timeout: 10000});
            } catch (e) {
                killThisTask("waitForSelector timed out");
                return;
            }
        }

        if (!debug) { killThisTask("script timed out", 10000) }

        try {
            response = await page.evaluate(code => eval(code), code);
            if (response) { console.log(response); }
        } catch (e) {}

        if (!debug) { killThisTask() }

    });

    await page.goto(url);

})();
