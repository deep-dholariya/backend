import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: arr => arr.length > 0,
        message: "At least one image is required",
      },
    },
    status: { type: String, enum: ["pending", "approved", "rejected", "completed"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertySchema);
