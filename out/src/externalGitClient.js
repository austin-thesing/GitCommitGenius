"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalGitClient = void 0;
const vscode = require("vscode");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class ExternalGitClient {
    async commitWithTower(message) {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            throw new Error('No workspace folder found');
        }
        const repoPath = workspaceFolders[0].uri.fsPath;
        try {
            // This command assumes Tower CLI tool is installed and configured
            await execAsync(`gittower commit "${repoPath}" -m "${message}"`);
        }
        catch (error) {
            console.error('Error committing with Tower:', error);
            throw new Error('Failed to commit with Tower. Make sure Tower is installed and the CLI tool is configured.');
        }
    }
}
exports.ExternalGitClient = ExternalGitClient;
//# sourceMappingURL=externalGitClient.js.map