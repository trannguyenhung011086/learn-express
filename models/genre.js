const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: [
            'poetry',
            'fantasy',
            'fiction',
            'non-fiction',
            'romance',
            'horror',
            'history',
            'textbook',
        ],
        min: 3,
        max: 100,
    },
});

GenreSchema.virtual('url').get(function() {
    return '/catalog/genre/' + this._id;
});

module.exports = mongoose.model('Genre', GenreSchema);
