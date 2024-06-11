import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

const memberSchema = new mongoose.Schema({
  rank: Number,
  username: { type: String, unique: true },
  power: String,
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
    res.status(400).send({ message: 'Error adding member' });
  }
});

app.put('/members/:username', async (req, res) => {
  try {
    const { rank, power, level } = req.body;
    const updatedMember = await Member.findOneAndUpdate(
      { username: req.params.username },
      { rank, power, level },
      { new: true }
    );
    if (!updatedMember) {
      return res.status(404).send({ message: 'Member not found' });
    }
    res.send(updatedMember);
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(400).send({ message: 'Error updating member' });
  }
});

app.delete('/members/:username', async (req, res) => {
  try {
    const member = await Member.findOneAndDelete({ username: req.params.username });
    if (!member) {
      return res.status(404).send({ message: 'Member not found' });
    }
    res.send(member);
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(400).send({ message: 'Error deleting member' });
  }
});

app.get('/members', async (req, res) => {
  try {
    const members = await Member.find();
    res.send(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).send({ message: 'Error fetching members' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
