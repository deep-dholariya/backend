import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Property from "../models/Property.js";
import ContactRequest from "../models/ContactRequest.js";

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, currentPassword } = req.body;
    const user = await User.findById(req.user._id);

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.mobileNumber = mobileNumber || user.mobileNumber;
    await user.save();

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user and related data
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const userProperties = await Property.find({ userId });
    const propertyIds = userProperties.map(p => p._id);

    if (propertyIds.length > 0) await ContactRequest.deleteMany({ propertyId: { $in: propertyIds } });
    await Property.deleteMany({ userId });
    await ContactRequest.deleteMany({ $or: [{ interestedUserId: userId }, { ownerUserId: userId }] });
    await User.findByIdAndDelete(userId);

    res.clearCookie("token");
    res.json({ message: "Account, properties, and related contact requests deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
