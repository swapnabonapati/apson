const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Register new user
router.post('/register', async (req, res) => {
  const {username, email, password} = req.body
  try {
    const user = new User({username, email, password})
    await user.save()
    res.status(201).json({message: 'User registered successfully'})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

// Login user
router.post('/login', async (req, res) => {
  const {email, password} = req.body
  try {
    const user = await User.findOne({email})
    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({id: user._id}, 'your_jwt_secret', {
        expiresIn: '30d',
      })
      res.json({token})
    } else {
      res.status(400).json({message: 'Invalid email or password'})
    }
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

module.exports = router
