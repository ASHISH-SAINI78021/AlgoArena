const extractCodeBlocks = (text) => {
    if (!text) return [];
    
    // Improved regex to handle optional whitespace after backticks
    const codeBlockRegex = /```[ \w]*\n([\s\S]*?)```/g;
    const blocks = [];
    let match;
    
    while ((match = codeBlockRegex.exec(text)) !== null) {
      blocks.push(match[1].trim());
    }
    
    if (blocks.length > 0) return blocks;
    
    // Fallback logic
    const hasExplanation = /\b(here'?s|the issue|the problem|you should|explanation|mistake|error is|wrong with)\b/i.test(text);
    if (!hasExplanation) return [text.trim()];
    
    return [];
};

const getExplanationText = (text) => {
    if (!text) return '';
    // Improved regex here too
    let explanation = text.replace(/```[ \w]*\n[\s\S]*?```/g, '[CODE BLOCK]').trim();
    return explanation.length === 0 ? '' : explanation;
};

// Test cases
const tests = [
    {
        name: "Standard Markdown",
        text: "Here is code:\n```javascript\nconsole.log('hi');\n```\nEnd."
    },
    {
        name: "No Language",
        text: "Code:\n```\nprint('hello')\n```"
    },
    {
        name: "Space after backticks",
        text: "Code:\n``` \nprint('space')\n```"
    },
    {
        name: "Pure Code",
        text: "console.log('just code');"
    },
    {
        name: "Mixed",
        text: "Explanation.\n```js\ncode1\n```\nMore text.\n```python\ncode2\n```"
    }
];

tests.forEach(test => {
    console.log(`--- Test: ${test.name} ---`);
    const blocks = extractCodeBlocks(test.text);
    const explanation = getExplanationText(test.text);
    console.log("Blocks:", blocks);
    console.log("Explanation:", explanation);
    console.log("\n");
});
