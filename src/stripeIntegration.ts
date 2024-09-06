import * as vscode from 'vscode';
import { ServerCommunication } from './serverCommunication';

const serverCommunication = new ServerCommunication();

export async function upgradeToPremium() {
    try {
        const checkoutUrl = await serverCommunication.initiateStripeCheckout();
        vscode.env.openExternal(vscode.Uri.parse(checkoutUrl));
    } catch (error) {
        vscode.window.showErrorMessage('Failed to initiate premium upgrade. Please try again later.');
    }
}
