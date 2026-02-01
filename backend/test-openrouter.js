const axios = require('axios');
require('dotenv').config();

async function testQwenModel() {
  console.log("Testing Qwen model on OpenRouter...\n");

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'qwen/qwen-2-7b-instruct:free',
      messages: [
        {
          role: 'user',
          content: 'Write a simple hello world function in JavaScript. Provide ONLY the code.'
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://algoarena.com',
        'X-Title': 'AlgoArena Code Editor'
      },
      timeout: 15000
    });

    console.log("✅ SUCCESS! Qwen model is working!\n");
    console.log("Generated Code:");
    console.log("─".repeat(60));
    console.log(response.data.choices[0].message.content);
    console.log("─".repeat(60));
    console.log("\n✅ AI code generation is ready! Try it in your AlgoArena UI.");
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Qwen model failed:", error.response?.data?.error || error.message);
    
    if (error.response?.data?.error?.code === 429) {
      console.log("\n⚠️  This model is also rate-limited. Let me try openrouter/auto...\n");
      
      try {
        const autoResponse = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
          model: 'openrouter/auto',
          messages: [{ role: 'user', content: 'Say hello' }]
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log("✅ openrouter/auto works! This will select the best available model.");
        console.log("Update aiController.js to use: 'openrouter/auto'");
        process.exit(0);
      } catch (autoError) {
        console.error("❌ Auto-select also failed:", autoError.response?.data?.error?.message);
      }
    }
    
    console.log("\n📝 Next steps:");
    console.log("1. Check your OpenRouter dashboard: https://openrouter.ai/");
    console.log("2. Ensure you have credits or free tier access");
    console.log("3. Try adding a payment method for access to more models");
    process.exit(1);
  }
}

testQwenModel();
