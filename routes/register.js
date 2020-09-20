
var express = require('express');
var router = express.Router();
var mongoDB = require('../database/mongo_init');
var ObjectID = require('mongodb').ObjectID;
var md5 = require('md5');
var auth    = require('../authentication')

router.post('/', async function (req, res) {
	let newUser 		= req.body;
	newUser.password 	= md5(newUser.password);
	let db 			= await mongoDB.getDb();
	let usersCollection 	= db.collection('users');
	let insertResult	= await usersCollection.insertOne(newUser);
	let newUserData		= insertResult.ops[0]
	console.log('INSERT USER RESULT >>>>' , insertResult);

	let accessToken 	= await auth.generateToken({
		email       :newUserData.email , 
		username    :newUserData.username,
		userId      :newUserData._id
	})
	res.cookie("accessToken", accessToken, { expire: new Date + 1000});
	return res.send({ token: accessToken });
})

module.exports = router;
