"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const gitManager_1 = require("./gitManager");
const summaryGenerator_1 = require("./summaryGenerator");
const externalGitClient_1 = require("./externalGitClient");
const commitAnalyzer_1 = require("./commitAnalyzer");
const stripeIntegration_1 = require("./stripeIntegration");
function activate(context) {
    console.log('Git Commit Summarizer is now active!');
    const gitManager = new gitManager_1.GitManager();
    const summaryGenerator = new summaryGenerator_1.SummaryGenerator();
    const externalGitClient = new externalGitClient_1.ExternalGitClient();
    const commitAnalyzer = new commitAnalyzer_1.CommitAnalyzer(gitManager, summaryGenerator);
    let generateCommitSummary = vscode.commands.registerCommand('extension.generateCommitSummary', async () => {
        try {
            const config = vscode.workspace.getConfiguration('gitCommitSummarizer');
            const subscriptionTier = config.get('subscriptionTier') || 'free';
            const stagedChanges = await gitManager.getStagedChanges();
            if (!stagedChanges) {
                vscode.window.showInformationMessage('No staged changes found.');
                return;
            }
            let suggestion;
            if (subscriptionTier === 'premium') {
                suggestion = await commitAnalyzer.analyzeAndSuggest(stagedChanges);
            }
            else {
                suggestion = await summaryGenerator.generateSummary(stagedChanges);
            }
            const result = await vscode.window.showInputBox({
                prompt: 'Generated Commit Summary' + (subscriptionTier === 'premium' ? ' (based on history)' : ''),
                value: suggestion,
                placeHolder: 'Edit the summary if needed'
            });
            if (result) {
                const externalClient = config.get('externalGitClient');
                if (externalClient === 'Tower') {
                    await externalGitClient.commitWithTower(result);
                }
                else {
                    await gitManager.commit(result);
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