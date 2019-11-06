const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookInstance');

module.exports = {
    index: async (req, res) => {
        try {
            const bookCount = await Book.countDocuments({}).exec();
            const bookInstanceCount = await BookInstance.countDocuments(
                {},
            ).exec();
            const bookInstanceAvailableCount = await BookInstance.countDocuments(
                { status: 'available' },
            ).exec();
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
            console.log(err);
            return res.render('index', {
                title: 'Local Library Home',
                error: err,
            });
        }
    },
    bookList: async (req, res, next) => {
        try {
            const bookList = await Book.find({}, 'title author')
                .populate('author')
                .exec();
            res.render('bookList', { title: 'Book List', bookList });
        } catch (err) {
            next(err);
        }
    },
    bookDetails: (req, res) => {
        res.send('TODO: book details');
    },
    bookCreateGet: (req, res) => {
        res.send('TODO: book create GET');
    },
    bookCreatePost: (req, res) => {
        res.send('TODO: book create POST');
    },
    bookDeleteGet: (req, res) => {
        res.send('TODO: book delete GET');
    },
    bookDeletePost: (req, res) => {
        res.send('TODO: book delete POST');
    },
    bookUpdateGet: (req, res) => {
        res.send('TODO: book update GET');
    },
    bookUpdatePost: (req, res) => {
        res.send('TODO: book update POST');
    },
};
