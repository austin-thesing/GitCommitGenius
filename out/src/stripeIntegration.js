"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upgradeToPremium = void 0;
const vscode = require("vscode");
const serverCommunication_1 = require("./serverCommunication");
const serverCommunication = new serverCommunication_1.ServerCommunication();
async function upgradeToPremium() {
    try {
        const checkoutUrl = await serverCommunication.initiateStripeCheckout();
        vscode.env.openExternal(vscode.Uri.parse(checkoutUrl));
    }
    catch (error) {
        vscode.window.showErrorMessage('Failed to initiate premium upgrade. Please try again later.');
    }
}
exports.upgradeToPremium = upgradeToPremium;
//# sourceMappingURL=stripeIntegration.js.map