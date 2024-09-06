import * as vscode from 'vscode';
import axios from 'axios';
import { CloudflareModel } from './cloudflareModel';

export class SummaryGenerator {
    private apiKey: string;
    private summaryModel: string;
    private cloudflareModel: CloudflareModel;

    constructor() {
        const config = vscode.workspace.getConfiguration('gitCommitSummarizer');
        this.apiKey = config.get<string>('openaiApiKey') || '';
        this.summaryModel = config.get<string>('summaryModel') || 'OpenAI';
        const cloudflareWorkerUrl = config.get<string>('cloudflareWorkerUrl') || '';
        this.cloudflareModel = new CloudflareModel(cloudflareWorkerUrl);
    }

    async generateSummary(stagedChanges: string): Promise<string> {
        if (this.summaryModel === 'OpenAI') {
            return this.generateOpenAISummary(stagedChanges);
        } else {
            return this.cloudflareModel.generateSummary(stagedChanges);
        }
    }

    private async generateOpenAISummary(stagedChanges: string): Promise<string> {
        if (!this.apiKey) {
            throw new Error('OpenAI API key not set. Please set it in the extension settings.');
        }

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant that generates concise git commit summaries.' },
                        { role: 'user', content: `Generate a concise git commit summary for the following changes:\n\n${stagedChanges}` }
                    ],
                    max_tokens: 100
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.choices[0].message.content.trim();
        } catch (error) {
            console.error('Error generating summary with OpenAI:', error);
            throw new Error('Failed to generate summary with OpenAI. Please check your OpenAI API key and try again.');
        }
    }
}
