require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb+srv://orelus_db_user:Admin123@cluster0.szo0cmo.mongodb.net/student_management?retryWrites=true&w=majority';

async function fixUsernameIndex() {
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('users');

    // Lister tous les index
    const indexes = await collection.indexes();
    console.log('\n📋 Current indexes:');
    indexes.forEach(index => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key));
    });

    // Vérifier si l'index username_1 existe
    const usernameIndex = indexes.find(idx => idx.name === 'username_1');
    
    if (usernameIndex) {
      console.log('\n⚠️ Found unique index on username, dropping it...');
      await collection.dropIndex('username_1');
      console.log('✅ Index username_1 dropped successfully');
    } else {
      console.log('\n✅ No unique index on username found');
    }

    // Afficher les index restants
    const remainingIndexes = await collection.indexes();
    console.log('\n📋 Remaining indexes:');
    remainingIndexes.forEach(index => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key));
    });

    console.log('\n✅ Fix completed successfully');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
  }
}

fixUsernameIndex();
