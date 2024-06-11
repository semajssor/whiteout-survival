const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/alliance', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
