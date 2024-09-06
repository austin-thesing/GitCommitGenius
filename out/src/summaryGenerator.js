"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryGenerator = void 0;
const vscode = require("vscode");
const axios_1 = require("axios");
const cloudflareModel_1 = require("./cloudflareModel");
class SummaryGenerator {
    constructor() {
        const config = vscode.workspace.getConfiguration('gitCommitSummarizer');
        this.apiKey = config.get('openaiApiKey') || '';
        this.summaryModel = config.get('summaryModel') || 'OpenAI';
        this.summaryStyle = config.get('summaryStyle') || 'default';
        this.subscriptionTier = config.get('subscriptionTier') || 'free';
        const cloudflareWorkerUrl = config.get('cloudflareWorkerUrl') || '';
        this.cloudflareModel = new cloudflareModel_1.CloudflareModel(cloudflareWorkerUrl);
    }
    async generateSummary(stagedChanges) {
        let summary;
        if (this.summaryModel === 'OpenAI') {
            summary = await this.generateOpenAISummary(stagedChanges);
        }
        else {
            summary = await this.cloudflareModel.generateSummary(stagedChanges);
        }
        return this.formatSummary(summary);
    }
    async generateOpenAISummary(stagedChanges) {
        if (!this.apiKey) {
            throw new Error('OpenAI API key not set. Please set it in the extension settings.');
        }
        try {
            const model = this.subscriptionTier === 'premium' ? 'gpt-4' : 'gpt-3.5-turbo';
            const maxTokens = this.subscriptionTier === 'premium' ? 150 : 100;
            const response = await axios_1.default.post('https://api.openai.com/v1/chat/completions', {
                model: model,
                messages: [
                    { role: 'system', content: 'You are a helpful assistant that generates concise git commit summaries.' },
                    { role: 'user', content: `Generate a concise git commit summary for the following changes:\n\n${stagedChanges}` }
                ],
                max_tokens: maxTokens
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.choices[0].message.content.trim();
        }
        catch (error) {
            console.error('Error generating summary with OpenAI:', error);
            throw new Error('Failed to generate summary with OpenAI. Please check your OpenAI API key and try again.');
        }
    }
    formatSummary(summary) {
        switch (this.summaryStyle) {
            case 'conventional':
                return this.formatConventionalCommit(summary);
            case 'detailed':
                return this.formatDetailedSummary(summary);
            default:
                return summary;
        }
    }
    formatConventionalCommit(summary) {
        const types = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'];
        const lines = summary.split('\n');
        const type = types.find(t => lines[0].toLowerCase().includes(t)) || 'chore';
        const shortDescription = lines[0].replace(/^[a-z]+:?\s*/i, '');
        const body = lines.slice(1).join('\n').trim();
        return `${type}: ${shortDescription}\n\n${body}`;
    }
    formatDetailedSummary(summary) {
        const lines = summary.split('\n');
        const title = lines[0];
        const body = lines.slice(1).join('\n').trim();
        return `${title}\n\nDetails:\n${body}`;
    }
}
exports.SummaryGenerator = SummaryGenerator;
//# sourceMappingURL=summaryGenerator.js.map