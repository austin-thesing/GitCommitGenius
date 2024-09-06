import * as vscode from 'vscode';
import { GitManager } from './gitManager';
import { SummaryGenerator } from './summaryGenerator';
import { ExternalGitClient } from './externalGitClient';

export function activate(context: vscode.ExtensionContext) {
    console.log('Git Commit Summarizer is now active!');

    const gitManager = new GitManager();
    const summaryGenerator = new SummaryGenerator();
    const externalGitClient = new ExternalGitClient();

    let disposable = vscode.commands.registerCommand('extension.generateCommitSummary', async () => {
        try {
            const stagedChanges = await gitManager.getStagedChanges();
            if (!stagedChanges) {
                vscode.window.showInformationMessage('No staged changes found.');
                return;
            }

            const summary = await summaryGenerator.generateSummary(stagedChanges);
            
            const result = await vscode.window.showInputBox({
                prompt: 'Generated Commit Summary',
                value: summary,
                placeHolder: 'Edit the summary if needed'
            });

            if (result) {
                const config = vscode.workspace.getConfiguration('gitCommitSummarizer');
                const externalClient = config.get<string>('externalGitClient');

                if (externalClient === 'Tower') {
                    await externalGitClient.commitWithTower(result);
                } else {
                    await gitManager.commit(result);
                }

                vscode.window.showInformationMessage('Commit successful!');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
