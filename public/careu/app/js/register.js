

function apiPostRegister(sendData) {
        return new Promise((resolve, reject) => {    
            jQuery.ajax({
                url: 'register',
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



async function register(event){
       
        if(event)event.preventDefault();
        try{
            
                let nameInput           = document.getElementById('name');
                let usernameInput       = document.getElementById('username');
                let schoolInput         = document.getElementById('school');
                let emailInput          = document.getElementById('email');
                let passwordInput       = document.getElementById('password');
                let newUserData = {
                        "name"      : nameInput.value,
                        "username"  : usernameInput.value ,
                        "email"     : emailInput.value,
                        "school"    : schoolInput.value,
                        "password"  : passwordInput.value
                }
                let registerResult = await apiPostRegister(newUserData);
                console.log('Register result >>' , registerResult)
                window.location.href = 'home'
        }
        catch(err){
                console.log('Error register >>>' , err)
        }
}

(function main(){
        let registrationButton      = document.getElementById('btn-register');
        registrationButton.disabled = true;

        let checkBox            = document.getElementById('checkTerms');
        checkBox.onchange = function(){
                console.log(this.checked)
                if(this.checked) {registrationButton.disabled = false}
                else {registrationButton.disabled = true} 
        }
        registrationButton.onclick  = register
    })()