//https://levelup.gitconnected.com/prevent-brute-force-attacks-in-node-js-419367ae35e6
import rateLimit from 'express-rate-limit';

const loginlimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 10 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('/api/login', loginlimiter);
