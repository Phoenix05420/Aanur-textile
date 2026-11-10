import express from 'express';
import { enquiryRepository } from '../repositories/enquiryRepository.js';

export const enquiriesRouter = express.Router();

enquiriesRouter.post('/api/enquiries', async (req, res) => {
  try {
    const result = await enquiryRepository.create(req.body || {});
    return res.status(201).json(result);
  } catch (err) {
    console.error('Enquiries route error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default enquiriesRouter;
