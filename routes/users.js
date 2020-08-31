var express = require('express');
var router = express.Router();
var mongoDB = require('../database/mongo_init');
var ObjectID = require('mongodb').ObjectID;
var md5 = require('md5');
const toolKit = require('../app-common-toolkit');
var path = require('path');
const currentPath = process.cwd();
const profilePicuresPath = path.join(currentPath, '..', 'users-profile-pictures');
const validExtensionFiles = {
	'jpg': 1,
	'jpeg': 1,
	'png': 1,
}

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

router.post('/', async function (req, res) {
	let newUser = req.body;
	newUser.password = md5(newUser.password);
	let db = await mongoDB.getDb();
	let usersCollection = db.collection('users');
	let insertResult = await usersCollection.insertOne(newUser);
	console.log('>>>>>>>> USER INSERTED >>> ' , insertResult);
	res.send(insertResult.result);
})

router.post('/:userId/profilepicture', async function(req, res){
	let userId = req.params.userId;
	let db = await mongoDB.getDb();
	let usersCollection = db.collection('users');
	let user = await usersCollection.findOne({ _id: ObjectID(userId) });
	if (!user) return res.status(400).send({ error: 'User not found' })
	if (!(req.files && Object.keys(req.files).length > 0)) return res.send('No file provided');
	let sampleFile = req.files.profilePicture;
	let extension = sampleFile.name.split('.').pop();
	let isValidExtension = validExtensionFiles[extension] ? true : false;
	let fileName = userId + "." + extension;
	let pathToSave = profilePicuresPath + '/' + fileName;
	if (!isValidExtension) return res.status(400).send({ error: 'Invalid extension file' })
	successFileSaved = await toolKit.saveFile(sampleFile, pathToSave);
	if (!successFileSaved) return res.status(500).send({error: 'Error saving file'})
	user.profilePictureFileName = fileName;
	let updateUserResult = await usersCollection.save(user);
	console.log(updateUserResult);
	res.send(updateUserResult.result);
})

router.get('/:userId/profilepicture', async function(req,res){
	// get userId from URL
	let userId = req.params.userId;
	
	// get db, collection objecs
	let db = await mongoDB.getDb();
	let usersCollection = db.collection('users');

	// find user in collection by userId
	let user = await usersCollection.findOne({ _id: ObjectID(userId) });
	
	// if user not found return error
	if (!user) return res.status(400).send({ error: 'User not found' })
	
	// get proflePicureFilename from user found
	let profilePictureFileName = user.profilePictureFileName;

	// if profilePicureFileName is null use default profiePicture
	let fileName;
	if (profilePictureFileName) {
		fileName = profilePictureFileName
	}else{
		fileName = 'defaultProfilePicture.svg'
	}
	//get full proflePicture path
	let profilePicturePath = profilePicuresPath + '/' + fileName;
	
	// send file as a response
	res.sendFile(profilePicturePath);
})

module.exports = router;
