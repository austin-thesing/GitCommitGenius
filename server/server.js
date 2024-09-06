const express = require('express');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const Database = require("@replit/database");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const db = new Database();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  trustProxy: true // Trust the Replit proxy
});

app.set('trust proxy', 1); // Trust first proxy

app.use(limiter);
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: process.env.EXTENSION_DOMAIN || 'https://*.repl.co',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// JWT Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

app.get('/', (req, res) => {
  res.send('Git Commit Summarizer API is running');
});

app.post('/api/login', [
  body('username').isString(),
  body('password').isString(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  
  try {
    const storedPassword = await db.get(`user:${username}:password`);
    if (storedPassword === password) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/key', authenticateJWT, async (req, res) => {
  try {
    const apiKey = await db.get('openai_api_key');
    res.json({ apiKey });
  } catch (error) {
    console.error('Error fetching API key:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/premium-status', authenticateJWT, async (req, res) => {
  try {
    const isPremium = await db.get(`user:${req.user.username}:isPremium`);
    res.json({ isPremium: !!isPremium });
  } catch (error) {
    console.error('Error fetching premium status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/create-checkout-session', authenticateJWT, async (req, res) => {
  // Placeholder: In a real-world scenario, this would create a Stripe checkout session
  // For now, we'll just set a flag in the database
  try {
    await db.set(`user:${req.user.username}:isPremium`, true);
    res.json({ checkoutUrl: 'https://example.com/checkout' });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Initialize the database with some dummy data
async function initializeDatabase() {
  try {
    await db.set('user:admin:password', 'password');
    await db.set('openai_api_key', process.env.OPENAI_API_KEY);
    console.log('Database initialized with dummy data');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase();

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
