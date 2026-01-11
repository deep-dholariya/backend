import Property from "../models/Property.js";
import ContactRequest from "../models/ContactRequest.js";

// ---------------- CREATE PROPERTY ----------------
export const createProperty = async (req, res) => {
  try {
    const { title, location, price, images } = req.body;

    if (!title || !location || !price || !images || !Array.isArray(images) || images.length === 0)
      return res.status(400).json({ message: "All fields including at least one image are required" });

    for (let img of images) {
      if (!img.startsWith("data:image"))
        return res.status(400).json({ message: "Invalid image format" });
    }

    const property = await Property.create({
      userId: req.user._id,
      title,
      location,
      price,
      images,
    });

    res.status(201).json({ message: "Property created successfully", property });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------- GET MY PROPERTIES ----------------
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ userId: req.user._id });
    const safeProperties = properties.map(prop => ({
      _id: prop._id,
      title: prop.title,
      location: prop.location,
      price: prop.price,
      images: Array.isArray(prop.images) ? prop.images : [],
      status: prop.status,
      createdAt: prop.createdAt,
      updatedAt: prop.updatedAt,
    }));

    res.status(200).json({ success: true, count: safeProperties.length, properties: safeProperties });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------- UPDATE PROPERTY ----------------
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found." });

    if (property.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "You are not the owner of this property." });

    if (property.status === "completed")
      return res.status(400).json({ message: "Cannot edit completed properties." });

    const { title, location, price, images } = req.body;

    if (!title || !location || !price || !images || !Array.isArray(images) || images.length === 0)
      return res.status(400).json({ message: "All fields including at least one image are required." });

    for (let img of images) {
      if (!img.startsWith("data:image")) return res.status(400).json({ message: "Invalid image format." });
    }

    property.title = title;
    property.location = location;
    property.price = price;
    property.images = images;
    property.status = "pending"; // reset status on edit

    await property.save();

    res.status(200).json({ success: true, message: "Property updated successfully.", property });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------- DELETE PROPERTY ----------------
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (property.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "You are not the owner of this property" });

    await ContactRequest.deleteMany({ propertyId: property._id });
    await Property.findByIdAndDelete(property._id);

    res.json({ message: "Property and its contact requests deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------- SEARCH PROPERTIES ----------------
export const searchProperties = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Search query is required" });

    const regex = new RegExp(query, "i");
    const properties = await Property.find({ status: "approved", location: regex });

    const safeProperties = properties.map(prop => ({
      _id: prop._id,
      userId: prop.userId,
      title: prop.title,
      location: prop.location,
      price: prop.price,
      images: Array.isArray(prop.images) ? prop.images : [],
      status: prop.status,
      createdAt: prop.createdAt,
      updatedAt: prop.updatedAt,
    }));

    res.status(200).json({ success: true, count: safeProperties.length, properties: safeProperties });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------- ADMIN STATUS UPDATES ----------------
export const approveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    res.json({ message: "Property approved", property });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
    res.json({ message: "Property rejected", property });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const completeProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { status: "completed" }, { new: true });
    res.json({ message: "Property marked completed", property });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const pendingProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { status: "pending" }, { new: true });
    res.json({ message: "Status changed to pending", property });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- GET APPROVED / PENDING / REJECTED / COMPLETED ----------------
export const getApprovedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "approved", userId: { $ne: req.user._id } });
    const safeProperties = properties.map(prop => ({
      _id: prop._id,
      userId: prop.userId,
      title: prop.title,
      location: prop.location,
      price: prop.price,
      images: Array.isArray(prop.images) ? prop.images : [],
      status: prop.status,
      createdAt: prop.createdAt,
      updatedAt: prop.updatedAt,
    }));
    res.status(200).json({ success: true, count: safeProperties.length, properties: safeProperties });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getApprovedPropertiess = async (req, res) => {
  try {
    const properties = await Property.find({ status: "approved" });
    const safeProperties = properties.map(prop => ({
      _id: prop._id,
      userId: prop.userId,
      title: prop.title,
      location: prop.location,
      price: prop.price,
      images: Array.isArray(prop.images) ? prop.images : [],
      status: prop.status,
      createdAt: prop.createdAt,
      updatedAt: prop.updatedAt,
    }));
    res.status(200).json({ success: true, count: safeProperties.length, properties: safeProperties });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "pending" });
    const safeProperties = properties.map(prop => ({
      _id: prop._id,
      userId: prop.userId,
      title: prop.title,
      location: prop.location,
      price: prop.price,
      images: Array.isArray(prop.images) ? prop.images : [],
      status: prop.status,
      createdAt: prop.createdAt,
      updatedAt: prop.updatedAt,
    }));
    res.status(200).json({ success: true, count: safeProperties.length, properties: safeProperties });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getRejectedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "rejected" });
    const safeProperties = properties.map(prop => ({
      _id: prop._id,
      userId: prop.userId,
      title: prop.title,
      location: prop.location,
      price: prop.price,
      images: Array.isArray(prop.images) ? prop.images : [],
      status: prop.status,
      createdAt: prop.createdAt,
      updatedAt: prop.updatedAt,
    }));
    res.status(200).json({ success: true, count: safeProperties.length, properties: safeProperties });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getCompletedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "completed" });
    const safeProperties = properties.map(prop => ({
      _id: prop._id,
      userId: prop.userId,
      title: prop.title,
      location: prop.location,
      price: prop.price,
      images: Array.isArray(prop.images) ? prop.images : [],
      status: prop.status,
      createdAt: prop.createdAt,
      updatedAt: prop.updatedAt,
    }));
    res.status(200).json({ success: true, count: safeProperties.length, properties: safeProperties });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
