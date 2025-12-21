const mongoose = require('mongoose');

async function migrateRoles() {
  try {
    // Connexion à MongoDB
    await mongoose.connect('mongodb+srv://team_moa:moa123456@cluster0.mongodb.net/sms_db');
    
    console.log('✅ Connecté à MongoDB');
    
    const db = mongoose.connection.db;
    
    // Convertir tous les rôles "teacher" en "scolarite" directement
    const result = await db.collection('users').updateMany(
      { role: 'teacher' },
      { $set: { role: 'scolarite' } }
    );
    
    console.log(`✅ Migration réussie: ${result.modifiedCount} utilisateur(s) converti(s)`);
    
    // Afficher les statistiques
    const stats = await db.collection('users').aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]).toArray();
    console.log('📈 Statistiques par rôle:', stats);
    
    await mongoose.connection.close();
    console.log('✅ Terminé');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

migrateRoles();
