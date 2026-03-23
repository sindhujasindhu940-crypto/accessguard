const VisitorPass = require('../models/VisitorPass');
const EntryExitLog = require('../models/EntryExitLog');

// @desc    Scan Pass by passId
// @route   GET /api/tracking/scan/:passId
// @access  Private/Security
const scanPass = async (req, res) => {
  try {
    const pass = await VisitorPass.findOne({ passId: req.params.passId })
      .populate({
        path: 'requestId',
        populate: [
          { path: 'hostId', select: 'name department' },
          { path: 'department', select: 'name' }
        ]
      });

    if (!pass) {
      return res.status(404).json({ message: 'Invalid or missing pass' });
    }

    if (pass.status !== 'Active') {
      return res.status(400).json({ message: `Pass is ${pass.status}` });
    }

    // Check if currently inside
    const activeLog = await EntryExitLog.findOne({ passId: pass._id, status: 'Inside' });

    res.json({ pass, activeLog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check-in Visitor
// @route   POST /api/tracking/checkin
// @access  Private/Security
const checkIn = async (req, res) => {
  try {
    const { passId } = req.body;
    
    // Check if already checked in
    const existingLog = await EntryExitLog.findOne({ passId, status: 'Inside' });
    if (existingLog) {
      return res.status(400).json({ message: 'Visitor already checked in' });
    }

    const log = await EntryExitLog.create({
      passId,
      checkedInBy: req.user._id,
      status: 'Inside'
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check-out Visitor
// @route   PUT /api/tracking/checkout/:logId
// @access  Private/Security
const checkOut = async (req, res) => {
  try {
    const log = await EntryExitLog.findById(req.params.logId);

    if (log && log.status === 'Inside') {
      log.status = 'CheckedOut';
      log.checkOutTime = Date.now();
      log.checkedOutBy = req.user._id;

      const updatedLog = await log.save();
      res.json(updatedLog);
    } else {
      res.status(404).json({ message: 'Active entry log not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active visitors
// @route   GET /api/tracking/active
// @access  Private/Admin/Security
const getActiveVisitors = async (req, res) => {
  try {
    const logs = await EntryExitLog.find({ status: 'Inside' })
      .populate({
        path: 'passId',
        populate: { path: 'requestId', select: 'visitorName purpose' }
      })
      .sort({ checkInTime: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { scanPass, checkIn, checkOut, getActiveVisitors };
