const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://orelus_db_user:Admin123@cluster0.szo0cmo.mongodb.net/student_management?retryWrites=true&w=majority';
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('⚠️ Continuing without DB for API testing...');
    // Don't exit process, just continue
  }
};

module.exports = connectDB;
