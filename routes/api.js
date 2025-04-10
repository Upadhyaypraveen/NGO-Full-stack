const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

// Import route handlers
const authRoutes = require('./auth');
const memberRoutes = require('./members');
const donationRoutes = require('./donations');
const eventRoutes = require('./events');

// Use routes
router.use('/auth', authRoutes);
router.use('/members', authenticate, memberRoutes);
router.use('/donations', authenticate, donationRoutes);
router.use('/events', authenticate, eventRoutes);

// Dashboard routes
router.get('/dashboard/stats', authenticate, async (req, res) => {
    try {
        // Get counts from different collections
        const [
            totalMembers,
            totalDonations,
            upcomingEvents,
            activeVolunteers
        ] = await Promise.all([
            Member.countDocuments(),
            Donation.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
            Event.countDocuments({ status: 'upcoming' }),
            Member.countDocuments({ status: 'active' })
        ]);

        res.json({
            totalMembers,
            totalDonations: totalDonations[0]?.total || 0,
            upcomingEvents,
            activeVolunteers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin routes
router.get('/admin/users', authenticate, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/admin/users/:id/status', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { isActive } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = router;
