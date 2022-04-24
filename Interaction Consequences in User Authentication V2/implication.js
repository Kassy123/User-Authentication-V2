/** variables receiving message  */
var headingText;
var implicationText;


/** Different browsers */
window.browser = (function() {
  return window.msBrowser || window.browser || chrome;
})();

/** send message to background page and get message from background page */
window.browser.runtime.sendMessage({from:"implication"}); //first, tell the background page that this is the tab that wants to receive the messages.
window.browser.runtime.onMessage.addListener(function(msg) {
  if (msg.from == "background") {  
    headingText = msg.headtext;
    bodyText = msg.firstText;
    implicationText = msg.secondText;
    let websiteBody = document.querySelector("body");
    if(websiteBody !== null){
      fetch(browser.extension.getURL('implicationPopup.html'))
      .then(response => response.text())
      .then(data => {
          div = document.createElement('div');
          div.classList.add("modal-div")
          div.innerHTML = data.trim();
          document.body.insertAdjacentElement("afterbegin", div);
          let logo = document.getElementById("authlogo");
          logo.src = browser.runtime.getURL("images/authLogo.jpg");
          let implicationHeading = document.getElementById("implication-heading");
          implicationHeading.innerHTML = headingText;
          let warninglogo = document.getElementById("warninglogo");
          warninglogo.src = browser.runtime.getURL("images/warning.jpg");
          let implicationPopupText = document.getElementById("implication-popup-text");
          implicationPopupText.innerHTML = bodyText;
          let secondImplicationPopupText = document.getElementById("second-implication-popup-text");
          secondImplicationPopupText.innerHTML = implicationText;

            /**close popup alert with "I understand"-Button */
          if(document.readyState == "complete"){ 
            if(document.getElementById("ok-button") != null){
              document.getElementById("ok-button").onclick = function (){
                for(var j=0; j<document.getElementsByClassName("modal-div").length;j++){
                  document.getElementsByClassName("modal-div")[j].style.display="none";
                }
                window.browser.runtime.sendMessage({from:"implicationclear", hideImplication:1});
              }
            }
          }
      }).catch(err => {
          // handle error
      });
    }
  }

  /**close popup alert with "I understand"-Button */
  if(document.readyState == "complete"){ 
    if(document.getElementById("ok-button") != null){
      document.getElementById("ok-button").onclick = function (){
        for(var j=0; j<document.getElementsByClassName("modal-div").length;j++){
          document.getElementsByClassName("modal-div")[j].style.display="none";
        }
        window.browser.runtime.sendMessage({from:"implicationclear", hideImplication:1});
      }
    }
  }
});
