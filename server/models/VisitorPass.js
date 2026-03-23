const mongoose = require('mongoose');

const visitorPassSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'VisitorRequest', required: true },
  passId: { type: String, required: true, unique: true }, // Unique string for QR code
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Active', 'Expired', 'Revoked'], 
    default: 'Active' 
  }
}, { timestamps: true });

module.exports = mongoose.model('VisitorPass', visitorPassSchema);
