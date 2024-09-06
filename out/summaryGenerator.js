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
        const cloudflareWorkerUrl = config.get('cloudflareWorkerUrl') || '';
        this.cloudflareModel = new cloudflareModel_1.CloudflareModel(cloudflareWorkerUrl);
    }
    async generateSummary(stagedChanges) {
        if (this.summaryModel === 'OpenAI') {
            return this.generateOpenAISummary(stagedChanges);
        }
        else {
            return this.cloudflareModel.generateSummary(stagedChanges);
        }
    }
    async generateOpenAISummary(stagedChanges) {
        if (!this.apiKey) {
            throw new Error('OpenAI API key not set. Please set it in the extension settings.');
        }
        try {
            const response = await axios_1.default.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant that generates concise git commit summaries.' },
                    { role: 'user', content: `Generate a concise git commit summary for the following changes:\n\n${stagedChanges}` }
                ],
                max_tokens: 100
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
}
exports.SummaryGenerator = SummaryGenerator;
//# sourceMappingURL=summaryGenerator.js.map