const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cash', 'credit_card', 'bank_transfer', 'check', 'online_payment']
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    referenceNumber: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        trim: true
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringDetails: {
        frequency: {
            type: String,
            enum: ['weekly', 'monthly', 'quarterly', 'yearly']
        },
        nextPaymentDate: Date,
        endDate: Date
    }
}, {
    timestamps: true
});

// Indexes for better query performance
donationSchema.index({ donor: 1, date: -1 });
donationSchema.index({ status: 1 });
donationSchema.index({ paymentMethod: 1 });

// Virtual for formatted amount
donationSchema.virtual('formattedAmount').get(function() {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(this.amount);
});

// Method to check if donation is overdue
donationSchema.methods.isOverdue = function() {
    if (this.isRecurring && this.recurringDetails.nextPaymentDate) {
        return this.recurringDetails.nextPaymentDate < new Date();
    }
    return false;
};

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation; 