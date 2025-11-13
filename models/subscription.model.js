import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: [2],
        maxLength: [100],
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Price must be greater than 0'],
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP'], 
        default: 'USD',
    },
    frequency: {
        type: String,
        enum: ['daily', 'monthly' , 'monthly', 'yearly'],
    },
    category: {
        type: String,
        enum: ['entertainment', 'education', 'productivity', 'health', 'sport', 'news', 'lifestyle', 'other'],
        required: true,
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'canceled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        validate: {
            validator:  (value) => value <= new Date(),
            mesage: 'Start date cannot be in the future' 
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) { 
                return value > this.startDate
            },
            mesage: 'Renewal date must be after start date' 
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true],
        index: true, 
    }
}, {timestamps: true});

// Auto calculate renewalDate if missing
subscriptionSchema.pre('save', function (next) {
    if( !this.renewalDate ) {
        const renewalPeriod = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };
        
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriod[this.frequency]);
    }

    // Auto update status if renewalDate has passed
    if( this.renewalDate < new Date() ) {
        this.status = 'expired';
    }
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;