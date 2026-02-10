import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRoles } from '../constants/roles.js';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        index: true, // Optimizes searching by name
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false, // Security: This prevents password from being sent in API responses by default
    },
    role: {
        type: String,
        enum: Object.values(UserRoles),
        default: UserRoles.PATIENT,
    },
    phone: {
        type: String,
        trim: true,
    },
    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    // Geospatial data for finding nearby donors/hospitals
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
            default: [0, 0]
        }
    },
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
    },
}, {
    timestamps: true
});

// 1. Create Geospatial Index for Blood Donor searches
userSchema.index({ location: "2dsphere" });

// 2. Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 3. Instance Method to check password (Senior Dev practice)
// Usage: const isMatch = await user.isPasswordCorrect(enteredPassword)
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);
export default User;