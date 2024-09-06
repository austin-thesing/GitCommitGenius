"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryGenerator = void 0;
const axios_1 = require("axios");
const tokenManager_1 = require("./tokenManager");
const serverCommunication_1 = require("./serverCommunication");
class SummaryGenerator {
    constructor() {
        this.tokenManager = new tokenManager_1.TokenManager();
        this.serverCommunication = new serverCommunication_1.ServerCommunication();
    }
    async generateSummary(stagedChanges) {
        if (!await this.tokenManager.hasAvailableTokens()) {
            throw new Error('You have reached your weekly limit. Please upgrade to premium for unlimited summaries.');
        }
        try {
            const apiKey = await this.serverCommunication.getApiKey();
            const response = await axios_1.default.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant that generates git commit summaries based on staged changes.' },
                    { role: 'user', content: `Generate a concise git commit summary for the following staged changes:\n\n${stagedChanges}` }
                ],
                max_tokens: 100
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            await this.tokenManager.useToken();
            return response.data.choices[0].message.content.trim();
        }
        catch (error) {
            console.error('Error generating summary:', error);
            throw new Error('Failed to generate summary. Please try again later.');
        }
    }
}
exports.SummaryGenerator = SummaryGenerator;
//# sourceMappingURL=summaryGenerator.js.map