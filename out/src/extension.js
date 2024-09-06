"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const gitManager_1 = require("./gitManager");
const summaryGenerator_1 = require("./summaryGenerator");
const externalGitClient_1 = require("./externalGitClient");
const commitAnalyzer_1 = require("./commitAnalyzer");
const stripeIntegration_1 = require("./stripeIntegration");
const projectManagementIntegration_1 = require("./projectManagementIntegration");
function activate(context) {
    console.log('Git Commit Summarizer is now active!');
    const gitManager = new gitManager_1.GitManager();
    const summaryGenerator = new summaryGenerator_1.SummaryGenerator();
    const externalGitClient = new externalGitClient_1.ExternalGitClient();
    const commitAnalyzer = new commitAnalyzer_1.CommitAnalyzer(gitManager, summaryGenerator);
    const projectManagementIntegration = new projectManagementIntegration_1.ProjectManagementIntegration();
    let generateCommitSummary = vscode.commands.registerCommand('extension.generateCommitSummary', async () => {
        try {
            const config = vscode.workspace.getConfiguration('gitCommitSummarizer');
            const subscriptionTier = config.get('subscriptionTier') || 'free';
            const summaryDetailLevel = config.get('summaryDetailLevel') || 'standard';
            const customerId = config.get('customerId') || '';
            if (subscriptionTier === 'premium' && customerId) {
                const isSubscriptionActive = await stripeIntegration_1.StripeIntegration.verifySubscription(customerId);
                if (!isSubscriptionActive) {
                    const response = await vscode.window.showWarningMessage('Your premium subscription has expired. Would you like to renew?', 'Yes', 'No');
                    if (response === 'Yes') {
                        await (0, stripeIntegration_1.upgradeToPremium)();
                    }
                    return;
                }
            }
            const stagedChanges = await gitManager.getStagedChanges();
            if (!stagedChanges) {
                vscode.window.showInformationMessage('No staged changes found.');
                return;
            }
            let suggestion;
            try {
                if (subscriptionTier === 'premium') {
                    suggestion = await commitAnalyzer.analyzeAndSuggest(stagedChanges);
                }
                else {
                    suggestion = await summaryGenerator.generateSummary(stagedChanges);
                }
            }
            catch (error) {
                if (error instanceof Error && error.message.includes('Weekly summary limit reached')) {
                    const response = await vscode.window.showWarningMessage('You have reached your weekly summary limit. Would you like to upgrade to premium for unlimited summaries?', 'Yes', 'No');
                    if (response === 'Yes') {
                        await (0, stripeIntegration_1.upgradeToPremium)();
                    }
                    return;
                }
                throw error;
            }
            const result = await vscode.window.showInputBox({
                prompt: `Generated Commit Summary (${summaryDetailLevel} detail)` + (subscriptionTier === 'premium' ? ' (based on history)' : ''),
                value: suggestion,
                placeHolder: 'Edit the summary if needed. Add #issue_number to link to an issue.'
            });
            if (result) {
                const linkedCommitMessage = await projectManagementIntegration.linkCommitToIssue(result);
                const externalClient = config.get('externalGitClient');
                if (externalClient === 'Tower') {
                    await externalGitClient.commitWithTower(linkedCommitMessage);
                }
                else {
                    await gitManager.commit(linkedCommitMessage);
                }
                vscode.window.showInformationMessage('Commit successful!');
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
    let upgradeToPremiumCommand = vscode.commands.registerCommand('extension.upgradeToPremium', stripeIntegration_1.upgradeToPremium);
    context.subscriptions.push(generateCommitSummary, upgradeToPremiumCommand);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map