class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.limit = 5;
    this.interval = 60000; // 1 minute
  }

  isAllowed(key) {
    const now = Date.now();
    const windowStart = now - this.interval;

    if (!this.requests.has(key)) {
      this.requests.set(key, now);
      return true;
    }

    const last = this.requests.get(key);
    if (last < windowStart) {
      this.requests.set(key, now);
      return true;
    }

    return false;
  }
}

module.exports = RateLimiter;
