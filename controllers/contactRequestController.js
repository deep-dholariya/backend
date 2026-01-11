import ContactRequest from "../models/ContactRequest.js";
import Property from "../models/Property.js";

// ---------------- CREATE CONTACT REQUEST ----------------
export const createContactRequest = async (req, res) => {
  try {
    const interestedUserId = req.user._id;
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const ownerUserId = property.userId;
    if (interestedUserId.toString() === ownerUserId.toString())
      return res.status(400).json({ message: "You cannot contact your own property" });

    const existingRequest = await ContactRequest.findOne({ propertyId, interestedUserId });
    if (existingRequest) return res.status(400).json({ message: "Already sent a request for this property" });

    const newRequest = await ContactRequest.create({ propertyId, interestedUserId, ownerUserId });
    res.status(201).json({ message: "Contact request sent successfully", request: newRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------- MARK AS DEAL DONE ----------------
export const markDealDone = async (req, res) => {
  try {
    const request = await ContactRequest.findByIdAndUpdate(req.params.id, { status: "deal_done" }, { new: true });
    if (!request) return res.status(404).json({ message: "Request not found" });

    await Property.findByIdAndUpdate(request.propertyId, { status: "completed" });
    res.json({ success: true, message: "Marked as Deal Done and property completed", request });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ---------------- MARK AS NOT INTERESTED ----------------
export const markNotInterested = async (req, res) => {
  try {
    const request = await ContactRequest.findByIdAndUpdate(req.params.id, { status: "not_interested" }, { new: true });
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json({ success: true, message: "Marked as Not Interested", request });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ---------------- SET STATUS TO PENDING ----------------
export const setPending = async (req, res) => {
  try {
    const updated = await ContactRequest.findByIdAndUpdate(req.params.id, { status: "pending" }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Request not found" });
    res.json({ success: true, message: "Status updated to pending", updated });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ---------------- GET PENDING REQUESTS ----------------
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await ContactRequest.find({ status: "pending" })
      .populate("propertyId")
      .populate("interestedUserId", "fullName email mobileNumber")
      .populate("ownerUserId", "fullName email mobileNumber")
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ---------------- GET DEAL DONE REQUESTS ----------------
export const getDealDoneRequests = async (req, res) => {
  try {
    const requests = await ContactRequest.find({ status: "deal_done" })
      .populate("propertyId")
      .populate("interestedUserId", "fullName email mobileNumber")
      .populate("ownerUserId", "fullName email mobileNumber")
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ---------------- GET NOT INTERESTED REQUESTS ----------------
export const getNotInterestedRequests = async (req, res) => {
  try {
    const requests = await ContactRequest.find({ status: "not_interested" })
      .populate("propertyId")
      .populate("interestedUserId", "fullName email mobileNumber")
      .populate("ownerUserId", "fullName email mobileNumber")
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};




// ==========================================
// ---------------- GET MY INTEREST (PENDING ONLY) ----------------
export const getMyInterest = async (req, res) => {
  try {
    const requests = await ContactRequest.find({ interestedUserId: req.user._id, status: "pending" })
      .populate("propertyId")
      .sort({ createdAt: -1 });

    const properties = requests.map(req => req.propertyId ? { requestId: req._id, ...req.propertyId._doc } : null).filter(Boolean);
    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};
// ==============================================



// =========================
// ⭐ PENDING REQUESTS
// =========================
export const userPending = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await ContactRequest.find({
      interestedUserId: userId,
      status: "pending",
    })
      .populate("propertyId")
      .populate("ownerUserId", "fullName email mobileNumber")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};


// =========================
// ⭐ DEAL DONE REQUESTS
// =========================
export const userDealDone = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await ContactRequest.find({
      interestedUserId: userId,
      status: "deal_done",
    })
      .populate("propertyId")
      .populate("ownerUserId", "fullName email mobileNumber")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};


// =========================
// ⭐ NOT INTERESTED REQUESTS
// =========================
export const userNotInterested = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await ContactRequest.find({
      interestedUserId: userId,
      status: "not_interested",
    })
      .populate("propertyId")
      .populate("ownerUserId", "fullName email mobileNumber")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};





// ---------------- DELETE CONTACT REQUEST ----------------
export const deleteRequest = async (req, res) => {
  try {
    const request = await ContactRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Contact request not found" });

    if (request.interestedUserId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized to delete this request" });

    await ContactRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Contact request deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};
