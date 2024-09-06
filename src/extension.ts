import * as vscode from 'vscode';
import { GitManager } from './gitManager';
import { SummaryGenerator } from './summaryGenerator';
import { ExternalGitClient } from './externalGitClient';
import { CommitAnalyzer } from './commitAnalyzer';
import { upgradeToPremium, StripeIntegration } from './stripeIntegration';
import { ProjectManagementIntegration } from './projectManagementIntegration';

export function activate(context: vscode.ExtensionContext) {
    console.log('Git Commit Summarizer is now active!');

    const gitManager = new GitManager();
    const summaryGenerator = new SummaryGenerator();
    const externalGitClient = new ExternalGitClient();
    const commitAnalyzer = new CommitAnalyzer(gitManager, summaryGenerator);
    const projectManagementIntegration = new ProjectManagementIntegration();

    let generateCommitSummary = vscode.commands.registerCommand('extension.generateCommitSummary', async () => {
        try {
            const config = vscode.workspace.getConfiguration('gitCommitSummarizer');
            const subscriptionTier = config.get<string>('subscriptionTier') || 'free';
            const summaryDetailLevel = config.get<string>('summaryDetailLevel') || 'standard';
            const customerId = config.get<string>('customerId') || '';

            if (subscriptionTier === 'premium' && customerId) {
                const isSubscriptionActive = await StripeIntegration.verifySubscription(customerId);
                if (!isSubscriptionActive) {
                    const response = await vscode.window.showWarningMessage('Your premium subscription has expired. Would you like to renew?', 'Yes', 'No');
                    if (response === 'Yes') {
                        await upgradeToPremium();
                    }
                    return;
                }
            }

            const stagedChanges = await gitManager.getStagedChanges();
            if (!stagedChanges) {
                vscode.window.showInformationMessage('No staged changes found.');
                return;
            }

            let suggestion: string;
            try {
                if (subscriptionTier === 'premium') {
                    suggestion = await commitAnalyzer.analyzeAndSuggest(stagedChanges);
                } else {
                    suggestion = await summaryGenerator.generateSummary(stagedChanges);
                }
            } catch (error) {
                if (error instanceof Error && error.message.includes('Weekly summary limit reached')) {
                    const response = await vscode.window.showWarningMessage('You have reached your weekly summary limit. Would you like to upgrade to premium for unlimited summaries?', 'Yes', 'No');
                    if (response === 'Yes') {
                        await upgradeToPremium();
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
                const externalClient = config.get<string>('externalGitClient');

                if (externalClient === 'Tower') {
                    await externalGitClient.commitWithTower(linkedCommitMessage);
                } else {
                    await gitManager.commit(linkedCommitMessage);
                }

                vscode.window.showInformationMessage('Commit successful!');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    });

    let upgradeToPremiumCommand = vscode.commands.registerCommand('extension.upgradeToPremium', upgradeToPremium);

    context.subscriptions.push(generateCommitSummary, upgradeToPremiumCommand);
}

export function deactivate() {}
