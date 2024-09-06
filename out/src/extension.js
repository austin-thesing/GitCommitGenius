"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const gitManager_1 = require("./gitManager");
const summaryGenerator_1 = require("./summaryGenerator");
const externalGitClient_1 = require("./externalGitClient");
const projectManagementIntegration_1 = require("./projectManagementIntegration");
const tokenManager_1 = require("./tokenManager");
const stripeIntegration_1 = require("./stripeIntegration");
function activate(context) {
    console.log('Git Commit Summarizer is now active!');
    global.extensionContext = context;
    const gitManager = new gitManager_1.GitManager();
    const summaryGenerator = new summaryGenerator_1.SummaryGenerator();
    const externalGitClient = new externalGitClient_1.ExternalGitClient();
    const projectManagementIntegration = new projectManagementIntegration_1.ProjectManagementIntegration();
    const tokenManager = new tokenManager_1.TokenManager();
    let generateCommitSummary = vscode.commands.registerCommand('extension.generateCommitSummary', async () => {
        try {
            const config = vscode.workspace.getConfiguration('gitCommitSummarizer');
            const externalClient = config.get('externalGitClient');
            const stagedChanges = await gitManager.getStagedChanges();
            if (!stagedChanges) {
                vscode.window.showInformationMessage('No staged changes found. Please stage your changes using git add before generating a commit summary.');
                return;
            }
            vscode.window.showInformationMessage('Analyzing staged changes to generate commit summary...');
            if (!await tokenManager.hasAvailableTokens()) {
                const upgradeOption = 'Upgrade to Premium';
                const result = await vscode.window.showWarningMessage('You have reached your weekly limit for free summaries. Upgrade to premium for unlimited summaries.', upgradeOption);
                if (result === upgradeOption) {
                    vscode.commands.executeCommand('extension.upgradeToPremium');
                }
                return;
            }
            const suggestion = await summaryGenerator.generateSummary(stagedChanges);
            const result = await vscode.window.showInputBox({
                prompt: 'Generated Commit Summary (based on your staged changes)',
                value: suggestion,
                placeHolder: 'Edit the summary if needed. Add #issue_number to link to an issue.'
            });
            if (result) {
                const linkedCommitMessage = await projectManagementIntegration.linkCommitToIssue(result);
                if (externalClient === 'Tower') {
                    await externalGitClient.commitWithTower(linkedCommitMessage);
                }
                else {
                    await gitManager.commit(linkedCommitMessage);
                }
                vscode.window.showInformationMessage('Commit successful! Your staged changes have been committed with the generated summary.');
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
    let addChangesAndGenerateSummary = vscode.commands.registerCommand('extension.addChangesAndGenerateSummary', async () => {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                vscode.window.showErrorMessage('No workspace folder found');
                return;
            }
            const files = await vscode.window.showOpenDialog({
                canSelectMany: true,
                openLabel: 'Select files to stage',
                defaultUri: workspaceFolders[0].uri
            });
            if (!files || files.length === 0) {
                vscode.window.showInformationMessage('No files selected');
                return;
            }
            const filePaths = files.map(file => file.fsPath);
            await gitManager.addChanges(filePaths);
            vscode.window.showInformationMessage('Files staged successfully. Analyzing staged changes to generate commit summary...');
            vscode.commands.executeCommand('extension.generateCommitSummary');
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
    let upgradeCommand = vscode.commands.registerCommand('extension.upgradeToPremium', async () => {
        try {
            await (0, stripeIntegration_1.upgradeToPremium)();
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error upgrading to premium: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
    context.subscriptions.push(generateCommitSummary, addChangesAndGenerateSummary, upgradeCommand);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map