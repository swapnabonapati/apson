const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], max: 9 },
    color: { type: String, default: '#ffffff' },
    isArchived: { type: Boolean, default: false },
    isTrashed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Note = mongoose.model('Note', NoteSchema);
module.exports = Note;
