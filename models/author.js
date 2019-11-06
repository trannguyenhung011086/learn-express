const mongoose = require('mongoose');
const moment = require('moment');

const AuthorSchema = new mongoose.Schema({
    firstName: { type: String, required: true, max: 100 },
    lastName: { type: String, required: true, max: 100 },
    dateOfBirth: { type: Date },
    dateOfDeath: { type: Date },
    books: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Book',
            default: null,
        },
    ],
});

AuthorSchema.virtual('fullName').get(function() {
    return this.lastName + ' ' + this.firstName;
});

AuthorSchema.virtual('lifeSpan').get(function() {
    return this.dateOfBirth
        ? moment(this.dateOfBirth).format('YYYY-MM-DD')
        : '' - this.dateOfDeath
        ? moment(this.dateOfDeath).format('YYYY-MM-DD')
        : '';
});

AuthorSchema.virtual('url').get(function() {
    return '/catalog/author/' + this._id;
});

AuthorSchema.virtual('products').get(function() {
    return this.books.map(book => '/catalog/book/' + book._id);
});

module.exports = mongoose.model('Author', AuthorSchema);
