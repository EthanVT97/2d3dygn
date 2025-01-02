const express = require('express');
const router = express.Router();
const Match = require('../models/match');
const auth = require('../middleware/auth');

// Get all matches
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find().sort({ date: 1 });
    
    // Separate matches into upcoming and finished
    const currentDate = new Date();
    const upcomingMatches = matches.filter(match => 
      new Date(match.date) >= currentDate || match.status === 'upcoming' || match.status === 'live'
    );
    const finishedMatches = matches.filter(match => 
      new Date(match.date) < currentDate && match.status === 'finished'
    );

    res.json({
      upcoming: upcomingMatches,
      finished: finishedMatches
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get match by ID
router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new match (admin only)
router.post('/', auth.adminRequired, async (req, res) => {
  const match = new Match({
    date: req.body.date,
    time: req.body.time,
    homeTeam: req.body.homeTeam,
    awayTeam: req.body.awayTeam,
    venue: req.body.venue,
    odds: req.body.odds
  });

  try {
    const newMatch = await match.save();
    res.status(201).json(newMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update match (admin only)
router.patch('/:id', auth.adminRequired, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] != null) {
        match[key] = req.body[key];
      }
    });

    const updatedMatch = await match.save();
    res.json(updatedMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete match (admin only)
router.delete('/:id', auth.adminRequired, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    await match.remove();
    res.json({ message: 'Match deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
