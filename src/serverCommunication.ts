import axios from 'axios';
import * as vscode from 'vscode';

export class ServerCommunication {
    private serverUrl: string;

    constructor() {
        const serverUrl = process.env.SERVER_URL;
        if (!serverUrl) {
            throw new Error('SERVER_URL environment variable is not set. Please set it in the .env file.');
        }
        this.serverUrl = serverUrl;
    }

    async getApiKey(): Promise<string> {
        try {
            const response = await axios.get(`${this.serverUrl}/api/key`);
            return response.data.apiKey;
        } catch (error) {
            console.error('Error fetching API key from server:', error);
            throw new Error('Failed to retrieve API key from server');
        }
    }

    async checkPremiumStatus(): Promise<boolean> {
        try {
            const response = await axios.get(`${this.serverUrl}/api/premium-status`);
            return response.data.isPremium;
        } catch (error) {
            console.error('Error checking premium status:', error);
            return false;
        }
    }

    async initiateStripeCheckout(): Promise<string> {
        try {
            const response = await axios.post(`${this.serverUrl}/api/create-checkout-session`);
            return response.data.checkoutUrl;
        } catch (error) {
            console.error('Error initiating Stripe checkout:', error);
            throw new Error('Failed to initiate Stripe checkout');
        }
    }
}
