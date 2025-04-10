const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const { authenticate, authorize } = require('../middleware/auth');

// @route   GET api/donations
// @desc    Get all donations
// @access  Private
router.get('/', async (req, res) => {
    try {
        const donations = await Donation.find().sort({ date: -1 });
        res.json(donations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET api/donations/:id
// @desc    Get donation by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        res.json(donation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/donations
// @desc    Create new donation
// @access  Private
router.post('/', async (req, res) => {
    try {
        const donation = new Donation(req.body);
        await donation.save();
        res.status(201).json(donation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT api/donations/:id
// @desc    Update donation
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const donation = await Donation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        res.json(donation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE api/donations/:id
// @desc    Delete donation
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const donation = await Donation.findByIdAndDelete(req.params.id);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        res.json({ message: 'Donation deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET api/donations/stats/total
// @desc    Get total donations
// @access  Private
router.get('/stats/total', async (req, res) => {
    try {
        const stats = await Donation.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(stats[0] || { total: 0, count: 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET api/donations/stats/monthly
// @desc    Get monthly donation statistics
// @access  Private
router.get('/stats/monthly', async (req, res) => {
    try {
        const stats = await Donation.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' }
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    '_id.year': -1,
                    '_id.month': -1
                }
            }
        ]);
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET api/donations/stats/payment-method
// @desc    Get donation statistics by payment method
// @access  Private
router.get('/stats/payment-method', async (req, res) => {
    try {
        const stats = await Donation.aggregate([
            {
                $group: {
                    _id: '$paymentMethod',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 