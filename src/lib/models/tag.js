import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

TagSchema.index({ owner: 1, name: 1 }, { unique: true });

export default mongoose.models.Tag || mongoose.model("Tag", TagSchema);
