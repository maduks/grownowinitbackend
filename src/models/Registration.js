import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  tier: {
    type: String,
    enum: ['arrows', 'mighty-oaks', 'panter', 'tap'],
    required: true,
  },
  general: {
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    stateOfOrigin: { type: String, default: null },
    address: { type: String, default: null },
    churchAttended: { type: String, default: null },
    yearBornAgain: { type: String, default: null },
    socialMediaHandle: { type: String, default: null },
  },
  hobbies: {
    type: [String],
    default: [],
  },
  fieldsOfInterest: {
    type: [String],
    default: [],
  },
  extras: {
    type: Map,
    of: String,
    default: {},
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create an alias for _id -> id to match the requested output shape
registrationSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
