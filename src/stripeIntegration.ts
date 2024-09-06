import * as vscode from 'vscode';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2020-08-27',
});

export class StripeIntegration {
  static async createCheckoutSession(): Promise<string> {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Git Commit Summarizer Premium',
                description: 'Unlimited summaries and advanced features',
              },
              unit_amount: 999, // $9.99
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://example.com/cancel',
      });

      return session.url || '';
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  static async verifySubscription(customerId: string): Promise<boolean> {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
      });

      return subscriptions.data.length > 0;
    } catch (error) {
      console.error('Error verifying subscription:', error);
      return false;
    }
  }
}

export async function upgradeToPremium() {
  try {
    const checkoutUrl = await StripeIntegration.createCheckoutSession();
    vscode.env.openExternal(vscode.Uri.parse(checkoutUrl));
  } catch (error) {
    vscode.window.showErrorMessage('Failed to initiate premium upgrade. Please try again later.');
  }
}
