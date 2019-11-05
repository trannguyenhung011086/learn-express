const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
    firstName: { type: String, required: true, max: 100 },
    lastName: { type: String, required: true, max: 100 },
    dateOfBirth: { type: Date },
    dateOfDeath: { type: Date },
});

AuthorSchema.virtual('fullName').get(function() {
    return this.lastName + ' ' + this.firstName;
});

AuthorSchema.virtual('lifeSpan').get(function() {
    return (this.dateOfDeath.getYear() - this.dateOfBirth.getYear()).toString();
});

AuthorSchema.virtual('url').get(function() {
    return '/catalog/author/' + this._id;
});

module.exports = mongoose.model('Author', AuthorSchema);
