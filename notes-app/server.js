const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
const noteRoutes = require('./routes/noteRoutes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost/notes-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

app.use('/api/users', userRoutes)
app.use('/api/notes', noteRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
