import axios from 'axios';

export class CloudflareModel {
    private cloudflareWorkerUrl: string;

    constructor(cloudflareWorkerUrl: string) {
        this.cloudflareWorkerUrl = cloudflareWorkerUrl;
    }

    async generateSummary(stagedChanges: string): Promise<string> {
        try {
            const response = await axios.post(
                this.cloudflareWorkerUrl,
                {
                    prompt: `Generate a concise git commit summary for the following changes:\n\n${stagedChanges}`,
                    max_tokens: 100
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.summary;
        } catch (error) {
            console.error('Error generating summary with Cloudflare model:', error);
            throw new Error('Failed to generate summary with Cloudflare model. Please check your Cloudflare Worker URL and try again.');
        }
    }
}
