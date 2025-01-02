const express = require('express');
const router = express.Router();
const Bet = require('../models/bet');
const Match = require('../models/match');
const auth = require('../middleware/auth');

// Get user's betting history
router.get('/', auth.required, async (req, res) => {
  try {
    const bets = await Bet.find({ user: req.user._id })
      .populate('match')
      .sort({ createdAt: -1 });
    
    res.json(bets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Place a new bet
router.post('/', auth.required, async (req, res) => {
  try {
    // Validate match exists and is upcoming
    const match = await Match.findById(req.body.matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    if (match.status !== 'upcoming') {
      return res.status(400).json({ message: 'Match is not available for betting' });
    }

    // Validate bet amount
    if (req.body.amount < 1000 || req.body.amount > 100000) {
      return res.status(400).json({ message: 'Invalid bet amount' });
    }

    // Get odds based on bet type
    let odds;
    switch (req.body.type) {
      case 'home':
        odds = match.odds.homeWin;
        break;
      case 'draw':
        odds = match.odds.draw;
        break;
      case 'away':
        odds = match.odds.awayWin;
        break;
      default:
        return res.status(400).json({ message: 'Invalid bet type' });
    }

    const bet = new Bet({
      user: req.user._id,
      match: match._id,
      type: req.body.type,
      amount: req.body.amount,
      odds: odds
    });

    const newBet = await bet.save();
    res.status(201).json(newBet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get bet details
router.get('/:id', auth.required, async (req, res) => {
  try {
    const bet = await Bet.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('match');
    
    if (!bet) {
      return res.status(404).json({ message: 'Bet not found' });
    }
    
    res.json(bet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update bet result (admin only)
router.patch('/:id/result', auth.adminRequired, async (req, res) => {
  try {
    const bet = await Bet.findById(req.params.id);
    if (!bet) {
      return res.status(404).json({ message: 'Bet not found' });
    }

    bet.status = req.body.status;
    if (bet.status === 'won') {
      bet.winnings = bet.amount * bet.odds;
    }

    const updatedBet = await bet.save();
    res.json(updatedBet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
