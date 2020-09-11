var jwt = require('jwt-simple');
const secret = 'careu-secret'
function generateToken(userData) {
    return new Promise((resolve, reject) => {
        let expires = new Date();
        let payLoad = {
            iss: "Careu.app",
            exp: expires.setSeconds(expires.getSeconds() + 300000),
            username: userData.username,
            userId: userData.userId
        }
        resolve(jwt.encode(payLoad, secret))
    })
}
function tokenDecode(token){
    if(!token) return false;
    try {
        let decoded = jwt.decode(token, secret);
        let now = new Date().getTime();
        if (decoded.exp > now) {
            console.log("Token verifyed");
            return decoded;
        } else {
            console.log("Token expired");
            return false;
        }
    } catch (e) {
        console.log("Bad token");
        console.log(e);
        return false;
    }
}

module.exports ={generateToken, tokenDecode}