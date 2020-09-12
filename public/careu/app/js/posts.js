class Post{
    constructor(postData){
        this.id = postData._id;
        this.publisherUserId = postData.publisherUserId;
        this.publisherUserName = postData.publisherUserName;
        this.publisherUserProfilePicture = `users/${this.publisherUserId}/profilepicture`;
		this.text = largeWords(postData.text);
		this.contentType = postData.contentType;
        this.section = postData.section;
        this.dateTime = moment(postData.dateTime);
        this.dateToShow = this.dateTime.calendar();
		this.likesCount = postData.likesCount ? postData.likesCount : 0 ;
        this.contentFileName = postData.contentFileName
        this.uiElement = document.createElement('div');
        this.uiElement.className = 'ui-block';
        this.uiElement.innerHTML = `
            <article class="hentry post">
						<div class="post__author author vcard inline-items">
							<img src="${this.publisherUserProfilePicture}" alt="author">
							<div class="author-date">
								<a class="h6 post__author-name fn" href="#">${this.publisherUserName}</a> 
								<div class="post__date">
									<time class="published"> ${this.dateToShow} </time>
								</div>
							</div>
						</div>
						<p>${this.text}</p>
						${this.generateContent()}
						<div class="post-additional-info inline-items">
							<a href="#" class="post-add-icon inline-items">
								<svg class="olymp-heart-icon">
									<use xlink:href="#olymp-heart-icon"></use>
								</svg>
								<span id='${this.id}-likesCount'>${this.likesCount}</span>
							</a>
							<div class="comments-shared">
								<a href="#" class="post-add-icon inline-items">	
								</a>
								<a href="#" class="post-add-icon inline-items">	
								</a>
							</div>
						</div>
						<div class="control-block-button post-control-button">

							<a id='${this.id}-likeButton'  class="btn btn-control">
								<svg class="olymp-like-post-icon">
									<use xlink:href="#olymp-like-post-icon"></use>
								</svg>
							</a>
						</div>
			</article>
		`
		
	}
	insertBefore(uiElementContainer){
		uiElementContainer.insertBefore(this.uiElement, uiElementContainer.firstChild);
		this.likeButtton = document.getElementById(`${this.id}-likeButton`);
		this.likesCountElement = document.getElementById(`${this.id}-likesCount`);
		console.log(`${this.id}-likesCount`, '>>', this.likesCountElement);
		let thisPost = this;
		this.likeButtton.onclick = async function(){
			let likeResult = await apiPostLike(thisPost.id);
			if (likeResult.likesCount) thisPost.likesCountElement.innerText = likeResult.likesCount;
			console.log('>>>>>>>> LIKE RESULT >>> ',likeResult);
		}

	}
	videoContent(){
		return `
			<video controls width="100%">
				<source src="http://35.231.29.183:3000/posts/${this.id}/content" type="video/mp4" />
				Sorry, your browser doesn't support embedded videos.
			</video>
		`
	}
	imageContent(){
		return `
			<div class="post-thumb">
				<img src=http://35.231.29.183:3000/posts/${this.id}/content alt="photo">
			</div>
		`
	}
	generateContent(){
		if(this.contentType == 'video') return this.videoContent();
		if(this.contentType == 'image') return this.imageContent();
		else return '';
	}
	
}

class Feed{
    constructor(uiElement){
        this.uiElement = uiElement;
    }
    addPost(post){
		post.insertBefore(this.uiElement);
        //this.uiElement.insertBefore(post.uiElement, this.uiElement.firstChild)
	}
	async like(postId) {
		this.likeButtton = document.getElementById(``)
	}
	async loadPosts(filter){
		let postsArray = await apiGetPosts(filter);
		console.log('POST ARRAY', postsArray)
		let postsCount = 0;
		for (let postData of postsArray){
			postsCount ++;
			this.addPost(new Post(postData))
		}
	}
}

function queryString(filter={}) {
	let result = "?";
	let keys = Object.keys(filter);
	if (keys.length == 0) return '';
	let i = 0;
	for (key of keys) {
		i++
		let value = filter[key]
		if (i > 1) result = result + "&"
		result = result + `${key}=${value}`
	}
	return result;
}
function separateLargeWord(word, maxSize){
	return word.slice(0, maxSize - 1) + "-" + word.slice(maxSize)
}

function largeWords(string) {
	let resultString = ""
	let wordsArray = string.split(' ');
	let maxWordLength = 30;
	let i = 0;
	for (word of wordsArray) {
		i++;
		let isLarge = false;
		_word = word;
		if (word.length > maxWordLength) {
			console.log("separate word >>", i)
			_word = separateLargeWord(word, maxWordLength)
			console.log(_word);
		}
		resultString = resultString + " " + _word
	}
	return resultString;
}

function apiGetPosts(filter){
	return new Promise((resolve,reject) =>{
		let query = queryString(filter)
		let url = "http://35.231.29.183:3000/posts" + query
		console.log('API POST REQUEST >>>' , url)
		jQuery.ajax({
			url: url,
			method: 'GET',
			success: function (data) {
				console.log('POSTS DATA' ,data)
				resolve(data);
			},
			fail: function(error){
				reject(error)
			}
		});
	} )
}
function apiPostLike(postId) {
	return new Promise((resolve, reject) => {
		jQuery.ajax({
			url: `posts/${postId}/likes`,
			cache: false,
			method: 'POST',
			success: function (data) {
				resolve(data);
			},
			fail: function (error) {
				reject(error)
			}
		});
	})
}

function uploadFunction() {
	let input = document.getElementById('input-file');
	let formData = new FormData();
	let category = session.title.toLowerCase()
	let textArea = document.getElementById('post-textarea')
	formData.append("postContent", input.files[0]);
	formData.append('publisherUserId', session.userId);
	formData.append('text', textArea.value);
	formData.append('category', category);
	let url = 'http://35.231.29.183:3000/posts'
	jQuery.ajax({
		url: url,
		data: formData,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			alert(data);
		}
	});

}




