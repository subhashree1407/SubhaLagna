const Profile = require('../models/Profile');

// @desc    Create User Initial Profile (Step 2 Onboarding)
// @route   POST /api/profiles/setup
// @access  Private
const setupProfile = async (req, res) => {
   try {
     const { 
        name, gender, age, location, caste, religion, height, education, profession, bio, traits, interests,
        fatherName, motherName, siblings, familyType,
        currentState, currentCity, nativeState, nativeCity,
        partnerInterests
     } = req.body;

     // Hard validation 18+ requirement natively
     if (Number(age) < 18) {
       return res.status(400).json({ message: 'Invalid Age: Must be 18 or older to register.' });
     }

     const profileExists = await Profile.findOne({ user: req.user._id });
     if (profileExists) {
       return res.status(400).json({ message: 'Profile already exists for this user.' });
     }

     let photoPath = gender === 'Male' ? '/man.png' : '/woman.png';
     let additionalPhotos = [];
     
     if (req.files && req.files['profilePhoto']) {
       photoPath = `/${req.files['profilePhoto'][0].filename}`;
     }
     if (req.files && req.files['additionalPhotos']) {
       additionalPhotos = req.files['additionalPhotos'].map(f => `/${f.filename}`);
     }

     const traitsArray = traits ? traits.split(',').map(t => t.trim()).filter(Boolean) : [];
     const interestsArray = interests ? interests.split(',').map(i => i.trim()).filter(Boolean) : [];

     const profile = await Profile.create({
       user: req.user._id,
       name,
       gender,
       age,
       location: location || (currentCity && currentState ? `${currentCity}, ${currentState}` : location),
       caste,
       religion,
       height,
       currentState: currentState || '',
       currentCity: currentCity || '',
       nativeState: nativeState || '',
       nativeCity: nativeCity || '',
       education: education || 'Graduate',
       profession: profession || 'Professional',
       bio: bio || '',
       profilePhoto: photoPath,
       additionalPhotos,
       traits: traitsArray,
       interests: interestsArray,
       family: {
         fatherName: fatherName || '',
         motherName: motherName || '',
         siblings: siblings || '0',
         familyType: familyType || 'Nuclear'
       },
       partnerInterests: partnerInterests || ""
     });

     res.status(201).json(profile);
    } catch(error) {
      console.error("Profile Setup Error:", error);
      res.status(500).json({ message: error.message || 'Server error during setup' });
    }
};

// @desc    Get matches based on query params (Advanced Filters)
// @route   GET /api/profiles
// @access  Private
const getMatches = async (req, res) => {
  try {
    const { gender, location, minAge, maxAge, caste, religion, education } = req.query;

    if (!gender) {
      return res.status(400).json({ message: 'Target gender query is required.' });
    }

    let query = { gender };

    // Dynamic filters
    if (location && location !== 'Any') query.location = location;
    if (caste && caste !== 'Any') query.caste = caste;
    if (religion && religion !== 'Any') query.religion = religion;
    if (education && education !== 'Any') query.education = education;

    // Age matching logic
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = Number(minAge);
      if (maxAge) query.age.$lte = Number(maxAge);
    }

    const matches = await Profile.find(query).populate('user', 'email');
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update single profile including image uploads
// @route   PUT /api/profiles/:id
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }

    // Upload handling
    let updateData = { ...req.body };
    
    if (req.files && req.files['profilePhoto']) {
      updateData.profilePhoto = `/${req.files['profilePhoto'][0].filename}`;
    }
    
    // Handle additional photos (gallery)
    if (req.files && req.files['additionalPhotos']) {
       const newPhotos = req.files['additionalPhotos'].map(f => `/${f.filename}`);
       // Append to existing photos, ensuring we don't exceed a reasonable limit (e.g., 6)
       const existingPhotos = profile.additionalPhotos || [];
       updateData.additionalPhotos = [...existingPhotos, ...newPhotos].slice(0, 6);
    }
    
    // Support for deleting specific photos if requested
    if (req.body.removePhotos) {
      const photosToRemove = JSON.parse(req.body.removePhotos); // Expecting array of URLs
      const remainingPhotos = (updateData.additionalPhotos || profile.additionalPhotos || []).filter(
        p => !photosToRemove.includes(p)
      );
      updateData.additionalPhotos = remainingPhotos;
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single profile by ID
// @route   GET /api/profiles/:id
// @access  Private
const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id).populate('user', 'email name');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  setupProfile,
  getMatches,
  updateProfile,
  getProfileById
};
