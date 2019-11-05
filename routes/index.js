const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.redirect('/catalog');
});

module.exports = router;

// catalog/ — The home/index page.
// catalog/<objects>/ — The list of all books, bookinstances, genres, or authors (e.g. /catalog/books/, /catalog/genres/, etc.)
// catalog/<object>/<id> — The detail page for a specific book, bookinstance, genre, or author with the given _id field value (e.g. /catalog/book/584493c1f4887f06c0e67d37).
// catalog/<object>/create — The form to create a new book, bookinstance, genre, or author (e.g. /catalog/book/create).
// catalog/<object>/<id>/update — The form to update a specific book, bookinstance, genre, or author with the given _id field value (e.g. /catalog/book/584493c1f4887f06c0e67d37/update).
// catalog/<object>/<id>/delete — The form to delete a specific book, bookinstance, genre, author with the given _id field value (e.g. /catalog/book/584493c1f4887f06c0e67d37/delete).
