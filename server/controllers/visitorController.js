const VisitorRequest = require('../models/VisitorRequest');

// @desc    Get requests for logged-in faculty
// @route   GET /api/visitors/host
// @access  Private (Faculty)
const getFacultyRequests = async (req, res) => {
  try {
    const requests = await VisitorRequest.find({ hostId: req.user._id })
      .populate('hostId', 'name email')
      .populate('department', 'name')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching faculty requests:', error);
    res.status(500).json({ message: 'Server error while fetching requests' });
  }
};

// @desc    Update request status
// @route   PUT /api/visitors/:id/status
// @access  Private (Faculty)
const updateVisitorStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Only allowed statuses from your model
    const allowedStatuses = ['Approved', 'Rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const request = await VisitorRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Visitor request not found' });
    }

    // Faculty can only update their own requests
    if (request.hostId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    request.status = status;
    const updatedRequest = await request.save();

    res.json(updatedRequest);
  } catch (error) {
    console.error('Error updating visitor status:', error);
    res.status(500).json({ message: 'Server error while updating status' });
  }
};

module.exports = {
  getFacultyRequests,
  updateVisitorStatus
};