const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true, max: 100 },
    lastName: { type: String, required: true, max: 100 },
    email: { type: String, required: true, match: /.+@.+\./ },
    password: { type: String, required: true, min: 6 },
    permissionLevel: { type: String, enum: ['user', 'admin'], default: 'user' },
    active: { type: Boolean, default: false },
    activeCode: String,
    activeCodeExpires: Date,
});

UserSchema.virtual('fullName').get(function() {
    return this.lastName + ' ' + this.firstName;
});

UserSchema.virtual('url').get(function() {
    return '/user/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);
