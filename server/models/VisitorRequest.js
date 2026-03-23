const mongoose = require('mongoose');

const visitorRequestSchema = new mongoose.Schema({
  visitorName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String },
  purpose: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visitDate: { type: Date, required: true },
  idProofType: { type: String, required: true },
  idProofNumber: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('VisitorRequest', visitorRequestSchema);
