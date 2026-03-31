const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true // A user can only have one profile
  },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  location: { type: String, default: "" },
  currentState: { type: String, default: "" },
  currentCity: { type: String, default: "" },
  nativeState: { type: String, default: "" },
  nativeCity: { type: String, default: "" },
  
  // Advanced fields
  caste: { type: String, default: "" },
  religion: { type: String, default: "Hindu" },
  education: { type: String, default: "Graduate" },
  profession: { type: String, default: "Professional" },
  height: { type: String, default: "5' 5\"" },
  bio: { type: String, default: "Looking for a true partner with shared values." },
  
  // Photos
  profilePhoto: { type: String, default: "/woman.png" }, // Sticking to default imagery
  additionalPhotos: [{ type: String }],
  
  // Verification
  isVerified: { type: Boolean, default: false },

  // Partner Preferences
  partnerPreferences: {
    minAge: { type: Number, default: 18 },
    maxAge: { type: Number, default: 40 },
    location: { type: String, default: "Any" },
    caste: { type: String, default: "Any" }
  },

  // Family Background
  family: {
    fatherName: { type: String, default: "" },
    motherName: { type: String, default: "" },
    siblings: { type: String, default: "0" },
    familyType: { type: String, default: "Nuclear" }
  },

  // Personality & Hobbies
  traits: [{ type: String }],
  interests: [{ type: String }],
  partnerInterests: { type: String, default: "" }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Profile', profileSchema);
