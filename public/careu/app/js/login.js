// API functions
function apiPostLogin() {
    return new Promise((resolve, reject) => {
        emailElement        = document.getElementById('login-email') 
        passWordElement     = document.getElementById('login-password');
        let email               = emailElement.value;
        let password            = passWordElement.value;
        let sendData = {
            "email": email,
            "password": password
        }
       
        jQuery.ajax({
            url: 'login',
            data: sendData,
            dataType: 'json',
            method: 'POST',
            success: function (data) {
                console.log('ok')
                resolve(data);
            },
            fail: function (error) {
                console.log('fail >' , error);
                reject(error)
            },
            error: function (error){
                console.log('ERROR> ' , error)
                reject(error)
            }
        });
    })
}
async function login() {
    try {
        await apiPostLogin();
        window.location.href = 'home'

    } catch (error) {
        console.log('IN CASE ON EROR')
        showErrorMessage();
    }
}

function hideErrorMessage(){
    let errorMessage = document.getElementById("incorrect-email-or-password");
    errorMessage.style.display = 'none';
}

function showErrorMessage(){
    let errorMessage = document.getElementById("incorrect-email-or-password");
    errorMessage.style.display = 'initial'
}

(function main(){
    let loginButton = document.getElementById('login-btn');
    loginButton.onclick =login
    
    let password  = document.getElementById('login-password');
    password.onfocus = hideErrorMessage
})()