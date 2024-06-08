const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body
        const newPwd = await bcrypt.hash(password, 10)
        await User.create({ email, name, password: newPwd })
        res.status(200).json({ status: 'ok' })
    } catch (e) {
        res.status(500).json({ status: 'error', error: `Error encountered ${e}` })
    }
})

// LOGIN
router.post('/login', async (req, res) => {
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

module.exports = router;
