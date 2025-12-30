const express = require('express');
const router = express.Router();

// Exemple de route GET pour notifications (à adapter selon besoin)
router.get('/', (req, res) => {
  res.json([]); // Retourne une liste vide pour l'instant
});

module.exports = router;
