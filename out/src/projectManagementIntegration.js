"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectManagementIntegration = void 0;
const vscode = require("vscode");
const axios_1 = require("axios");
class ProjectManagementIntegration {
    constructor() {
        const config = vscode.workspace.getConfiguration('gitCommitSummarizer');
        this.githubToken = config.get('githubToken') || '';
    }
    async linkCommitToIssue(commitMessage) {
        const issueMatch = commitMessage.match(/#(\d+)/);
        if (!issueMatch) {
            return commitMessage;
        }
        const issueNumber = issueMatch[1];
        const repoInfo = await this.getGitHubRepoInfo();
        if (!repoInfo) {
            return commitMessage;
        }
        try {
            await this.createGitHubComment(repoInfo.owner, repoInfo.repo, issueNumber, commitMessage);
            return `${commitMessage}\n\nCloses #${issueNumber}`;
        }
        catch (error) {
            console.error('Error linking commit to issue:', error);
            return commitMessage;
        }
    }
    async getGitHubRepoInfo() {
        try {
            const gitExtension = vscode.extensions.getExtension('vscode.git');
            if (gitExtension) {
                const git = gitExtension.exports.getAPI(1);
                const repo = git.repositories[0];
                const remoteUrl = await repo.getConfig('remote.origin.url');
                const match = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
                if (match) {
                    return { owner: match[1], repo: match[2] };
                }
            }
        }
        catch (error) {
            console.error('Error getting GitHub repo info:', error);
        }
        return null;
    }
    async createGitHubComment(owner, repo, issueNumber, comment) {
        if (!this.githubToken) {
            throw new Error('GitHub token not set. Please set it in the extension settings.');
        }
        await axios_1.default.post(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`, { body: `Commit linked: ${comment}` }, {
            headers: {
                'Authorization': `token ${this.githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
    }
}
exports.ProjectManagementIntegration = ProjectManagementIntegration;
//# sourceMappingURL=projectManagementIntegration.js.map