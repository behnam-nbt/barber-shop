import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // Duration in minutes (e.g., 30, 45)
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);
