import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  description: String,
  externalId: { type: String, index: true, unique: false }
}, { timestamps: true });

export const Job = mongoose.model("Job", jobSchema);
