const mongoose = require('mongoose');
require('dotenv').config();
const Problem = require('./models/Problem');
const dpProblems = require('./dpProblem.js');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        let count = 0;
        for (let p of dpProblems) {
            await Problem.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true });
            count++;
        }
        console.log("Successfully seeded " + count + " DP problems to database.");
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

seed();
