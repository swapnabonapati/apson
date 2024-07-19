const express = require('express')
const router = express.Router()
const Note = require('../models/Note')
const jwt = require('jsonwebtoken')

// Middleware to verify token
const protect = async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, 'your_jwt_secret')
      req.user = decoded.id
      next()
    } catch (error) {
      res.status(401).json({message: 'Not authorized, token failed'})
    }
  }
  if (!token) {
    res.status(401).json({message: 'Not authorized, no token'})
  }
}

// Create a new note
router.post('/', protect, async (req, res) => {
  const {title, content, tags, color} = req.body
  try {
    const note = new Note({
      userId: req.user,
      title,
      content,
      tags,
      color,
    })
    await note.save()
    res.status(201).json(note)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

// Get all notes
router.get('/', protect, async (req, res) => {
  try {
    const notes = await Note.find({userId: req.user, isTrashed: false})
    res.json(notes)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

// Update a note
router.put('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
    if (note.userId.toString() !== req.user) {
      return res.status(401).json({message: 'Not authorized'})
    }
    Object.assign(note, req.body)
    await note.save()
    res.json(note)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

// Archive a note
router.put('/:id/archive', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
    if (note.userId.toString() !== req.user) {
      return res.status(401).json({message: 'Not authorized'})
    }
    note.isArchived = !note.isArchived
    await note.save()
    res.json(note)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

// Trash a note
router.put('/:id/trash', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
    if (note.userId.toString() !== req.user) {
      return res.status(401).json({message: 'Not authorized'})
    }
    note.isTrashed = true
    await note.save()
    res.json(note)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

// Get trashed notes
router.get('/trash', protect, async (req, res) => {
  try {
    const notes = await Note.find({userId: req.user, isTrashed: true})
    res.json(notes)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

module.exports = router
