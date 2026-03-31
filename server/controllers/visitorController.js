const VisitorRequest = require('../models/VisitorRequest');
const VisitorPass = require('../models/VisitorPass');

// @desc    Create new visitor request
// @route   POST /api/visitors/request
// @access  Public
const createVisitorRequest = async (req, res) => {
  try {
    const request = await VisitorRequest.create(req.body);
    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating visitor request:', error);
    res.status(500).json({ message: 'Server error while creating request' });
  }
};

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

    if (status === 'Approved') {
      const existingPass = await VisitorPass.findOne({ requestId: request._id });
      if (!existingPass) {
        await VisitorPass.create({
          requestId: request._id,
          passId: `QR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          validFrom: request.visitDate,
          validUntil: new Date(new Date(request.visitDate).getTime() + 12 * 60 * 60 * 1000), // 12 hrs
          status: 'Active'
        });
      }
    }

    res.json(updatedRequest);
  } catch (error) {
    console.error('Error updating visitor status:', error);
    res.status(500).json({ message: 'Server error while updating status' });
  }
};

// @desc    Get requests for logged-in visitor
// @route   GET /api/visitors/my-requests
// @access  Private (Visitor)
const getMyRequests = async (req, res) => {
  try {
    const query = [];
    if (req.user.email) query.push({ email: req.user.email });
    if (req.user.mobile) query.push({ mobile: req.user.mobile });

    if (query.length === 0) return res.json([]);

    const requests = await VisitorRequest.find({ $or: query })
      .populate('hostId', 'name')
      .populate('department', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const requestIds = requests.map(r => r._id);
    const passes = await VisitorPass.find({ requestId: { $in: requestIds } }).lean();

    const formattedRequests = requests.map(req => {
      const pass = passes.find(p => p.requestId.toString() === req._id.toString());
      return { ...req, pass: pass || null };
    });

    res.json(formattedRequests);
  } catch (error) {
    console.error('Error fetching my requests:', error);
    res.status(500).json({ message: 'Server error while fetching my requests' });
  }
};

module.exports = {
  getFacultyRequests,
  updateVisitorStatus,
  createVisitorRequest,
  getMyRequests
};