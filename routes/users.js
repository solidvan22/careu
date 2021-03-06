var express = require('express');
var router = express.Router();
var mongoDB = require('../database/mongo_init');
var ObjectID = require('mongodb').ObjectID;
var md5 = require('md5');
const toolKit = require('../app-common-toolkit');
var path = require('path');
const currentPath = process.cwd();
const profilePicturesPath = path.join(currentPath, '..', 'users-profile-pictures');
const coverPhotosPath = path.join(currentPath, '..', 'users-cover-photo');
const validExtensionFiles = {
	'jpg': 1,
	'jpeg': 1,
	'png': 1,
}

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});
router.post('/:userId/profilepicture', async function(req, res){
	let userId = req.params.userId;
	let db = await mongoDB.getDb();
	let usersCollection = db.collection('users');
	let user = await usersCollection.findOne({ _id: ObjectID(userId) });
	if (!user) return res.status(400).send({ error: 'User not found' })
	if (!(req.files && Object.keys(req.files).length > 0)) return res.send('No file provided');
	let sampleFile = req.files.profilePicture;
	if (!sampleFile) return res.status(400).send({ error: 'Profile photo not found in request' })
	let extension = sampleFile.name.split('.').pop();
	let isValidExtension = validExtensionFiles[extension] ? true : false;
	let fileName = userId + "." + extension;
	let pathToSave = profilePicturesPath + '/' + fileName;
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
	let profilePicturePath = profilePicturesPath + '/' + fileName;
	
	// send file as a response
	res.sendFile(profilePicturePath);
})

router.post('/:userId/coverphoto', async function (req, res) {
	let userId = req.params.userId;
	let db = await mongoDB.getDb();
	let usersCollection = db.collection('users');
	let user = await usersCollection.findOne({ _id: ObjectID(userId) });
	if (!user) return res.status(400).send({ error: 'User not found' })
	if (!(req.files && Object.keys(req.files).length > 0)) return res.send('No file provided');
	let sampleFile = req.files.coverPhoto;
	if (!sampleFile) return res.status(400).send({ error: 'Cover photo not found in request' })
	let extension = sampleFile.name.split('.').pop();
	let isValidExtension = validExtensionFiles[extension] ? true : false;
	let fileName = userId + "." + extension;
	let pathToSave = coverPhotosPath + '/' + fileName;
	if (!isValidExtension) return res.status(400).send({ error: 'Invalid extension file' })
	successFileSaved = await toolKit.saveFile(sampleFile, pathToSave);
	if (!successFileSaved) return res.status(500).send({ error: 'Error saving file' })
	user.coverPhotoFileName = fileName;
	let updateUserResult = await usersCollection.save(user);
	console.log(updateUserResult);
	res.send(updateUserResult.result);
})

router.get('/:userId/coverphoto', async function (req, res) {
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
	let coverPhotoFileName = user.coverPhotoFileName;

	// if profilePicureFileName is null use default profiePicture
	let fileName;
	if (coverPhotoFileName) {
		fileName = coverPhotoFileName
	} else {
		fileName = 'defaultCoverPhoto.jpg'
	}
	//get full proflePicture path
	let coverPhotoPath = coverPhotosPath + '/' + fileName;

	// send file as a response
	res.sendFile(coverPhotoPath);
})

router.put('/:userId',async function(req,res){
	// get userId from url
	let userId = req.params.userId;

	//define allowed keys to change
	let allowedKeys = new Set(['username','password'])

	let changesObject = req.body;
	//get db, collection objects
	let db = await mongoDB.getDb();
	let usersCollection = db.collection('users');

	//find user object in db by userId
	let user = await usersCollection.findOne({ _id: ObjectID(userId) });


	//modify user object
	let keysToChange = Object.keys(changesObject)
	keysToChange.forEach(key=>{
		let isAllowedKey = allowedKeys.has(key);
		let newValue = (key == 'password') ? md5(changesObject[key]) : changesObject[key];
		if (isAllowedKey) user[key] = newValue
	});

	let saveResult = await usersCollection.save(user);
	console.log('FINAL USER TO SAVE >>', saveResult);
	res.send(saveResult.result);
	//save changes


})

module.exports = router;
