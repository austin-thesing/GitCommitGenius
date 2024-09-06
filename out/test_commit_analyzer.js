"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commitAnalyzer_1 = require("./src/commitAnalyzer");
class MockGitManager {
    async getCommitHistory(limit = 10) {
        return [
            'abc1234 - Fix: Resolve issue with login functionality',
            'def5678 - Feature: Add user profile page',
            'ghi9012 - Refactor: Improve code structure in main component'
        ];
    }
}
class MockSummaryGenerator {
    async generateSummary(prompt) {
        return 'Feature: Update greeting message and recipient';
    }
}
async function testCommitAnalyzer() {
    const mockGitManager = new MockGitManager();
    const mockSummaryGenerator = new MockSummaryGenerator();
    const commitAnalyzer = new commitAnalyzer_1.CommitAnalyzer(mockGitManager, mockSummaryGenerator);
    // Mock staged changes
    const stagedChanges = `
diff --git a/src/example.ts b/src/example.ts
index 1234567..abcdefg 100644
--- a/src/example.ts
+++ b/src/example.ts
@@ -1,5 +1,5 @@
 function greeting(name: string) {
-    console.log('Hello, ' + name + '!');
+    console.log(\`Hello, \${name}!\`);
 }

-greeting('World');
+greeting('VSCode Extension');
`;
    try {
        const suggestion = await commitAnalyzer.analyzeAndSuggest(stagedChanges);
        console.log('Commit suggestion:', suggestion);
        if (suggestion === 'Feature: Update greeting message and recipient') {
            console.log('Test passed: CommitAnalyzer is working as expected.');
        }
        else {
            console.log('Test failed: Unexpected commit suggestion.');
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
}
testCommitAnalyzer();
//# sourceMappingURL=test_commit_analyzer.js.map