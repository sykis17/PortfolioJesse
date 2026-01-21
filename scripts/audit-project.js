const fs = require('fs');
const path = require('path');

async function runAudit() {
  const contextPath = path.resolve(process.cwd(), 'static/ai-context/CODE_MAP.txt');
  
  if (!fs.existsSync(contextPath)) {
    console.error("❌ CODE_MAP.txt missing. Run: node scripts/update-ai-context.js");
    process.exit(1);
  }

  const context = fs.readFileSync(contextPath, 'utf-8');
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY not set in environment");
    process.exit(1);
  }

  console.log("🔍 Auditing PortfolioJesse project...\n");

  const auditPrompt = `You are a code quality expert auditing a Junior Developer portfolio project built with Docusaurus, React, and Tailwind CSS.

PROJECT CONTEXT:
${context}

AUDIT CHECKLIST - Provide specific feedback for each:

1. **Component Quality**: Check components for React best practices, hooks usage, error handling. Flag any issues.

2. **Theme System**: Verify Themes.js and ThemeProvider.jsx are properly integrated. Check for missing color definitions or unused theme variants.

3. **Tailwind Best Practices**: Review tailwind.config.js and component classes. Suggest optimizations, check for redundant classes.

4. **Import Paths**: Verify @site/src imports are correct and all referenced files exist.

5. **Docusaurus Integration**: Check if components properly use Docusaurus APIs (useDocusaurusContext, etc). Flag any missing dependencies.

6. **Error Handling**: Review AIAssistant and api utilities for error handling, edge cases, user feedback.

7. **Code Organization**: Suggest improvements for file structure, component organization, naming conventions.

8. **Performance**: Identify potential performance issues (large imports, unoptimized renders, etc).

9. **Accessibility**: Check for a11y issues in components (alt text, ARIA labels, semantic HTML).

10. **Deployment Readiness**: Flag any issues that might break the GitHub Pages build.

FORMAT YOUR RESPONSE AS:
- START with a summary score (e.g., "Overall: 7.5/10 - Good foundation, needs minor improvements")
- LIST each section with specific findings
- END with TOP 3 PRIORITY FIXES

Be constructive and specific. This is a learning portfolio for interviews.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-001:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: auditPrompt }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ Gemini API Error:", data.error.message);
      process.exit(1);
    }

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("❌ No response from AI. Check API quota/permissions.");
      process.exit(1);
    }

    const auditReport = data.candidates[0].content.parts[0].text;

    // Save report
    const reportPath = path.resolve(process.cwd(), 'static/ai-context/AUDIT_REPORT.md');
    fs.writeFileSync(reportPath, `# Portfolio Audit Report\n\nGenerated: ${new Date().toISOString()}\n\n${auditReport}`);

    console.log("━".repeat(60));
    console.log("📋 AI PORTFOLIO AUDIT REPORT");
    console.log("━".repeat(60));
    console.log(auditReport);
    console.log("\n✅ Full report saved to: static/ai-context/AUDIT_REPORT.md");

  } catch (error) {
    console.error("❌ Audit failed:", error.message);
    process.exit(1);
  }
}

runAudit();