import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
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
    console.log('Member added:', newMember); // Log the inserted member
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
    res.status(400).send(error);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
