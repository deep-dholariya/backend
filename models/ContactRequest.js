import mongoose from "mongoose";

const contactRequestSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    interestedUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "deal_done", "not_interested"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("ContactRequest", contactRequestSchema);
