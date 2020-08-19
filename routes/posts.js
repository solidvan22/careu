var express 	= require('express');
var router 	= express.Router();
var mongoDB     = require('../database/mongo_init');
var md5         = require('md5');

router.get('/', function (req, res, next) {
	res.send('get all posts');
});

router.post('/', function (req, res, next) {
	res.send('create new post');
});

router.post('/:id', function (req, res, next) {
	let postId = req.params.id;
	res.send('update post with id' + postId );
});
module.exports = router;
