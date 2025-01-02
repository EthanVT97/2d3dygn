const mongoose = require('mongoose');
const Match = require('../models/match');

const sampleMatches = [
  {
    date: '2025-01-03',
    time: '16:00',
    homeTeam: {
      name: 'ရန်ကုန် ယူနိုက်တက်',
      logo: '/teams/yangon-united.svg'
    },
    awayTeam: {
      name: 'ဟံသာဝတီ ယူနိုက်တက်',
      logo: '/teams/hanthawaddy-united.svg'
    },
    venue: 'ရန်ကုန်ဘောလုံးကွင်း',
    status: 'upcoming',
    odds: {
      homeWin: 1.85,
      draw: 3.25,
      awayWin: 4.50
    }
  },
  {
    date: '2025-01-04',
    time: '15:30',
    homeTeam: {
      name: 'ရှမ်း ယူနိုက်တက်',
      logo: '/teams/shan-united.svg'
    },
    awayTeam: {
      name: 'မကွေး',
      logo: '/teams/magwe.svg'
    },
    venue: 'တောင်ကြီးဘောလုံးကွင်း',
    status: 'upcoming',
    odds: {
      homeWin: 2.10,
      draw: 3.00,
      awayWin: 3.75
    }
  },
  {
    date: '2025-01-02',
    time: '16:00',
    homeTeam: {
      name: 'ရတနာပုံ',
      logo: '/teams/yadanarbon.svg',
      score: 2
    },
    awayTeam: {
      name: 'မကွေး',
      logo: '/teams/magwe.svg',
      score: 1
    },
    venue: 'မန္တလေးဘောလုံးကွင်း',
    status: 'finished',
    odds: {
      homeWin: 1.95,
      draw: 3.20,
      awayWin: 4.00
    }
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing matches
    await Match.deleteMany({});
    
    // Insert sample matches
    await Match.insertMany(sampleMatches);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
