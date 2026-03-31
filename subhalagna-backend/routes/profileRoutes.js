const express = require('express');
const router = express.Router();
const { getMatches, updateProfile, setupProfile, getProfileById } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(protect, getMatches);

// Setup primary profile step internally mapping robust photo inputs
router.post('/setup', protect, upload.fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'additionalPhotos', maxCount: 5 }]), setupProfile);

// Profile operations by ID
router.route('/:id')
  .get(protect, getProfileById)
  .put(protect, upload.fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'additionalPhotos', maxCount: 5 }]), updateProfile);

module.exports = router;
