import ContactInfo from '../models/ContactInfo.js';
import ContactMessage from '../models/ContactMessage.js';

// Helper to seed/get the singleton contact info document
const getSingletonContactInfo = async () => {
  let contactInfo = await ContactInfo.findOne();
  if (!contactInfo) {
    contactInfo = await ContactInfo.create({
      phone: '',
      email: '',
      address: '',
    });
  }
  return contactInfo;
};

// @desc    Fetch the public contact information
// @route   GET /contact-info
// @access  Public
export const getContactInfo = async (req, res) => {
  try {
    const contactInfo = await getSingletonContactInfo();
    const obj = contactInfo.toJSON();
    delete obj._id;
    delete obj.__v;
    delete obj.id; // Usually public endpoint doesn't need id based on spec
    res.status(200).json(obj);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Update the contact information
// @route   PUT /admin/contact-info
// @access  Private (Admin)
export const updateContactInfo = async (req, res) => {
  try {
    const { phone, email, address, facebook, instagram, twitter } = req.body;
    const contactInfo = await getSingletonContactInfo();

    if (phone !== undefined) contactInfo.phone = phone;
    if (email !== undefined) contactInfo.email = email;
    if (address !== undefined) contactInfo.address = address;
    if (facebook !== undefined) contactInfo.facebook = facebook;
    if (instagram !== undefined) contactInfo.instagram = instagram;
    if (twitter !== undefined) contactInfo.twitter = twitter;

    const updatedContactInfo = await contactInfo.save();
    
    const obj = updatedContactInfo.toJSON();
    delete obj._id;
    delete obj.__v;
    delete obj.id;

    res.status(200).json(obj);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Submit a message from the public contact us page
// @route   POST /contact
// @access  Public
export const submitContactMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;

    const contactMessage = new ContactMessage({
      firstName,
      lastName,
      email,
      subject,
      message,
    });

    await contactMessage.save();

    res.status(200).json({
      success: true,
      message: "Your message has been received. We'll be in touch shortly.",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
