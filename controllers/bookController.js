const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookInstance');

module.exports = {
    index: async (req, res) => {
        const [
            bookCount,
            bookInstanceCount,
            bookInstanceAvailableCount,
            authorCount,
            genreCount,
        ] = await Promise.all([
            Book.countDocuments({}),
            BookInstance.countDocuments({}),
            BookInstance.countDocuments({ status: 'available' }),
            Author.countDocuments({}),
            Genre.countDocuments({}),
        ]);
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
    },
    bookList: (req, res) => {
        res.send('TODO: book list');
    },
    bookDetails: (req, res) => {
        res.send('TODO: book details ' + req.params.id);
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
