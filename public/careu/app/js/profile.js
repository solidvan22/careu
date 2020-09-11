(function main() {
    /** Elements */

    console.log('Session user id' , session.userId)
    let userId = session.userId
    feed = new Feed(document.getElementById('newsfeed-items-grid'))
    feed.loadPosts({publisherUserId: userId})
    
})();