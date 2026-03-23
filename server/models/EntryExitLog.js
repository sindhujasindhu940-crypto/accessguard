const mongoose = require('mongoose');

const entryExitLogSchema = new mongoose.Schema({
  passId: { type: mongoose.Schema.Types.ObjectId, ref: 'VisitorPass', required: true },
  checkInTime: { type: Date, default: Date.now },
  checkOutTime: { type: Date },
  checkedInBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Security staff ID
  checkedOutBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['Inside', 'CheckedOut'],
    default: 'Inside'
  }
}, { timestamps: true });

module.exports = mongoose.model('EntryExitLog', entryExitLogSchema);
