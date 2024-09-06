import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class ExternalGitClient {
    async commitWithTower(message: string): Promise<void> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            throw new Error('No workspace folder found');
        }

        const repoPath = workspaceFolders[0].uri.fsPath;

        try {
            // This command assumes Tower CLI tool is installed and configured
            await execAsync(`gittower commit "${repoPath}" -m "${message}"`);
        } catch (error) {
            console.error('Error committing with Tower:', error);
            throw new Error('Failed to commit with Tower. Make sure Tower is installed and the CLI tool is configured.');
        }
    }
}
