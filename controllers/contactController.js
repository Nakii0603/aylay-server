
import Contact from "../models/Contact.js"; 

export const createContact = async (req, res) => {
  try {
    const { name, email, phone, location, more, organizationCitizen } =
      req.body;

    const newContact = new Contact({
      name,
      email,
      phone,
      location,
      more,
      organizationCitizen,
    });

    await newContact.save();
    res
      .status(201)
      .json({ message: "Contact created successfully", data: newContact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create contact" });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res
      .status(200)
      .json({ message: "Contacts retrieved successfully", data: contacts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve contacts" });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res
      .status(200)
      .json({ message: "Contact deleted successfully", data: deletedContact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete contact" });
  }
};
