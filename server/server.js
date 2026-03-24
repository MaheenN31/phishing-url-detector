require('dotenv').config();
const express = require('express');
const cors = require('cors');
const analyzeRoute = require('./routes/analyze');
const emailRoute = require('./routes/email');
const ipRoute = require('./routes/ip');
const hashRoute = require('./routes/hash');
const whoisRoute = require('./routes/whois');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/analyze', analyzeRoute);
app.use('/email', emailRoute);
app.use('/ip', ipRoute);
app.use('/hash', hashRoute);
app.use('/whois', whoisRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});