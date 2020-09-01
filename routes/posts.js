var express 	= require('express');
var router 	= express.Router();
var mongoDB     = require('../database/mongo_init');
var ObjectID = require('mongodb').ObjectID;
var md5         = require('md5');
var path	= require('path');
const currentPath = process.cwd();
const postsContentPath = path.join(currentPath,'..','posts-content')
const toolKit = require('../app-common-toolkit');
const validExtensionFiles = {
	'jpg':1,
	'jpeg':1,
	'png':1,
	'mp4':1,
	'wav':1
}

router.get('/', function (req, res, next) {
	res.send('get all posts');
});

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
router.post('/', async function (req, res, next) {
	try{
		let newPost = req.body;
		newPost.dateTime = new Date();
		let db	= await mongoDB.getDb();
		let postsCollection = db.collection('posts');
		let insertionResult = await postsCollection.insertOne(newPost);
		let postId = insertionResult.insertedId;
		let successFileSaved = false;
		if(!(req.files && Object.keys(req.files).length>0  )) return res.send(newPost);
		let sampleFile = req.files.postContent;
		let extension = sampleFile.name.split('.').pop();
		let isValidExtension = validExtensionFiles[extension]? true : false;
		let fileName = postId + "." + extension;
		let pathToSave = postsContentPath + '/' + fileName;
		if(!isValidExtension) return res.status(400).send({error:'Invalid extension file'})
		successFileSaved = await toolKit.saveFile(sampleFile,pathToSave);
		newPost.contentFileName = fileName;
		let updatePostResult = await postsCollection.save(newPost);
		return res.send(newPost);
	}catch(err){
		console.log('ERROR>>>>>>>', err.message);
		res.status(500).send(err.message);
	}
	
	// let response = successFileSaved===true ? 
	// console.log('SampleFile>>' , pathToSave);
});

router.post('/:id', function (req, res, next) {
	let postId = req.params.id;
	res.send('update post with id' + postId );
});


// (async ()=> {
// 	console.log('CASA');
// 	var db =  await mongoDB.getDb();
// 	posts=  db.collection('posts');
// 	result = await posts.find({}).toArray();
// 	console.log('RESULT .........................\n' , result)
// })();

module.exports = router;
