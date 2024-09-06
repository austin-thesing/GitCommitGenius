"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudflareModel = void 0;
const axios_1 = require("axios");
class CloudflareModel {
    constructor(cloudflareWorkerUrl) {
        this.cloudflareWorkerUrl = cloudflareWorkerUrl;
    }
    async generateSummary(stagedChanges) {
        try {
            const response = await axios_1.default.post(this.cloudflareWorkerUrl, {
                prompt: `Generate a concise git commit summary for the following changes:\n\n${stagedChanges}`,
                max_tokens: 100
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data.summary;
        }
        catch (error) {
            console.error('Error generating summary with Cloudflare model:', error);
            throw new Error('Failed to generate summary with Cloudflare model. Please check your Cloudflare Worker URL and try again.');
        }
    }
}
exports.CloudflareModel = CloudflareModel;
//# sourceMappingURL=cloudflareModel.js.map