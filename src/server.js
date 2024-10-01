const express = require('express')

const app = express()

const hostname = 'localhost'
const port = 8017

app.get('/', (req, res) => {
    res.send('<h2>Hehehe</h2>')
})

app.listen(port, hostname, () => {
    console.log(`Server is running on port ${port}`)
})