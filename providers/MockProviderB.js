class MockProviderB {
  async sendEmail(to, subject, body) {
    console.log(`MockProviderB sent email to ${to}`);
    return true;
  }
}

module.exports = MockProviderB;
