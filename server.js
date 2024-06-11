import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());

// Determine the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const memberSchema = new mongoose.Schema({
  rank: String,
  username: { type: String, unique: true },
  power: Number,
  level: Number
});
const Member = mongoose.model('Member', memberSchema);

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
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
