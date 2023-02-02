/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Escape function to prevent XSS
const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Create a tweet
const createTweetElement = function(tweet) {
  const $tweet = $(
    `<article class="tweet">
      <header>
        <div class="image-name">
          <img src="${tweet.user.avatars}">
          <p>${tweet.user.name}</p>
        </div>
        <p class="handle">${tweet.user.handle}</p>
      </header>
      <p class="tweet-text">${escape(tweet.content.text)}</p>
      <hr>
      <footer>
        <p>${timeago.format(tweet.created_at)}</p>
        <div class="icons" style="color: blue">
          <i class="fa-solid fa-flag fa-2xs"></i>
          <i class="fa-solid fa-retweet fa-2xs"></i>
          <i class="fa-solid fa-heart fa-2xs"></i>
        </div>
      </footer>
    </article>`
  );

  return $tweet;
};

// Render tweets
const renderTweets = function(tweets) {
  tweets.forEach(tweet => {
    const $tweet = createTweetElement(tweet);
    $("#tweets-container").prepend($tweet);
  });
};

// Load all tweets
const loadTweets = function(callback) {
  $.get("/tweets")
    .then((tweets) => callback(tweets));
}(renderTweets);

// Load last tweet
const loadLastTweet = function(callback) {
  $.get("/tweets")
    .then((tweets) => {
      callback([tweets[tweets.length - 1]]);
    });
};

$(document).ready(() => {
  $("#tweet-form").submit(function(event) {
    event.preventDefault();
    const data = $(this).serialize();
    
    $("p.error").slideUp("slow", function() {
      if (decodeURI(data.split("=")[1]).length > 140) {
        $("p.error").html("Tweet too long");
        $("p.error").slideDown("slow");
      } else if (data.split("=")[1]) {
        $.ajax({
          method: "POST",
          url: "/tweets",
          data: data,
          statusCode: {
            201: function() {
              event.target.reset();
              loadLastTweet(renderTweets);
            }
          }
        });
      } else {
        $("p.error").html("Empty tweet");
        $("p.error").slideDown("slow");
      }
    });
  });
});