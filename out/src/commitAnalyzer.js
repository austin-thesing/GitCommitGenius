"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommitAnalyzer = void 0;
class CommitAnalyzer {
    constructor(gitManager, summaryGenerator) {
        this.gitManager = gitManager;
        this.summaryGenerator = summaryGenerator;
    }
    async analyzeAndSuggest(stagedChanges) {
        const commitHistory = await this.gitManager.getCommitHistory(5);
        const prompt = this.createPrompt(commitHistory, stagedChanges);
        const suggestion = await this.summaryGenerator.generateSummary(prompt);
        return suggestion;
    }
    createPrompt(commitHistory, stagedChanges) {
        return `
Given the following recent commit history:
${commitHistory.join('\n')}

And the current staged changes:
${stagedChanges}

Analyze the commit history and the current changes, then suggest a commit message that:
1. Follows the project's commit style
2. Relates to previous commits if applicable
3. Suggests any additional changes or improvements based on the history

Commit suggestion:`;
    }
}
exports.CommitAnalyzer = CommitAnalyzer;
//# sourceMappingURL=commitAnalyzer.js.map