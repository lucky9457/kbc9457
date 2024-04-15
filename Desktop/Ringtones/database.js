// database.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/travel_diary_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
