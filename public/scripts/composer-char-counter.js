$(document).ready(function() {
  // --- our code goes here ---
  const textarea = document.querySelector("#tweet-text");
  
  textarea.addEventListener("input", function() {
    const length = $(this).val().length;
    const counter = this.parentElement.querySelector(".counter");
    
    $(counter).val(140 - length);
    
    if (length > 140) {
      $(counter).addClass("red");
    } else {
      $(counter).removeClass("red");
    }
  });
});
