const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const { authenticate, authorize } = require('../middleware/auth');

// @route   GET api/members
// @desc    Get all members
// @access  Private
router.get('/', async (req, res) => {
    try {
        const members = await Member.find().sort({ joinDate: -1 });
        res.json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET api/members/:id
// @desc    Get member by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.json(member);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/members
// @desc    Create new member
// @access  Private
router.post('/', async (req, res) => {
    try {
        const member = new Member(req.body);
        await member.save();
        res.status(201).json(member);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT api/members/:id
// @desc    Update member
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const member = await Member.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.json(member);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE api/members/:id
// @desc    Delete member
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.json({ message: 'Member deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET api/members/stats/status
// @desc    Get member status statistics
// @access  Private
router.get('/stats/status', async (req, res) => {
    try {
        const stats = await Member.aggregate([
            {
                $group: {
                    _id: '$status',
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

// @route   GET api/members/stats/type
// @desc    Get member type statistics
// @access  Private
router.get('/stats/type', async (req, res) => {
    try {
        const stats = await Member.aggregate([
            {
                $group: {
                    _id: '$membershipType',
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