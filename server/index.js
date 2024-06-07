const express = require('express')
const app = express()
const mongoose = require('mongoose')
const User = require('./models/user.model')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

app.use(bodyParser.json())
app.use(cors())

mongoose.connect('mongodb://localhost:27017/mern-app')

app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body
        const newPwd = await bcrypt.hash(password, 10)
        await User.create({ email, name, password: newPwd })
        res.status(200).json({ status: 'ok' })
    } catch (e) {
        res.status(500).json({ status: 'error', error: `Error encountered ${e}` })
    }
})

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
        return res.status(401).json({ status: 'error', error: 'Invalid login!' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (isPasswordValid) {
        const token = jwt.sign({
            email: user.email,
            name: user.name,
        }, 'secretToken')

        return res.json({ status: 'ok', user: token })
    } else {
        return res.json({ status: 'error', user: false })
    }
})

app.listen(1337, () => {
    console.log('Server started on port 1337')
})