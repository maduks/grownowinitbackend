import mongoose from 'mongoose';

const contactInfoSchema = new mongoose.Schema({
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  facebook: { type: String, default: null },
  instagram: { type: String, default: null },
  twitter: { type: String, default: null },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

contactInfoSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const ContactInfo = mongoose.model('ContactInfo', contactInfoSchema);

export default ContactInfo;
