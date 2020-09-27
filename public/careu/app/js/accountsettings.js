async function changePassword(event){
    event.preventDefault();
    let password = document.getElementById('password');
    let userId = window.session.userId;
    let body = {
        "password": password.value
    }
    try{
        let result = await apiPutUser(userId, body);
        // when change password success:

        //remove the access token cookie
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        //refresh window
        window.location.href = window.location.href

    }catch(error){
        console.log('Error trying to change password' , error.message)
    }
    

}

async function changeUsername(event){
    event.preventDefault();
    let username = document.getElementById('username');
    let userId = window.session.userId;
    let body = {
        "username": username.value
    }

    try{
        let result = await apiPutUser(userId, body);
        window.location.href = 'profile'

    }catch(error){
        console.log('Error trying to change username', error.message)
    }
}

function main(){
    let password= document.getElementById('password');
    let username= document.getElementById('username')
    let passwordButton= document.getElementById('passwordButton');
    passwordButton.onclick =changePassword
    let usernameButton= document.getElementById('usernameButton');
    usernameButton.onclick = changeUsername
    let passwordConfirm = document.getElementById('password-confirm');
    passwordConfirm.onkeyup = function () {
        if (passwordConfirm.value == password.value && (passwordConfirm.value !='')){
            console.log('same password');
            passwordButton.disabled = false


        }else{
            console.log('passwords do not match');
            passwordButton.disabled =true;
        }
    }

    password.onkeyup = function () {
        if (password.value == passwordConfirm.value && (password.value != '')) {
            console.log('same password');
            passwordButton.disabled = false


        } else {
            console.log('passwords do not match');
            passwordButton.disabled = true;
        }
    }

    username.onkeyup = function () {
        if (username.value == username.value && (username.value != ''))
            usernameButton.disabled = false


        else {
            console.log('cannot update username');
            usernameButton.disabled = true;

        }
    }
}

function apiPutUser(userId,body) {
    /** Send put  reques to remote server, set new username and/or password */
    return new Promise((resolve,reject)=>{
        jQuery.ajax({
            url: 'users/' + userId,
            data: body,
            dataType: 'json',
            method: 'PUT',
            success: function (dataResponse) {
                console.log('ok')
                resolve(dataResponse);
            },
            fail: function (error) {
                console.log('fail >', error);
                reject(error)
            },
            error: function (error) {
                console.log('ERROR> ', error)
                reject(error)
            }
        });
    })
}


main();


// let result = await  apiPutUser(userId,{
//     "username": "MEGAN"
// })