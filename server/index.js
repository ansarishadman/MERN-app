const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const authentication = require('./routes/authentication')
const categories = require('./routes/categories')
const PORT = 1337

app.use(bodyParser.json())
app.use(cors())

mongoose.connect('mongodb://localhost:27017/mern-app')

app.use('/api/authentication', authentication);
app.use('/api/categories', categories);

app.listen(PORT, () => {
  console.log('Server started on port 1337')
})