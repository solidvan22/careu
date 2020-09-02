var express 	= require('express');
var router 	= express.Router();
var mongoDB     = require('../database/mongo_init');
var ObjectID = require('mongodb').ObjectID;
var md5         = require('md5');
var path	= require('path');
const currentPath = process.cwd();
const postsContentPath = path.join(currentPath,'..','posts-content')
const toolKit = require('../app-common-toolkit');
const { post } = require('.');
const validExtensionFiles = {
	'jpg'	: "image",
	'jpeg'	: "image",
	'png'	: "image",
	'mp4'	: "video"
}

/** Get all posts */
router.get('/', async function (req, res, next) {
	// get db, collection objecs
	let db = await mongoDB.getDb();
	let postsCollection = db.collection('posts');
	let postsArray = await postsCollection.find({})
	.sort({dateTime:1})
	.limit(20)
	.toArray();
	for(let post of postsArray){
		if(post.likes) {
			post.likesCount = Object.keys(post.likes).length;
			delete post.likes;
		}
	}
	res.send(postsArray);
});

/** Get post content file */
router.get('/:postId/content',async function (req,res) {
	
		// get userId from URL
		let postId = req.params.postId;

		// get db, collection objecs
		let db = await mongoDB.getDb();
		let postsCollection = db.collection('posts');

		// find user in collection by userId
		let post = await postsCollection.findOne({ _id: ObjectID(postId) });

		// if user not found return error
		if (!post) return res.status(400).send({ error: 'Post not found' })

		let fileName = post.contentFileName;
		//get full post path
		let postPath = postsContentPath + '/' + fileName;

		// send file as a response
		res.sendFile(postPath);
	
})

/** Create new post in database and save file content if exists */
router.post('/', async function (req, res, next) {
	try{
		let newPost = req.body;
		newPost.dateTime = new Date();
		let db	= await mongoDB.getDb();
		let postsCollection = db.collection('posts');
		let usersCollection = db.collection('users');
		let user = await usersCollection.findOne({ _id: ObjectID(newPost.publisherUserId) });
		console.log('PUBLISHER USER >>>>'  , user);
		if (!user) return res.status(400).send({ error: 'Publisher user not found' });
		newPost.publisherUserName = user.nickname;
		let insertionResult = await postsCollection.insertOne(newPost);
		let postId = insertionResult.insertedId;
		let successFileSaved = false;
		if(!(req.files && Object.keys(req.files).length>0  )) return res.send(newPost);
		let sampleFile = req.files.postContent;
		let extension = sampleFile.name.split('.').pop();
		let isValidExtension = validExtensionFiles[extension]? true : false;
		let fileName = postId + "." + extension;
		let pathToSave = postsContentPath + '/' + fileName;
		if(!isValidExtension) return res.status(400).send({error:'Invalid extension file'});
		let contentType = validExtensionFiles[extension];
		successFileSaved = await toolKit.saveFile(sampleFile,pathToSave);
		newPost.contentFileName = fileName;
		newPost.contentType = contentType;
		let updatePostResult = await postsCollection.save(newPost);
		return res.send(newPost);
	}catch(err){
		console.log('ERROR>>>>>>>', err.message);
		res.status(500).send(err.message);
	}
	
	// let response = successFileSaved===true ? 
	// console.log('SampleFile>>' , pathToSave);
});

/** Add new like to a post*/
router.post('/:postId/likes', async function(req,res){
	//get postId from url
	let postId = req.params.postId;

	//get userId 
	let userId = '5f4d35fe510a175b5489df1e'

	// get db, collection objecs
	let db = await mongoDB.getDb();
	let postsCollection = db.collection('posts');

	//find post object in database by postId
	let post = await postsCollection.findOne({ _id: ObjectID(postId) });
	if (!post) return res.send("post not found")

	//get likes object from post 

	let likesObject = post.likes;
	if (!likesObject) likesObject = {}


	//add new like to likes object
	likesObject[userId] = 1;
	post.likes = likesObject;

	//save changes in database
	postsCollection.save(post);
	post.likesCount = Object.keys(likesObject).length;
	res.send(post)

})




// (async ()=> {
// 	console.log('CASA');
// 	var db =  await mongoDB.getDb();
// 	posts=  db.collection('posts');
// 	result = await posts.find({}).toArray();
// 	console.log('RESULT .........................\n' , result)
// })();

module.exports = router;
