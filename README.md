# Git Commit Summarizer

This VSCode extension generates git commit summaries using NLP, integrates with external git clients, offers premium features for advanced commit analysis, and includes project management integration to link commits to issues.

## Features

- Analyze current code changes in the git staging area
- Generate concise summaries of changes using OpenAI's GPT-3.5 or GPT-4 (premium) or a Cloudflare-compatible model
- Analyze commit history and suggest related changes (premium feature)
- Easily copy or directly use generated summaries for commit messages
- Integration with external git clients (currently supports Tower)
- Premium tier with advanced features, higher token limits, and unlimited summaries
- Link commits to GitHub issues automatically
- Customizable summary detail levels (concise, standard, detailed)

## Free vs Premium Tiers

### Free Tier
- Limited to 10 summaries per week
- Uses GPT-3.5 for generating summaries
- Standard token limits

### Premium Tier
- Unlimited summaries
- Uses GPT-4 for more accurate and detailed summaries
- Higher token limits
- Commit history analysis for more contextual summaries

## Requirements

- VSCode 1.60.0 or higher
- Node.js and npm installed
- Git installed and configured
- OpenAI API key (if using OpenAI model)
- Cloudflare Worker URL (if using Cloudflare-compatible model)
- GitHub Personal Access Token (for linking commits to issues)
- (Optional) Tower git client installed for external client integration

## Extension Settings

This extension contributes the following settings:

* `gitCommitSummarizer.openaiApiKey`: OpenAI API Key for generating summaries (required if using OpenAI model)
* `gitCommitSummarizer.externalGitClient`: External Git client to integrate with (None or Tower)
* `gitCommitSummarizer.summaryModel`: Model to use for generating summaries (OpenAI or Cloudflare)
* `gitCommitSummarizer.cloudflareWorkerUrl`: URL of the Cloudflare Worker for generating summaries (required if using Cloudflare model)
* `gitCommitSummarizer.summaryStyle`: Style of the generated commit summary (default, conventional, or detailed)
* `gitCommitSummarizer.summaryDetailLevel`: Level of detail for the generated commit summary (concise, standard, or detailed)
* `gitCommitSummarizer.subscriptionTier`: User's subscription tier (free or premium)
* `gitCommitSummarizer.githubToken`: GitHub Personal Access Token for linking commits to issues
* `gitCommitSummarizer.customerId`: Stripe Customer ID for premium users

## Premium Features

The premium tier offers the following advanced features:

1. Unlimited summaries: No weekly limit on the number of summaries generated.
2. Commit history analysis: Analyzes your recent commits to suggest more contextual and relevant commit messages.
3. Advanced AI model: Uses GPT-4 for generating summaries, providing more accurate and detailed results.
4. Higher token limits: Allows for longer and more detailed commit summaries when needed.

To upgrade to the premium tier:

1. Open the Command Palette (Ctrl+Shift+P)
2. Run the command "Upgrade to Premium"
3. Follow the Stripe checkout process to complete your subscription

## Project Management Integration

The extension supports linking commits to GitHub issues. To use this feature:

1. Set your GitHub Personal Access Token in the extension settings (`gitCommitSummarizer.githubToken`)
2. When creating a commit, include the issue number in the commit message (e.g., "Fix bug #123")
3. The extension will automatically link the commit to the specified issue on GitHub

## Summary Detail Levels

You can now choose between three levels of summary detail:

1. Concise: Provides a very brief summary focusing on the main change only.
2. Standard: Includes the main changes and their purpose (default).
3. Detailed: Offers a comprehensive summary including all relevant changes and their potential impacts.

To change the summary detail level, update the `gitCommitSummarizer.summaryDetailLevel` setting in your VSCode settings.

## Running and Testing the Extension

Note: This extension cannot be run directly in the Replit environment as it requires VS Code to function. However, you can develop and test the code in Replit, then run it locally in VS Code.

To test the extension locally:

1. Clone the repository to your local machine.
2. Open the project in VS Code.
3. Install dependencies by running `npm install` in the terminal.
4. Press F5 to open a new window with your extension loaded.
5. Open a Git repository in the new window.
6. Make some changes to files in the repository and stage them.
7. Run the command "Generate Commit Summary" from the Command Palette (Ctrl+Shift+P).
8. If you're a premium user, the extension will analyze the commit history, generate a summary based on your staged changes, and suggest related changes with no limitations.
9. If you're a free user, you'll be limited to 10 summaries per week. After reaching the limit, you'll be prompted to upgrade to premium.
10. Edit the summary if needed, add an issue number if applicable, and confirm to create a commit.

## Troubleshooting

- If you encounter any issues with the OpenAI model, ensure that you have set a valid API key in the extension settings.
- For Cloudflare model issues, check that you have provided a valid Cloudflare Worker URL in the settings.
- If the extension fails to detect staged changes, make sure you have staged your changes using Git before running the "Generate Commit Summary" command.
- If you're unable to access premium features after upgrading, try reloading the VS Code window or checking your subscription status in the extension settings.
- If commits are not being linked to GitHub issues, ensure that you have set a valid GitHub Personal Access Token in the extension settings and that you're including the issue number in the commit message.
- If you've reached your weekly summary limit as a free user, you'll be prompted to upgrade to premium. You can wait for the limit to reset (which happens automatically every 7 days) or upgrade to continue using the extension without limitations.

## Known Issues

- Currently only supports Tower as an external git client
- Project management integration is limited to GitHub issues at the moment

## Release Notes

### 0.0.8

- Implemented weekly limit of 10 summaries for free users
- Added unlimited summaries for premium users
- Updated extension to handle free users reaching their weekly limit
- Updated README with information about the new free and premium tier features

### 0.0.7

- Implemented unlimited summaries for premium users
- Updated README with information about the new unlimited summaries feature

### 0.0.6

- Added customizable summary detail levels (concise, standard, detailed)
- Updated README with information about the new feature and configuration

### 0.0.5

- Added project management integration to link commits to GitHub issues
- Updated README with information about the new feature and configuration

### 0.0.4

- Added premium tier with Stripe integration
- Implemented commit history analysis for premium users
- Updated to use GPT-4 for premium users

### 0.0.3

- Added support for analyzing commit history and suggesting related changes

### 0.0.2

- Added support for customizable summary styles
- Implemented option to choose between OpenAI and Cloudflare-compatible models for summary generation

### 0.0.1

Initial release of Git Commit Summarizer

---

## Following extension guidelines

This extension follows the [VSCode extension guidelines](https://code.visualstudio.com/api/references/extension-guidelines).

**Enjoy!**
