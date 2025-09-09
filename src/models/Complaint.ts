import mongoose from "../services/db";

const ComplaintSchema = new (mongoose as any).Schema(
  {
    userId: {
      type: (mongoose as any).Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true },
    category: { type: String, default: "" },
    image_url: { type: String },
    status: { type: String, default: "submitted" },
    urgency: { type: String, enum: ["low", "medium", "high"], default: "low" },
    assigned_officer_id: { type: String, default: null },
    estimated_completion_time: { type: Date, default: null },
    location_latitude: { type: Number, default: null },
    location_longitude: { type: Number, default: null },
  },
  { timestamps: true }
);

const Complaint =
  (mongoose as any).models.Complaint ||
  (mongoose as any).model("Complaint", ComplaintSchema);

export default Complaint;
