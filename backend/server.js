const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const piecesRouter = require('./routes/pieces');
const authRouter = require('./routes/auth');

const app = express();

app.use(body_parser.json());
app.use(cors());


const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.once('open', () =>{
  console.log("MongoDB database connection established successfully");
});


app.get("/", (req, res) => {
  res.json({message: "You are in the root route"});
});
app.use('/pieces', piecesRouter);
app.use('/account', authRouter);

const port = 4000;

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
