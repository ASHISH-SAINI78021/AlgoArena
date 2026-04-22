const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('./models/Problem');

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Problem.countDocuments();
        const problems = await Problem.find({}, 'title slug');
        console.log(`Total problems in DB: ${count}`);
        console.log('Problems:', problems);
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkDB();
