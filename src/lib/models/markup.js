import mongoose from "mongoose";
const MarkupSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: mongoose.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    tags: {
      type: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
      validate: [
        validateLength,
        "{PATH} nu poate avea mai mult de 200 elemente",
      ],
    },
  },
  { timestamps: true }
);
function validateLength(tags) {
  return tags.length <= 100;
}

export default mongoose.models.Markup || mongoose.model("Markup", MarkupSchema);
