import Event from '../models/Event.js';

// @desc    List events (unpublished events are only returned to signed-in staff)
// @route   GET /admin/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const filter = req.user ? {} : { published: { $ne: false } };
    const events = await Event.find(filter).sort({ date: 1 });
    const formatted = events.map(e => {
      const obj = e.toJSON();
      delete obj._id;
      delete obj.__v;
      return obj;
    });
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Create a new event
// @route   POST /admin/events
// @access  Private (Admin)
export const createEvent = async (req, res) => {
  try {
    const { title, date, description, location, tag, color, isFeatured, published } = req.body;

    const event = new Event({
      title,
      date,
      description,
      location,
      tag,
      color,
      isFeatured,
      published,
    });

    const savedEvent = await event.save();
    const obj = savedEvent.toJSON();
    delete obj._id;
    delete obj.__v;

    res.status(201).json(obj);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update an existing event
// @route   PUT /admin/events/:id
// @access  Private (Admin)
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      event.title = req.body.title || event.title;
      event.date = req.body.date || event.date;
      event.description = req.body.description || event.description;
      if (req.body.location !== undefined) event.location = req.body.location;
      if (req.body.tag !== undefined) event.tag = req.body.tag;
      if (req.body.color !== undefined) event.color = req.body.color;
      if (req.body.isFeatured !== undefined) event.isFeatured = req.body.isFeatured;
      if (req.body.published !== undefined) event.published = req.body.published;

      const updatedEvent = await event.save();
      const obj = updatedEvent.toJSON();
      delete obj._id;
      delete obj.__v;

      res.status(200).json(obj);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /admin/events/:id
// @access  Private (Admin)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      await event.deleteOne();
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
