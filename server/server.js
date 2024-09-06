const express = require('express');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

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
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Mock authentication - replace with actual authentication logic
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/api/key', authenticateJWT, (req, res) => {
  res.json({ apiKey: process.env.OPENAI_API_KEY });
});

app.get('/api/premium-status', authenticateJWT, (req, res) => {
  // Placeholder: In a real-world scenario, this would check against a database
  res.json({ isPremium: false });
});

app.post('/api/create-checkout-session', authenticateJWT, (req, res) => {
  // Placeholder: In a real-world scenario, this would create a Stripe checkout session
  res.json({ checkoutUrl: 'https://example.com/checkout' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
