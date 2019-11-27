const Book = require('../models/bookModel');
const Author = require('../models/authorModel');
const Genre = require('../models/genreModel');
const BookInstance = require('../models/bookInstanceModel');

module.exports = async (req, res) => {
    try {
        const bookCount = await Book.countDocuments({}).exec();
        const bookInstanceCount = await BookInstance.countDocuments({}).exec();
        const bookInstanceAvailableCount = await BookInstance.countDocuments({
            status: 'available',
        }).exec();
        const authorCount = await Author.countDocuments({}).exec();
        const genreCount = await Genre.countDocuments({}).exec();

        res.render('index', {
            title: 'Local Library Home',
            data: {
                bookCount,
                bookInstanceCount,
                bookInstanceAvailableCount,
                authorCount,
                genreCount,
            },
        });
    } catch (err) {
        res.render('index', {
            title: 'Local Library Home',
            error: err,
        });
    }
};
