const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const modelsToTry = [
  "gemini-pro",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "models/gemini-pro",
  "models/gemini-1.5-pro", 
  "models/gemini-1.5-flash",
];

async function testModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  console.log("API Key configured:", !!process.env.GEMINI_API_KEY);
  console.log("SDK Version: @google/generative-ai@0.24.1\n");
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ SUCCESS with "${modelName}"!`);
      console.log(`Response: ${text}\n`);
      console.log(`\n🎯 USE THIS MODEL NAME IN YOUR CODE: "${modelName}"\n`);
      process.exit(0);
    } catch (error) {
      const shortError = error.message.split('\n')[0].substring(0, 100);
      console.log(`❌ ${shortError}...\n`);
    }
  }
  
  console.log("❌ All models failed!");
  console.log("\nPlease check:");
  console.log("1. API key validity at: https://aistudio.google.com/app/apikey");
  console.log("2. Billing enabled for your Google Cloud project");  
  process.exit(1);
}

testModels();
