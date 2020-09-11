var express = require('express');
var router = express.Router();
var mongoDB = require('../database/mongo_init');
var auth    = require('../authentication')
var md5 = require('md5');

router.get('/', function (req, res, next) {
    console.log('LOGIN VIEW!')
    res.render('login', { title: 'Login', layout: false });
});

router.post('/', async function (req, res) {
    try{
        // get email and password from body
        let email= req.body.email;
        let password= req.body.password;

        if(!email)  return res.status(400).send("Missing email");
        if (!email) return res.status(400).send("Missing password");
        
        // get db, collection objects
        let db = await mongoDB.getDb();
        let usersCollection = db.collection('users');

        // find user with email, password
        let filter = { email, password:md5(password) };
        console.log('FILTER>>>>' ,  filter);
        let user = await usersCollection.findOne(filter);
        console.log('USER >>>>', user);
        // if user not found return error
        if (!user) return res.status(400).send({ error: 'incorrect email or password' });
        // else return access token
        let accessToken = await auth.generateToken({
            email       :user.email , 
            username    :user.username,
            userId      :user._id
        })
        res.cookie("accessToken", accessToken, { expire: new Date + 1000});
        return res.send({ token: accessToken });
    }catch(error){
        res.status(500).send({errorMessage:error.message})
    }
})


module.exports = router;
