import type { EmailAdapter, SendEmailOptions } from 'payload';

/**
 * Stub email adapter for development/testing
 * Logs emails to console instead of sending them
 */
export const stubEmailAdapter: EmailAdapter = ({ payload }) => ({
  name: 'stub-email-adapter',
  defaultFromAddress: 'noreply@inventory.amua.app',
  defaultFromName: 'Inventory Management System',
  
  async sendEmail(message: SendEmailOptions): Promise<void> {
    console.log('\n📧 ===== EMAIL NOTIFICATION =====');
    console.log('From:', message.from || 'noreply@inventory.amua.app');
    console.log('To:', message.to);
    console.log('Subject:', message.subject);
    console.log('---');
    
    if (typeof message.html === 'string') {
      console.log('HTML Body:', message.html);
    } else if (typeof message.text === 'string') {
      console.log('Text Body:', message.text);
    }
    
    console.log('================================\n');
  },
});
