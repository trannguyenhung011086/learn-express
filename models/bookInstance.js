const mongoose = require('mongoose');

const BookInstanceSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    imprint: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ['vailable', 'maintenance', 'borrowed', 'reserved'],
        default: 'maintenance',
    },
    dueBack: { type: Date, default: Date.now },
});

BookInstanceSchema.virtual('url').get(function() {
    return '/catalog/bookinstance/' + this._id;
});

module.exports = mongoose.model('BookInstance', BookInstanceSchema);
