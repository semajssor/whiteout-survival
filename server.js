const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Node.js module for working with file paths

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Define Mongoose schema and model
const memberSchema = new mongoose.Schema({
  rank: String,
  username: { type: String, unique: true },
  power: Number,
  level: Number
});
const Member = mongoose.model('Member', memberSchema);

// API routes
function displayUsers() {
  fetch('/members')
    .then(response => response.json())
    .then(data => {
      const userList = document.getElementById('userList');
      userList.innerHTML = '';
      data.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('user-item');
        userDiv.innerHTML = `
          <p>Rank: ${user.rank}</p>
          <p>Username: ${user.username}</p>
          <p>Power: ${user.power}</p>
          <p>Level: ${user.level}</p>
        `;
        userList.appendChild(userDiv);
      });
    });
}

app.post('/members', async (req, res) => {
  try {
    const newMember = new Member(req.body);
    await newMember.save();
    console.log('Member added:', newMember);
    res.status(201).send(newMember);
  } catch (error) {
    console.error('Error inserting member:', error);
    res.status(400).send(error);
  }
});

app.put('/members/:username', async (req, res) => {
  try {
    const member = await Member.findOneAndUpdate({ username: req.params.username }, req.body, { new: true });
    if (!member) {
      return res.status(404).send();
    }
    res.send(member);
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(400).send(error);
  }
});

app.delete('/members/:username', async (req, res) => {
  try {
    const member = await Member.findOneAndDelete({ username: req.params.username });
    if (!member) {
      return res.status(404).send();
    }
    res.send(member);
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(400).send(error);
  }
});

// Serve 'index.html' for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
