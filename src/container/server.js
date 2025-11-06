const express = require('express')
const bodyParser = require('body-parser')
const { execFile } = require('child_process')
const path = require('path')

const app = express()
app.use(bodyParser.json({ limit: '2mb' }))

app.post('/run', async (req, res) => {
    const { url, code, waitfor, userDataDir, debug, proxy } = req.body
    if (!url || !code) return res.status(400).json({ error: 'url and code are required' })

    const scriptPath = path.join(__dirname, 'browski.js')

    const args = [url, code, waitfor || '', userDataDir || '', debug || '', proxy || '']

    const child = execFile('node', [scriptPath, ...args], { timeout: 60000 }, (error, stdout, stderr) => {
        if (error) {
            res.status(500).json({ error: error.message, stderr })
        } else {
            res.json({ response: stdout.trim() })
        }
    })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`API running on port ${PORT}`))
