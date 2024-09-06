import * as vscode from 'vscode';
import { ServerCommunication } from './serverCommunication';

export class TokenManager {
    private context: vscode.ExtensionContext;
    private readonly FREE_TIER_LIMIT = 10;
    private readonly RESET_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    private serverCommunication: ServerCommunication;

    constructor() {
        this.context = (global as any).extensionContext;
        this.serverCommunication = new ServerCommunication();
    }

    async hasAvailableTokens(): Promise<boolean> {
        const isPremium = await this.serverCommunication.checkPremiumStatus();
        if (isPremium) {
            return true;
        }

        const usedTokens = this.context.globalState.get<number>('usedTokens', 0);
        const lastResetTime = this.context.globalState.get<number>('lastResetTime', 0);

        if (Date.now() - lastResetTime > this.RESET_INTERVAL) {
            await this.resetTokens();
            return true;
        }

        return usedTokens < this.FREE_TIER_LIMIT;
    }

    async useToken(): Promise<void> {
        const isPremium = await this.serverCommunication.checkPremiumStatus();
        if (isPremium) {
            return;
        }

        const usedTokens = this.context.globalState.get<number>('usedTokens', 0);
        await this.context.globalState.update('usedTokens', usedTokens + 1);
    }

    private async resetTokens(): Promise<void> {
        await this.context.globalState.update('usedTokens', 0);
        await this.context.globalState.update('lastResetTime', Date.now());
    }
}
