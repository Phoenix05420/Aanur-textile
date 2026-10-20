import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  topic: { type: String, default: 'General Enquiry' },
  message: { type: String, required: true },
  status: { type: String, default: 'New' },
}, { timestamps: true });

export const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
export default Enquiry;
