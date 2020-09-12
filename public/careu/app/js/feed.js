
function readFile(input,previewImgId) {
	let filePreview = document.getElementById(previewImgId)

	let divPreview = document.getElementById('div-preview')
	if (input.files && input.files[0]) {
		//divPreview.style.display = 'flex';
		filePreview.style.display = 'flex';
		var reader = new FileReader();
		reader.onload = function (e) {
			console.log('LOADING PROFILE PICTURE >>>', e.target.result)
			filePreview.setAttribute('src', e.target.result)
			//$('#').attr('src', e.target.result);
		}
		reader.readAsDataURL(input.files[0]); // convert to base64 string
	}
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
	
	selectFileBtn.onclick = () => inputFile.click();



	feed = new Feed(document.getElementById('newsfeed-items-grid'))
	console.log('CATEGORY>>>>', category);
	feed.loadPosts({category})

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

	uploadButton.onclick = function () {
		uploadFunction();
	}
	inputFile.onchange = function () {
		console.log('FILE CHANGE ', this);
		readFile(this,'img-preview');
	}

})();