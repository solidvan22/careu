

function uploadFunction(URL,fileName) {
    let input = document.getElementById('input-file');
    let loadingMessage = document.getElementById('loading-message');
    loadingMessage.style.display = 'flex';
    let formData = new FormData();
    formData.append(fileName, input.files[0]);
    jQuery.ajax({
        url: URL,
        data: formData,
        contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST', // For jQuery < 1.9
        success: function (data) {
            loadingMessage.style.display= 'none';
            window.location.href = window.location.href
        }
    });
}

function showProfilePictureModalWindow(){

}

function readFile(input){
    let profilePreview = document.getElementById('img-profile-picture-preview')
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            console.log('LOADING PROFILE PICTURE >>>', e.target.result )
            profilePreview.setAttribute('src', e.target.result)
            //$('#').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
}
(function main() {

    console.log('Session user id', session.userId)
    let userId = session.userId  ;
    var typeOfPhoto = '';
    /** Elements */
    let inputFile = document.getElementById('input-file');
    let modalTitle = document.getElementById('modal-title')
    
    inputFile.onchange = function() {
        console.log('FILE CHANGE ', this);
        readFile(this);
    }
    
    // get show modal Profile picture button by id and save in modalProfilePicrureBtn
    let modalProfilePictureBtn = document.getElementById('modal-profile-picture-btn');

    // get show modal Cover picture button by id and save in modalProfilePicrureBtn
    let modalCoverPictureBtn = document.getElementById('modal-cover-picture-btn');
    
    //listen for click event on modalProfilePicrureBtn
    modalProfilePictureBtn.onclick = ()=> {
        typeOfPhoto = 'profilepicture';
        console.log('PROFILE PICTURE')
        modalTitle.innerText = 'Update Profle Picture'
        inputFile.click()
    };
    //listen for click event on modalProfilePicrureBtn
    modalCoverPictureBtn.onclick = () => {
        typeOfPhoto = 'coverPhoto'
        console.log('COVER PICTURE')
        modalTitle.innerText = 'Update Cover Picture'
        inputFile.click()
        
    };

    let selectFileBtn          = document.getElementById('btn-select-file');
    selectFileBtn.onclick = ()=> profilePicuctureInput.click();
    
    let saveProfilePicture = document.getElementById('btn-save-file');
    saveProfilePicture.onclick = () => {
        let fileName = (typeOfPhoto == 'profilepicture') ? 'profilePicture' : 'coverPhoto'
        let url = `http://35.231.29.183:3000/users/${userId}/${typeOfPhoto}`
        uploadFunction(url, fileName);
    }
    
    feed = new Feed(document.getElementById('newsfeed-items-grid'))
    feed.loadPosts({publisherUserId: userId})
    
})();