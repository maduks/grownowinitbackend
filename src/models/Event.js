import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true }, // Format YYYY-MM-DD
  description: { type: String, required: true },
  location: { type: String, default: null },
  isFeatured: { type: Boolean, default: false },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

eventSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
