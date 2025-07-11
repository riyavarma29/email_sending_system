class MockProviderA {
  async sendEmail(to, subject, body) {
    if (Math.random() < 0.5) throw new Error('MockProviderA failed');
    console.log(`MockProviderA sent email to ${to}`);
    return true;
  }
}

module.exports = MockProviderA;
