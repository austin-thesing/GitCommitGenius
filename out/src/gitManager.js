"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitManager = void 0;
const vscode = require("vscode");
const simple_git_1 = require("simple-git");
class GitManager {
    constructor() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            throw new Error('No workspace folder found');
        }
        this.git = (0, simple_git_1.default)(workspaceFolders[0].uri.fsPath);
    }
    async getStagedChanges() {
        const status = await this.git.status();
        if (status.staged.length === 0) {
            return '';
        }
        const diff = await this.git.diff(['--cached']);
        return diff;
    }
    async commit(message) {
        await this.git.commit(message);
    }
    async addChanges(files) {
        await this.git.add(files);
    }
}
exports.GitManager = GitManager;
//# sourceMappingURL=gitManager.js.map