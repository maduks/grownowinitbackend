import Registration from '../models/Registration.js';

// @desc    Submit a new membership registration form
// @route   POST /registrations
// @access  Public
export const createRegistration = async (req, res) => {
  try {
    const { tier, general, hobbies, fieldsOfInterest, extras } = req.body;

    // Check if registration with email already exists
    if (general && general.email) {
      const existingUser = await Registration.findOne({ 'general.email': general.email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'A registration with this email already exists.',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'Email is required in general info.',
      });
    }

    const registration = new Registration({
      tier,
      general,
      hobbies,
      fieldsOfInterest,
      extras,
    });

    const savedRegistration = await registration.save();

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully.',
      registrationId: savedRegistration._id,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || 'Validation error message',
    });
  }
};

// @desc    Fetch all submitted membership registrations
// @route   GET /admin/registrations
// @access  Private (Admin)
export const getRegistrations = async (req, res) => {
  try {
    // Select exclusions can be added if we don't need _v, etc. But virtuals handle id mapping.
    const registrations = await Registration.find({}).sort({ submittedAt: -1 });
    // Map to remove mongo-specific properties if desired, but toJSON handles it roughly
    const formatted = registrations.map(reg => {
      const obj = reg.toJSON();
      delete obj._id;
      delete obj.__v;
      return obj;
    });
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Fetch a single registration by ID
// @route   GET /admin/registrations/:id
// @access  Private (Admin)
export const getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (registration) {
      const obj = registration.toJSON();
      delete obj._id;
      delete obj.__v;
      res.status(200).json(obj);
    } else {
      res.status(404).json({ error: 'Registration not found.' });
    }
  } catch (error) {
    res.status(404).json({ error: 'Registration not found.' });
  }
};
