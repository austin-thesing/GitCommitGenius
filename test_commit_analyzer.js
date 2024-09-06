"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gitManager_1 = require("./src/gitManager");
const summaryGenerator_1 = require("./src/summaryGenerator");
const commitAnalyzer_1 = require("./src/commitAnalyzer");
async function testCommitAnalyzer() {
    const gitManager = new gitManager_1.GitManager();
    const summaryGenerator = new summaryGenerator_1.SummaryGenerator();
    const commitAnalyzer = new commitAnalyzer_1.CommitAnalyzer(gitManager, summaryGenerator);
    // Mock staged changes
    const stagedChanges = `
diff --git a/src/example.ts b/src/example.ts
index 1234567..abcdefg 100644
--- a/src/example.ts
+++ b/src/example.ts
@@ -1,5 +1,5 @@
 function greeting(name: string) {
-    console.log('Hello, ' + name + '!');
+    console.log(\`Hello, ${name}!\`);
 }
 
-greeting('World');
+greeting('VSCode Extension');
`;
    try {
        const suggestion = await commitAnalyzer.analyzeAndSuggest(stagedChanges);
        console.log('Commit suggestion:', suggestion);
    }
    catch (error) {
        console.error('Error:', error);
    }
}
testCommitAnalyzer();
//# sourceMappingURL=test_commit_analyzer.js.map