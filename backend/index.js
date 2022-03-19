// Imports
const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const auth = require('./routes/auth');
const paintings = require('./routes/paintings');
const cors = require('cors');

app.use(express.json({ limit: '25mb' }));
app.use(cors());

const dotenv = require('dotenv');
dotenv.config();

// Connecting Database
mongoose.connect(process.env.MONGO_URI);


// ======================= Routes =============================
app.use('/auth', auth);
app.use('/paintings', paintings);


app.listen(port, () => {
    console.log(`Paint app listening on port ${port}`)
})