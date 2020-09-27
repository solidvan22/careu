


function previewImage (){

}

function preview(file, previewElement,type){
	if(file){
		let resourceURL = URL.createObjectURL(file)
		console.log('RESOURCE URL>> ', resourceURL);
		console.log('PREVIEW ELEMENT>>' , previewElement)
		previewElement.src = resourceURL
	}
}

function readFile(input,previewElementId) {
	let previewElement = document.getElementById(previewElementId)
	console.log('Preview Element >>>', previewElement);

	//let divPreview = document.getElementById('div-preview')
	if (input.files && input.files[0]) {
		let resourceURL = URL.createObjectURL(file)
		console.log('RESOURCE URL>> ', resourceURL);
		previewElement.src = resourceURL;
		/* previewElement.style.display = 'flex';
		var reader = new FileReader();
		reader.onload = function (e) {
			console.log('LOADING PROFILE PICTURE >>>', e.target.result)
			previewElement.setAttribute('src', e.target.result)
		}
		reader.readAsDataURL(input.files[0]); */ // convert to base64 string
	}
}



function post(formData) {
	return new Promise((resolve,reject) =>{
		let url = 'posts'
		jQuery.ajax({
			url: url,
			data: formData,
			cache: false,
			contentType: false,
			processData: false,
			method: 'POST',
			type: 'POST', // For jQuery < 1.9
			success: function (data) {
				resolve(data)
				// alert(data);
			},
			error:function(error){
				reject(error)
			}
		});
	})
}

(function main() {
	/** Elements */
	let category = session.title.toLowerCase();
	let uploadButton = document.getElementById('post-button');
	let inputFile = document.getElementById('input-file')
	let openPostWindowButton = document.getElementById('open-post-window');
	let spanCreatePost = document.getElementById('span-create-post');
	let modalWindowContainer = document.getElementById('modalWindow-container');
	let cancelButton = document.getElementById('cancel-button');
	let selectFileBtn = document.getElementById('btn-select-file');
	let postNotification = document.getElementById('post-notification');
	let closeNotification = document.getElementById('close-notification-btn')
	
	selectFileBtn.onclick = () => inputFile.click();



	feed = new Feed(document.getElementById('newsfeed-items-grid'))
	console.log('CATEGORY>>>>', category);
	feed.loadPosts()

	/** Events */
	cancelButton.onclick = function () {
		modalWindowContainer.style.display = "none";
	}

	openPostWindowButton.onclick = function () {
		modalWindowContainer.style.display = "flex";
	}

	spanCreatePost.onclick = function () {
		modalWindowContainer.style.display = "flex";
	}

	uploadButton.onclick = async function () {

		let input = document.getElementById('input-file');
		let loadingMessageMobile = document.getElementById('loading-post-message-mobile');
		let loadingMessage = document.getElementById('loading-post-message');
		loadingMessageMobile.style.display = 'flex'
		loadingMessage.style.display = 'flex'
		let formData = new FormData();
		let category = session.title.toLowerCase()
		let textArea = document.getElementById('post-textarea')
		formData.append("postContent", input.files[0]);
		formData.append('publisherUserId', session.userId);
		formData.append('text', textArea.value);
		formData.append('category', category);
		modalWindowContainer.style.display = "none";
		let postResult = await post(formData);
		loadingMessageMobile.style.display = 'none';
		loadingMessage.style.display = 'none';
		postNotification.style.display = 'block';

	}
	inputFile.onchange = function () {
		console.log('FILE CHANGE ', this);

		let file = this.files[0]
		let typeOfFile = file.type.split('/')[0]
		console.log(file, 'Type >>', typeOfFile)
		// --- show preview --- 
		let previewIdToShow = typeOfFile == 'video' ? 'video-preview' : 'img-preview'
		let previewToShow 	= document.getElementById(previewIdToShow);
		previewToShow.style.display = 'initial'
		// --- hide  preview --- 
		let previewIdToHide = typeOfFile == 'video' ? 'img-preview' : 'video-preview' 
		let previewToHide = document.getElementById(previewIdToHide);
		previewToHide.style.display = 'none'

		let previewElement 	= typeOfFile == 'video' ? 'video-preview-source' : 'img-preview'
		preview(file, document.getElementById(previewElement));
		if (typeOfFile == 'video') previewToShow.load();


		//readFile(this,'img-preview');
		//readFile(this,'video-preview-surce');
	}
	console.log('postNotification>>', postNotification);
	console.log('close-notification >> ' ,closeNotification)
	closeNotification.onclick= function () {
		console.log(postNotification)
		postNotification.style.display ="none";
	}

})();