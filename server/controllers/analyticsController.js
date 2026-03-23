const VisitorRequest = require('../models/VisitorRequest');
const EntryExitLog = require('../models/EntryExitLog');

// @desc    Get dashboard metrics
// @route   GET /api/analytics/metrics
// @access  Private/Admin
const getMetrics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalRequestsToday = await VisitorRequest.countDocuments({ createdAt: { $gte: today } });
    const pendingApprovals = await VisitorRequest.countDocuments({ status: 'Pending' });
    const activeVisitors = await EntryExitLog.countDocuments({ status: 'Inside' });
    const totalExitsToday = await EntryExitLog.countDocuments({ checkOutTime: { $gte: today } });

    res.json({
      totalRequestsToday,
      pendingApprovals,
      activeVisitors,
      totalExitsToday
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMetrics };
