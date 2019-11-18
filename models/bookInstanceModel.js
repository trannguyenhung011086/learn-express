const mongoose = require('mongoose');
const moment = require('moment');

const BookInstanceSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    imprint: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ['available', 'maintenance', 'borrowed', 'reserved'],
        default: 'maintenance',
    },
    dueBack: { type: Date, default: Date.now },
});

BookInstanceSchema.virtual('url').get(function() {
    return '/catalog/bookinstance/' + this._id;
});

BookInstanceSchema.virtual('dueBackFormatted').get(function() {
    return moment(this.dueBack).format('YYYY-MM-DD');
});

module.exports = mongoose.model('BookInstance', BookInstanceSchema);
