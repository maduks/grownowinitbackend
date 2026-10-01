import Content from '../models/Content.js';

export const CONTENT_KEYS = [
  'hero',
  'visionMission',
  'beliefs',
  'whoWeAre',
  'values',
  'journey',
  'tiers',
  'stats',
  'pulse',
  'stories',
  'eventHistory',
];

const isPublished = (item) => !(item && typeof item === 'object' && item.published === false);

// Removes unpublished list items (at any depth) so drafts never reach the public site.
const stripUnpublished = (value) => {
  if (Array.isArray(value)) {
    return value.filter(isPublished).map(stripUnpublished);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, stripUnpublished(v)])
    );
  }
  return value;
};

const toPublic = (doc) => {
  const data = doc.data || {};
  if (data.published === false) return { published: false };
  return stripUnpublished(data);
};

// @desc    All published website content, keyed by section
// @route   GET /content
// @access  Public
export const getPublicContent = async (req, res) => {
  try {
    const docs = await Content.find({ key: { $in: CONTENT_KEYS } });
    const result = {};
    docs.forEach((doc) => {
      result[doc.key] = toPublic(doc);
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    All website content including drafts, keyed by section
// @route   GET /admin/content
// @access  Private (Admin, Editor)
export const getAdminContent = async (req, res) => {
  try {
    const docs = await Content.find({ key: { $in: CONTENT_KEYS } });
    const result = {};
    docs.forEach((doc) => {
      result[doc.key] = { data: doc.data, updatedAt: doc.updatedAt };
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Create or replace one section's content
// @route   PUT /admin/content/:key
// @access  Private (Admin, Editor)
export const updateContent = async (req, res) => {
  const { key } = req.params;
  if (!CONTENT_KEYS.includes(key)) {
    return res.status(404).json({ error: 'Unknown content section' });
  }

  const { data } = req.body || {};
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return res.status(400).json({ error: '`data` must be an object' });
  }

  try {
    const doc = await Content.findOneAndUpdate(
      { key },
      { key, data, updatedAt: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ key: doc.key, data: doc.data, updatedAt: doc.updatedAt });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Remove a section's saved content so the website falls back to its built-in default
// @route   DELETE /admin/content/:key
// @access  Private (Admin, Editor)
export const resetContent = async (req, res) => {
  const { key } = req.params;
  if (!CONTENT_KEYS.includes(key)) {
    return res.status(404).json({ error: 'Unknown content section' });
  }

  try {
    await Content.deleteOne({ key });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
