import * as vscode from 'vscode';
import simpleGit, { SimpleGit } from 'simple-git';

export class GitManager {
    private git: SimpleGit;

    constructor() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            throw new Error('No workspace folder found');
        }
        this.git = simpleGit(workspaceFolders[0].uri.fsPath);
    }

    async getStagedChanges(): Promise<string> {
        const status = await this.git.status();
        if (status.staged.length === 0) {
            return '';
        }

        const diff = await this.git.diff(['--cached']);
        return diff;
    }

    async commit(message: string): Promise<void> {
        await this.git.commit(message);
    }

    async addChanges(files: string[]): Promise<void> {
        await this.git.add(files);
    }
}
