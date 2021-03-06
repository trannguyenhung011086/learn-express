const mongoose = require('mongoose');
const moment = require('moment');

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
    const birth = this.dateOfBirth
        ? moment(this.dateOfBirth).format('YYYY-MM-DD')
        : '';
    const death = this.dateOfDeath
        ? moment(this.dateOfDeath).format('YYYY-MM-DD')
        : '';
    return birth + ' - ' + death;
});

AuthorSchema.virtual('birth').get(function() {
    return moment(this.dateOfBirth).format('YYYY-MM-DD');
});

AuthorSchema.virtual('death').get(function() {
    return moment(this.dateOfDeath).format('YYYY-MM-DD');
});

AuthorSchema.virtual('url').get(function() {
    return '/catalog/author/' + this._id;
});

module.exports = mongoose.model('Author', AuthorSchema);
