var mongoDB = require('../database/mongo_init');
var auth = require('../authentication');
const { ObjectID } = require('mongodb');
async function session(req, res, next) {
    let token;
    let cookies = req.cookies;
    let db = await  mongoDB.getDb();
    let usersCollection = db.collection('users');

    if (cookies.accessToken) token = cookies.accessToken
    //else if (req.body.token) token = req.body.token
    if (!token) return res.redirect('/login');;
    let payLoad = auth.tokenDecode(token);
    if (payLoad === false) return res.send('Invalid token');
    let userId = payLoad.userId;
    
    let user = await usersCollection.findOne({ _id: ObjectID(userId) });
    if (!user) return res.redirect('/login');
    
    req.sessionData = {
        username : user.username,
        email : user.email,
        userId : user._id
    };
    next();
}
module.exports = session