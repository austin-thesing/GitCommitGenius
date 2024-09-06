# Git Commit Summarizer

This VSCode extension generates git commit summaries using NLP and integrates with external git clients.

## Features

- Analyze current code changes in the git staging area
- Generate concise summaries of changes using OpenAI's GPT-4 or a Cloudflare-compatible model
- Easily copy or directly use generated summaries for commit messages
- Integration with external git clients (currently supports Tower)

## Requirements

- VSCode 1.60.0 or higher
- Node.js and npm installed
- Git installed and configured
- OpenAI API key (if using OpenAI model)
- Cloudflare Worker URL (if using Cloudflare-compatible model)
- (Optional) Tower git client installed for external client integration

## Extension Settings

This extension contributes the following settings:

* `gitCommitSummarizer.openaiApiKey`: OpenAI API Key for generating summaries (required if using OpenAI model)
* `gitCommitSummarizer.externalGitClient`: External Git client to integrate with (None or Tower)
* `gitCommitSummarizer.summaryModel`: Model to use for generating summaries (OpenAI or Cloudflare)
* `gitCommitSummarizer.cloudflareWorkerUrl`: URL of the Cloudflare Worker for generating summaries (required if using Cloudflare model)

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
8. The extension will generate a summary based on your staged changes.
9. Edit the summary if needed and confirm to create a commit.

## Troubleshooting

- If you encounter any issues with the OpenAI model, ensure that you have set a valid API key in the extension settings.
- For Cloudflare model issues, check that you have provided a valid Cloudflare Worker URL in the settings.
- If the extension fails to detect staged changes, make sure you have staged your changes using Git before running the "Generate Commit Summary" command.

## Known Issues

- Currently only supports Tower as an external git client

## Release Notes

### 0.0.1

Initial release of Git Commit Summarizer

### 0.0.2

- Added support for customizable summary styles
- Implemented option to choose between OpenAI and Cloudflare-compatible models for summary generation

---

## Following extension guidelines

This extension follows the [VSCode extension guidelines](https://code.visualstudio.com/api/references/extension-guidelines).

**Enjoy!**
