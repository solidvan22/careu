class Post{
    constructor(postData){
        this.id = postData._id;
        this.publisherUserId = postData.publisherUserId;
        this.publisherUserName = postData.publisherUserName;
        this.publisherUserProfilePicture = `users/${this.publisherUserId}/profilepicture`;
		this.text = postData.text;
		this.contentType = postData.contentType;
        this.section = postData.section;
        this.dateTime = moment(postData.dateTime);
        this.dateToShow = this.dateTime.calendar();
        this.likesCount = postData.likesCount;
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
								<span>${this.likesCount}</span>
							</a>
							<div class="comments-shared">
								<a href="#" class="post-add-icon inline-items">	
								</a>
								<a href="#" class="post-add-icon inline-items">	
								</a>
							</div>
						</div>
						<div class="control-block-button post-control-button">

							<a href="#" class="btn btn-control">
								<svg class="olymp-like-post-icon">
									<use xlink:href="#olymp-like-post-icon"></use>
								</svg>
							</a>
						</div>
					</article>`
	}
	videoContent(){
		return `
			<div class="post-video">
				<div class="video-thumb">
					<img src="img/video-youtube1.jpg" alt="photo">
					<a href="https://youtube.com/watch?v=excVFQ2TWig" class="play-video">
						<svg class="olymp-play-icon">
							<use xlink:href="#olymp-play-icon"></use>
						</svg>
					</a>
				</div>
				<div class="video-content">
					<a href="#" class="h4 title">Iron Maid - ChillGroves</a>
					<p>Lorem ipsum dolor sit amet, consectetur ipisicing elit, sed do eiusmod tempor
						incididunt
						ut labore et dolore magna aliqua...
					</p>
					<a href="#" class="link-site">YOUTUBE.COM</a>
				</div>
			</div>
		`
	}
	imageContent(){
		return `
			<div class="post-thumb">
				<img src="img/post__thumb1.jpg" alt="photo">
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
        this.uiElement.insertBefore(post.uiElement, this.uiElement.firstChild)
    }
}

function uploadFunction() {
	let input = document.getElementById('input-file');
	let formData = new FormData();
	let textArea = document.getElementById('post-textarea')
	formData.append("postContent", input.files[0]);
	formData.append('publisherUser', 'SERCH');
	formData.append('text', textArea.value);
	formData.append('section', 'self-care');
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

(function main() {
	/** Elements */
	uploadButton = document.getElementById('post-button');
	openPostWindowButton = document.getElementById('open-post-window');
	spanCreatePost = document.getElementById('span-create-post');
	modalWindowContainer = document.getElementById('modalWindow-container');
	cancelButton = document.getElementById('cancel-button');

	feed = new Feed(document.getElementById('newsfeed-items-grid'))

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

})();




