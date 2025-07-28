const express = require('express');
const connectDB = require('./src/config/db.js');
const cookieParser = require('cookie-parser');
const problemRoutes = require('./src/api/problem.js');
const userRoutes = require('./src/api/user.js');
const allProblems = require('./src/api/fetchAll.js');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
// DB
connectDB();

// Routes
app.use('/api', problemRoutes);
app.use('/api', userRoutes);
app.use('/api', allProblems);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
