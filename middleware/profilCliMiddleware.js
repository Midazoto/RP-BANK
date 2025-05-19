const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../db');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

function