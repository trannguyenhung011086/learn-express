const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    // check login session
    res.redirect('/catalog');
});

module.exports = router;
