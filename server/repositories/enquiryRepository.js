import { connectMongoDB, isMongoConfigured } from '../db.js';
import { Enquiry } from '../models/Enquiry.js';

export const enquiryRepository = {
  async create(data) {
    if (isMongoConfigured()) {
      try {
        await connectMongoDB();
        const enquiry = new Enquiry({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          topic: data.topic || 'General Enquiry',
          message: data.message || '',
        });
        const saved = await enquiry.save();
        return { success: true, id: saved._id, savedToMongo: true };
      } catch (err) {
        console.error('MongoDB Enquiry save error:', err);
      }
    }
    return { success: true, savedToMongo: false };
  },
};

export default enquiryRepository;
