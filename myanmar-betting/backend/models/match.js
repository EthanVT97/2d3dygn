const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  homeTeam: {
    name: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      default: 0
    }
  },
  awayTeam: {
    name: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      default: 0
    }
  },
  venue: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'finished'],
    default: 'upcoming'
  },
  odds: {
    homeWin: {
      type: Number,
      required: true
    },
    draw: {
      type: Number,
      required: true
    },
    awayWin: {
      type: Number,
      required: true
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Match', matchSchema);
