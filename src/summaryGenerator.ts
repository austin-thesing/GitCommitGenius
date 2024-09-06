import * as vscode from 'vscode';
import axios from 'axios';
import { CloudflareModel } from './cloudflareModel';

export class SummaryGenerator {
    private apiKey: string;
    private summaryModel: string;
    private cloudflareModel: CloudflareModel;
    private summaryStyle: string;
    private summaryDetailLevel: string;
    private subscriptionTier: string;
    private weeklySummaryCount: number;
    private lastResetDate: Date;

    constructor() {
        const config = vscode.workspace.getConfiguration('gitCommitSummarizer');
        this.apiKey = config.get<string>('openaiApiKey') || '';
        this.summaryModel = config.get<string>('summaryModel') || 'OpenAI';
        this.summaryStyle = config.get<string>('summaryStyle') || 'default';
        this.summaryDetailLevel = config.get<string>('summaryDetailLevel') || 'standard';
        this.subscriptionTier = config.get<string>('subscriptionTier') || 'free';
        const cloudflareWorkerUrl = config.get<string>('cloudflareWorkerUrl') || '';
        this.cloudflareModel = new CloudflareModel(cloudflareWorkerUrl);
        this.weeklySummaryCount = 0;
        this.lastResetDate = new Date();
    }

    async generateSummary(stagedChanges: string): Promise<string> {
        this.resetWeeklyCounterIfNeeded();

        if (this.subscriptionTier === 'free' && this.weeklySummaryCount >= 10) {
            throw new Error('Weekly summary limit reached. Please upgrade to premium for unlimited summaries.');
        }

        let summary: string;

        if (this.summaryModel === 'OpenAI') {
            summary = await this.generateOpenAISummary(stagedChanges);
        } else {
            summary = await this.cloudflareModel.generateSummary(stagedChanges);
        }

        if (this.subscriptionTier === 'free') {
            this.weeklySummaryCount++;
        }

        return this.formatSummary(summary);
    }

    private resetWeeklyCounterIfNeeded(): void {
        const currentDate = new Date();
        const daysSinceLastReset = (currentDate.getTime() - this.lastResetDate.getTime()) / (1000 * 3600 * 24);
        
        if (daysSinceLastReset >= 7) {
            this.weeklySummaryCount = 0;
            this.lastResetDate = currentDate;
        }
    }

    private async generateOpenAISummary(stagedChanges: string): Promise<string> {
        if (!this.apiKey) {
            throw new Error('OpenAI API key not set. Please set it in the extension settings.');
        }

        try {
            const model = this.subscriptionTier === 'premium' ? 'gpt-4' : 'gpt-3.5-turbo';
            const maxTokens = this.getMaxTokens();

            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: model,
                    messages: [
                        { role: 'system', content: this.getSystemPrompt() },
                        { role: 'user', content: `Generate a ${this.summaryDetailLevel} git commit summary for the following changes:\n\n${stagedChanges}` }
                    ],
                    max_tokens: maxTokens
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

    private formatSummary(summary: string): string {
        switch (this.summaryStyle) {
            case 'conventional':
                return this.formatConventionalCommit(summary);
            case 'detailed':
                return this.formatDetailedSummary(summary);
            default:
                return summary;
        }
    }

    private formatConventionalCommit(summary: string): string {
        const types = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'];
        const lines = summary.split('\n');
        const type = types.find(t => lines[0].toLowerCase().includes(t)) || 'chore';
        const shortDescription = lines[0].replace(/^[a-z]+:?\s*/i, '');
        const body = lines.slice(1).join('\n').trim();

        return `${type}: ${shortDescription}\n\n${body}`;
    }

    private formatDetailedSummary(summary: string): string {
        const lines = summary.split('\n');
        const title = lines[0];
        const body = lines.slice(1).join('\n').trim();

        return `${title}\n\nDetails:\n${body}`;
    }

    private getMaxTokens(): number {
        if (this.subscriptionTier === 'premium') {
            return 1000; // Unlimited tokens for premium users
        }
        switch (this.summaryDetailLevel) {
            case 'concise':
                return 50;
            case 'detailed':
                return 150;
            default: // standard
                return 100;
        }
    }

    private getSystemPrompt(): string {
        const basePrompt = 'You are a helpful assistant that generates git commit summaries.';
        if (this.subscriptionTier === 'premium') {
            return `${basePrompt} As this is for a premium user, provide a comprehensive and insightful summary without any limitations.`;
        }
        switch (this.summaryDetailLevel) {
            case 'concise':
                return `${basePrompt} Focus on the main change only.`;
            case 'detailed':
                return `${basePrompt} Include all relevant changes and their potential impacts.`;
            default: // standard
                return `${basePrompt} Include the main changes and their purpose.`;
        }
    }
}
