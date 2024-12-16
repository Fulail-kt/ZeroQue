import twilio from 'twilio';

export class TwilioWhatsAppMessenger {
  private client: twilio.Twilio;
  private sandboxNumber = 'whatsapp:+14155238886';

  constructor(accountSid: string, authToken: string) {
    this.client = twilio(accountSid, authToken);
  }

  async sendMessage(to: string, body: string) {
    try {
      const message = await this.client.messages.create({
        from: this.sandboxNumber,
        body: body,
        to: `whatsapp:${to}`
      });

      return {
        success: true,
        messageId: message.sid,
        status: message.status
      };
    } catch (error) {
      console.error('WhatsApp Message Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Create a singleton instance
export const twilioWhatsApp = new TwilioWhatsAppMessenger(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);