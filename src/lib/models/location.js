import mongoose from "mongoose";
const LocationSchema = new mongoose.Schema({
  place_id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  latlon: [{ type: Number, required: true }],
  address: { type: String, required: true },
  type: String,
  city: { type: String, required: true },
  country: { type: String, required: true },
});

export default mongoose.models.Location ||
  mongoose.model("Location", LocationSchema);
