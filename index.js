const MockProviderA = require('./providers/MockProviderA');
const MockProviderB = require('./providers/MockProviderB');
const EmailService = require('./services/EmailService');

const providers = [new MockProviderA(), new MockProviderB()];
const emailService = new EmailService(providers);

(async () => {
  await emailService.sendEmail('user@example.com', 'Test Subject', 'This is the body');
  console.log(emailService.getStatusLog());
})();
