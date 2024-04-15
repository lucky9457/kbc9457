// routes/diaryEntries.js
const express = require('express');
const router = express.Router();
const DiaryEntry = require('../models/DiaryEntry');

// Create a new diary entry
router.post('/', async (req, res) => {
  try {
    const { title, description, location, photos } = req.body;
    const diaryEntry = new DiaryEntry({ title, description, location, photos, user: req.userId });
    await diaryEntry.save();
    res.status(201).json(diaryEntry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all diary entries
router.get('/', async (req, res) => {
  try {
    const diaryEntries = await DiaryEntry.find({ user: req.userId });
    res.json(diaryEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single diary entry by ID
router.get('/:id', async (req, res) => {
  try {
    const diaryEntry = await DiaryEntry.findOne({ _id: req.params.id, user: req.userId });
    if (!diaryEntry) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }
    res.json(diaryEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a diary entry by ID
router.put('/:id', async (req, res) => {
  try {
    const { title, description, location, photos } = req.body;
    const diaryEntry = await DiaryEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title, description, location, photos },
      { new: true }
    );
    if (!diaryEntry) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }
    res.json(diaryEntry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a diary entry by ID
router.delete('/:id', async (req, res) => {
  try {
    const diaryEntry = await DiaryEntry.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!diaryEntry) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }
    res.json({ message: 'Diary entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
