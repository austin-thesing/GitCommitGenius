# Git Commit Summarizer

This VSCode extension generates git commit summaries by analyzing staged changes using NLP, and integrates with external git clients.

## Features

- Analyze staged changes in the git repository
- Generate concise summaries of staged changes using OpenAI's GPT-3.5
- Easily copy or directly use generated summaries for commit messages
- Integration with external git clients (currently supports Tower)
- Link commits to GitHub issues automatically
- Token-based system for free and premium users
- Add changes and generate commit summary in one step

## How It Works

1. Stage your changes in Git using `git add` or use the "Add Changes and Generate Commit Summary" command
2. Run the "Generate Commit Summary" command from the Command Palette
3. The extension analyzes your staged changes and generates a summary
4. Review and edit the summary if needed
5. Confirm to create a commit with the generated summary

## Important Note

This extension is now focused solely on analyzing staged changes for commit messages. It will not generate summaries for unstaged changes or the entire repository. Make sure to stage your changes before generating a commit summary.

[... rest of the README content ...]

## Release Notes

### 0.0.20

- Refocused the extension to analyze only staged changes for commit messages
- Updated user messages and documentation to emphasize the focus on staged changes
- Improved error handling and user feedback for cases where no staged changes are found

[... previous release notes ...]

---

## Following extension guidelines

This extension follows the [VSCode extension guidelines](https://code.visualstudio.com/api/references/extension-guidelines).

**Enjoy!**
