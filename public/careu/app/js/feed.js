(function main() {
	/** Elements */
	uploadButton = document.getElementById('post-button');
	openPostWindowButton = document.getElementById('open-post-window');
	spanCreatePost = document.getElementById('span-create-post');
	modalWindowContainer = document.getElementById('modalWindow-container');
	cancelButton = document.getElementById('cancel-button');

	feed = new Feed(document.getElementById('newsfeed-items-grid'))
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

	uploadButton.onclick = function () {
		uploadFunction();
	}

})();