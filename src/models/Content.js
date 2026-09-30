import mongoose from 'mongoose';

// One document per editable website section (e.g. "hero", "values", "journey").
// `data` holds the section's fields; list items inside it carry their own `published` flag
// and are rendered in array order.
const contentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  updatedAt: { type: Date, default: Date.now },
}, {
  minimize: false,
});

const Content = mongoose.model('Content', contentSchema);

export default Content;
