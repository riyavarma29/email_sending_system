const RateLimiter = require('../utils/RateLimiter');

class EmailService {
  constructor(providers) {
    this.providers = providers;
    this.rateLimiter = new RateLimiter();
    this.sentEmails = new Map(); // key → timestamp
    this.statusLog = [];
    this.expiryTime = 60000; // 1 minute
  }

  async sendEmail(to, subject, body) {
    const key = `${to}:${subject}:${body}`;
    
    if (this.sentEmails.has(key)) {
      const lastSent = this.sentEmails.get(key);
      if (Date.now() - lastSent < this.expiryTime) {
        this.statusLog.push('Duplicate email skipped (recently sent)');
        return false;
      }
    }

    if (!this.rateLimiter.isAllowed(to)) {
      this.statusLog.push('Rate limit exceeded');
      return false;
    }

    for (let i = 0; i < this.providers.length; i++) {
      let attempt = 0;

      while (attempt < 3) {
        try {
          const sent = await this.providers[i].sendEmail(to, subject, body);
          if (sent) {
            this.sentEmails.set(key, Date.now());
            this.statusLog.push(`Email sent via provider ${i + 1}`);
            return true;
          }
        } catch (err) {
          this.statusLog.push(`Provider ${i + 1} attempt ${attempt + 1} failed`);
          await this.delay(this.exponentialBackoff(attempt));
          attempt++;
        }
      }
    }

    this.statusLog.push('All providers failed');
    return false;
  }

  exponentialBackoff(attempt) {
    return Math.pow(2, attempt) * 100;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getStatusLog() {
    return this.statusLog;
  }
}

module.exports = EmailService;
