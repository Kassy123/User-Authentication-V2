/**keystrokes and password*/
var dynamic_keydown = [];
var dynamic_keyup = [];
var paste=0;
var keyStrokePassword = "";

/** var to safe keystroke times */ 
var personal_fast_keydown = [];
var personal_fast_keyup = [];
var personal_slow_keydown = [];
var personal_slow_keyup = [];

/**calculate keystroke dynamics*/
var personal_keydown_keydown_time = [];
var personal_hold_time = [];
var personal_keyup_keydown_time = [];
var slow_keydown_keydown_time = [];
var slow_hold_time = [];
var slow_keyup_keydown_time = [];

var personal_hold_time_average = 0;
var personal_hold_time_sum = 0;
var personal_keydown_keydown_time_sum = 0;
var personal_keydown_keydown_time_average = 0;
var personal_keyup_keydown_time_average = 0;
var personal_keyup_keydown_time_sum = 0;

var slow_hold_time_average = 0;
var slow_hold_time_sum = 0;
var slow_keydown_keydown_time_sum = 0;
var slow_keydown_keydown_time_average = 0;
var slow_keyup_keydown_time_average = 0;
var slow_keyup_keydown_time_sum = 0;

var hold_time_average= 0;
var keydown_keydown_time_average =0;
var keyup_keydown_time_average=0;

/**password entry keystrokes*/
var password_safety = [];
var keystroke_safety = 0;
var keyCode = "";
var password_length=0;

/**alert text*/
var firstText = "";
var secondText ="";
var headtext ="";

/** keystroke stop after wait */
var waitTime = 0;

/**password input field */
var missingFields = 0;
var waitvalue =0;

/**diary*/
var showDiary = 0;


 /** Different browsers */
window.browser = (function() {
    return window.msBrowser || window.browser || chrome;
  })();


  window.browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {  

    /**get keystrokes from Localstorage*/
    if(message.message==="sendAverageValues"){
        waitvalue=1;
        personal_hold_time_average=message.personal_hold_time_average;
        slow_hold_time_average=message.slow_hold_time_average;
        personal_keydown_keydown_time_average=message.personal_keydown_keydown_time_average;
        slow_keydown_keydown_time_average=message.slow_keydown_keydown_time_average;
        personal_keyup_keydown_time_average=message.personal_keyup_keydown_time_average;
        slow_keyup_keydown_time_average=message.slow_keyup_keydown_time_average;
    }
    
    /**show Diary for plugin evaluation*/
    if(message.message === "showDiary"){
        showDiary = 1;
        fetch(browser.extension.getURL('diary.html'))
        .then(response => response.text())
        .then(data => {
            div = document.createElement('div');
            div.classList.add("diary-div")
            div.innerHTML = data.trim();
            document.body.insertAdjacentElement("beforeend", div);
            let authLogo = document.getElementById("authlogoGray");
            authLogo.src = browser.runtime.getURL("images/authLogoGray.jpg");
            let closeButton = document.getElementById("closeDiary");
            let reactionAnswer;
            closeButton.addEventListener("click", function(){
                showDiary=0;
                div.style.display = "none";
                document.getElementsByClassName("diary-div")[0].style.display="none";
            });
   
            /**safe diary input */
            let submitButton = document.getElementById("submitDiary");
            submitButton.addEventListener("click", function(){
                showDiary=0;
                div.style.display = "none";

                let showedReaction = document.getElementById("reaction");
                reactionAnswer = showedReaction.value

                let relevance1 = document.getElementById("relevance1");
                let relevance2 = document.getElementById("relevance2");
                let relevance3 = document.getElementById("relevance3");
                let relevance4 = document.getElementById("relevance4");
                let relevance5 = document.getElementById("relevance5");
                let relevance6 = document.getElementById("relevance6");
                let relevance7 = document.getElementById("relevance7");

                let concern1 = document.getElementById("concern1");
                let concern2 = document.getElementById("concern2");
                let concern3 = document.getElementById("concern3");
                let concern4 = document.getElementById("concern4");
                let concern5 = document.getElementById("concern5");
                let concern6 = document.getElementById("concern6");
                let concern7 = document.getElementById("concern7");

                let attention1 = document.getElementById("attention1");
                let attention2 = document.getElementById("attention2");
                let attention3 = document.getElementById("attention3");
                let attention4 = document.getElementById("attention4");
                let attention5 = document.getElementById("attention5");
                let attention6 = document.getElementById("attention6");
                let attention7 = document.getElementById("attention7");
                
                let privacyRelevance = 0;
                if(relevance1.checked){ 
                    privacyRelevance = relevance1.value;
                } else if(relevance2.checked){
                    privacyRelevance = relevance2.value;
                } else if(relevance3.checked){
                    privacyRelevance = relevance3.value;
                } else if(relevance4.checked){
                    privacyRelevance = relevance4.value;
                } else if(relevance5.checked){
                    privacyRelevance = relevance5.value;
                } else if(relevance6.checked){
                    privacyRelevance = relevance6.value;
                } else if(relevance7.checked){
                    privacyRelevance = relevance7.value;
                }

                let privacyConcern = 0;
                if(concern1.checked){
                    privacyConcern = concern1.value;
                } else if(concern2.checked){
                    privacyConcern = concern2.value;
                }else if(concern3.checked){
                    privacyConcern = concern3.value;
                }else if(concern4.checked){
                    privacyConcern = concern4.value;
                }else if(concern5.checked){
                    privacyConcern = concern5.value;
                }else if(concern6.checked){
                    privacyConcern = concern6.value;
                }else if(concern7.checked){
                    privacyConcern = concern7.value;
                }

                let privacyAttention = 0;
                if(attention1.checked){
                    privacyAttention = attention1.value;
                } else if(attention2.checked){
                    privacyAttention = attention2.value;
                }else if(attention3.checked){
                    privacyAttention = attention3.value;
                }else if(attention4.checked){
                    privacyAttention = attention4.value;
                }else if(attention5.checked){
                    privacyAttention = attention5.value;
                }else if(attention6.checked){
                    privacyAttention = attention6.value;
                }else if(attention7.checked){
                    privacyAttention = attention7.value;
                }
                sendDiaryToBackground(privacyRelevance, privacyConcern, privacyAttention, reactionAnswer);
            });

        }).catch(err => {
            // handle error
        });
    };

    /**Alert request from background.js*/
    if(message.message ==="mainCondition"){
        headtext= message.headtext;
        firstText=message.firstText;
        secondText=message.secondText;
        if(headtext != "" && firstText !="" && headtext != undefined && firstText !=undefined && secondText!=undefined && secondText!=""){
            alertText(headtext, firstText, secondText);
            headtext="";
            firstText="";
            secondText="";
        }
    }
    return true;
});

/** detect fast and slow keystrokes of user */ 
safeKeystroke();
function safeKeystroke(){
    passwordInput();
    var myTimeout3 = setTimeout(function(){
        if(waitvalue===1){
            if(missingFields==0){
                clearTimeout(myTimeout3); 
                
                /** check if user safed the fast keystroke dynamics */
                if(personal_keydown_keydown_time_average == null || personal_keyup_keydown_time_average == null || personal_hold_time_average == null || personal_keydown_keydown_time_average == 0 || personal_keyup_keydown_time_average == 0 || personal_hold_time_average == 0){
                    missingAverageKeystrokesFast();
                }
                if(slow_hold_time_average == 0 || slow_keydown_keydown_time_average == 0 || slow_keyup_keydown_time_average == 0|| slow_hold_time_average == null || slow_keydown_keydown_time_average == null || slow_keyup_keydown_time_average == null){
                    missingAverageKeystrokesSlow();
                }
            }
        }
    },1000);
    var myTimeoutsafe = setTimeout(function(){
    if (document.readyState === "complete") {
        clearTimeout(myTimeoutsafe); 
        if(document.querySelectorAll("[type='submit']")){
            if(document.querySelectorAll("[type='submit']").length == 1){
                document.querySelectorAll("[type='submit']").onclick = function (){                   
                }
            }
            for(var i = 0; i<document.querySelectorAll("[type='submit']").length;i++){
                document.querySelectorAll("[type='submit']")[i].addEventListener('click', function() {                    
                        controlSafety();  
                    });
                }
            }
        }
        else{
            errorMessage("No submit button")
        }
    },1000);

    /**check popuptext from localstorage*/
    window.browser.runtime.sendMessage({
        message:"checkPopup",
    },
    function(response){ 
        if(response != undefined){
            headtext=response.headtext;
            firstText=response.firstText;
            secondText=response.secondText;
            if(headtext!=0 && headtext!=undefined && firstText!=undefined && secondText!=undefined && firstText!=0 && secondText!=0){
                alertText(headtext, firstText, secondText);
            }
            
        }
        else{
            errorMessage("No submit button")
        }
    });

    
    
};



/** send input of diary to localstorage */
function sendDiaryToBackground(privacyRelevance, privacyConcern, privacyAttention, reactionAnswer){
    window.browser.runtime.sendMessage({
        message:"diaryContent",
        privacyRelevance:privacyRelevance,
        privacyConcern:privacyConcern,
        privacyAttention:privacyAttention,
        reactionAnswer:reactionAnswer,
    });
}

/**send message with password, password length and keystrokes to background.js */
function controlSafety(){    
    var passwordfieldValue = document.querySelectorAll("input[type='password']")
    var myTimeoutsafe2 = setTimeout(function(){
        if(passwordfieldValue[0].value != ""){
            keyStrokePassword=passwordfieldValue[0].value;
            for(var i =0; i<document.querySelector("input[type='password']").value.length;i++){
                password_length= password_length+1;
            }
            clearTimeout(myTimeoutsafe2); 
        }
    },1000);
    
    window.browser.runtime.sendMessage({
        message:"contentButtonclick",
        password_safety: password_safety,
        keyStrokePassword: keyStrokePassword,
        dynamic_keydown:dynamic_keydown,
        dynamic_keyup:dynamic_keyup,
        password_length:password_length,
    },
    function(response){
        hold_time_average=response.hold_time_average;
        keydown_keydown_time_average=response.keydown_keydown_time_average;
        keyup_keydown_time_average=response.keyup_keydown_time_average;
        firstText = response.firstText;
        secondText= response.secondText;
        if(firstText != ""){
            firstText="";
        }
        compareKeystrokeTime();
        password_length = 0;
    });
}

/**get the keystrokes of password input*/
function passwordInput(){
    for(var j = 0; j< document.querySelectorAll("a").length;j++){
        document.querySelectorAll("a")[j].addEventListener("mousedown", (e) =>{
            safeKeystroke();
        })
    }
    var myTimeoutsafe = setTimeout(function(){
        if(document.readyState == "complete"){  
            clearTimeout(myTimeoutsafe); 
            if(document.querySelector("input[type='password']") != null){
                /** get keyup in password field */
                document.querySelector("input[type='password']").addEventListener("keyup", (e) =>{
                    if(e.type === "keyup"){
                        if((e.keyCode >=48 && e.keyCode<= 57 && e.shiftKey) || (e.keyCode >=48 && e.keyCode<= 57 && !e.shiftKey) || (e.keyCode >= 65 && e.keyCode <= 90 && e.shiftKey) || (e.keyCode >= 65 && e.keyCode <= 90 && !e.shiftKey) || (e.keyCode >= 96 && e.keyCode <= 122)){
                            dynamic_keyup.push(e.timeStamp);
                        }
                        else if (paste==1){
                            dynamic_keyup = [];
                        }
                        else if(e.keyCode == 8){
                        }
                        waitTime = 0;
                    }
                }); 
            }
            else{
                missingFields = 1;
            }

            /** get keydown in password field */
            if(document.querySelector("input[type='password']")){
                if(document.querySelector("input[type='password']").value !=  ""){                
                    keyStrokePassword = document.querySelector("input[type='password']").value;
                }
                  
                /** get keydown keystroke in password field */
                document.querySelector("input[type='password']").addEventListener("keydown", (e) =>{ 
                    if(e.key === "Enter"){
                        controlSafety();
                    }
                    /** track keystroke entry */
                    if(e.type === "keydown"){
                        if(e.keyCode >=48 && e.keyCode<= 57 && e.shiftKey || e.keyCode >=48 && e.keyCode<= 57 && e.keyCode==16 || e.keyCode >= 187 && e.keyCode <= 191 || e.keyCode == 220 || e.keyCode == 221){
                            dynamic_keydown.push(e.timeStamp);
                            keyStrokePassword = keyStrokePassword + e.key;
                            characterTypes("symbol");
                        }else if (e.keyCode == 86 && e.ctrlKey){
                            paste =1;
                            document.querySelector("input[type='password']").addEventListener('paste', function(){
                                setTimeout(function(){
                                    keyStrokePassword = document.querySelector("input[type='password']").value;
                                    dynamic_keydown = [];
                                    dynamic_keyup=[];
                                    for(var b =0; b<document.querySelector("input[type='password']").value.length;b++){
                                    }  
                                })
                            }) 
                            
                        }
                        else if(e.keyCode == 8){
                            keyStrokePassword = document.querySelector("input[type='password']").value;
                            keyStrokePassword = keyStrokePassword.slice(0, -1); 
                            password_length=0;
                        }
                        else if(e.keyCode >=48 && e.keyCode<= 57 && !e.shiftKey ||e.keyCode >=48 && e.keyCode<= 57 && e.keyCode!=16){
                            dynamic_keydown.push(e.timeStamp);
                            keyStrokePassword = keyStrokePassword + e.key;
                            characterTypes("number");
                        }else if (e.keyCode >= 65 && e.keyCode <= 90 && e.shiftKey || e.keyCode >= 65 && e.keyCode <= 90 && e.keyCode==16) {
                            dynamic_keydown.push(e.timeStamp);
                            keyStrokePassword = keyStrokePassword + e.key;
                            characterTypes("uppercase");
                        }else if (e.keyCode >= 65 && e.keyCode <= 90 && !e.shiftKey || e.keyCode >= 65 && e.keyCode <= 90 && e.keyCode!=16) {
                            dynamic_keydown.push(e.timeStamp);
                            keyStrokePassword = keyStrokePassword + e.key;                            
                            characterTypes("lowercase");
                        }else if (e.keyCode >= 96 && e.keyCode <= 122) {
                            dynamic_keydown.push(e.timeStamp);
                            keyStrokePassword = keyStrokePassword + e.key;
                            characterTypes("num board");
                        }
                        waitTime = 0;
                    }
                });
            }
            else{
                missingFields = 1;
            }
        }
    },1000);
}

/**check if password has all character types */
function characterTypes(character){
    if(password_safety.length==0){
        password_safety.push(character);
    }
    else{
        var i =0;
        while(i<password_safety.length){
            if(password_safety[i]==character){
                i=1000;
            }
            else{i++}
        }
        if(i==password_safety.length){
            password_safety.push(character);
        }
    }
};

/**get missing average fast keystrokes from popup */
function missingAverageKeystrokesFast(){
    fetch(browser.extension.getURL('popup.html'))
    .then(response => response.text())
    .then(data => {
        div = document.createElement('div');
        div.innerHTML = data.trim();
        document.body.insertAdjacentElement("beforeend", div);
        //let inputAreaFast = document.getElementById("inputfast");
        //let textInputFast = inputAreaFast.value;
        //let inputAreaSlow = document.getElementById("inputslow");
        //let textInputSlow = inputAreaSlow.value;
        let authLogo = document.getElementById("logo-icon");
        authLogo.src = browser.runtime.getURL("images/authLogoGray.jpg");
        
    }).catch(err => {
        errorMessage("No fetch of popup.html")
    });
    
    /**check if popup modal available*/
    var myTimeout = setTimeout(function(){
        if(document.readyState == "complete"){ 
            if(document.getElementsByClassName("popup-modal")){
                clearTimeout(myTimeout);
                if(document.getElementById("inputfast") != null){
                    
                    /** keydown on slow input field */
                    document.getElementById("inputfast").addEventListener('keydown', (e) =>{
                        if(e.shiftKey && e.key=="Shift"){
                            /**no timeStamp needed */
                        }
                        else if(e.key=="Enter"){
                            calculateFastKeystroke();
                        }
                        else{
                            if(e.type === "keydown"){
                                personal_fast_keydown.push(e.timeStamp);
                            }
                        }
                    })

                    /** keyup on slow input field */
                    document.getElementById("inputfast").addEventListener('keyup', (e) =>{
                        if(e.key=="Shift"){
                            /**no timeStamp needed */                        
                        }
                        else{
                            if(e.type === "keyup"){
                                personal_fast_keyup.push(e.timeStamp);
                            }
                        }
                    })
                }

                /** show text for fast keystroke */
                if(document.getElementById("button-fast") != null){
                    document.getElementById("button-fast").onclick = function (){
                        calculateFastKeystroke();
                    }
                }
            }    
        }
    },1000);
};

function calculateFastKeystroke(){

    /** calculate hold time of key - dwell time*/
    for(let i = 0; i<personal_fast_keydown.length; i++){
        personal_hold_time.push(personal_fast_keyup[i]-personal_fast_keydown[i]);
    }
    /** calculate time between two keydown - typing speed*/
    for(var j = 0; j<personal_fast_keydown.length-1; j++){
        personal_keydown_keydown_time.push(personal_fast_keydown[j+1]-personal_fast_keydown[j]);
    }
    /** calculate time between two keystrokes - transition time */
    for(var a=0; a<personal_fast_keydown.length-1;a++){
        personal_keyup_keydown_time.push(personal_fast_keydown[a+1]-personal_fast_keyup[a]);
    }

    /** calculate the sum and average of time between keydown and keyup */
    if(personal_hold_time.length>0){
        for(var b=0; b<personal_hold_time.length;b++){
            personal_hold_time_sum += personal_hold_time[b];
            if(b == personal_hold_time.length-1){
                personal_hold_time_average = personal_hold_time_sum/personal_hold_time.length;
            }
        }
    }
    /** calculate the sum and average of time between two keydown */
    if(personal_keydown_keydown_time.length>0){
        for(var c=0; c<personal_keydown_keydown_time.length;c++){
            personal_keydown_keydown_time_sum += personal_keydown_keydown_time[c];
            if(c == personal_keydown_keydown_time.length-1){
                personal_keydown_keydown_time_average = personal_keydown_keydown_time_sum/personal_keydown_keydown_time.length;
            }
        }
    }
    /** calculate the sum and average of time between keyup and keydown */
    if(personal_keyup_keydown_time.length>0){
        for(var d=0; d<personal_keyup_keydown_time.length;d++){
            personal_keyup_keydown_time_sum += personal_keyup_keydown_time[d];
            if(d == personal_keyup_keydown_time.length-1){
                personal_keyup_keydown_time_average = personal_keyup_keydown_time_sum/personal_keyup_keydown_time.length;
            }
        }
    }
    /** check if average keystroke time ist tracked */
    if(personal_keyup_keydown_time_average !==0 && personal_keydown_keydown_time_average !==0 && personal_hold_time_average !==0){
        var newTimeout2 = setTimeout(function(){
            if(document.readyState == "complete"){   
                clearTimeout(newTimeout2); 
                window.browser.runtime.sendMessage({ 
                    message: "averageValuesFast",
                    personal_keyup_keydown_time_average:personal_keyup_keydown_time_average,
                    personal_keydown_keydown_time_average:personal_keydown_keydown_time_average,
                    personal_hold_time_average:personal_hold_time_average,
                });
                personal_keyup_keydown_time_average =0;
                personal_keydown_keydown_time_average=0;
                personal_hold_time_average=0;
            }
        });
    }

    /** change explanation text of input field */
    document.getElementById("inputfast").style.display="none";
    document.getElementById("button-fast").style.display="none";
    document.getElementById("first-text").style.display="none";
    document.getElementById("inputslow").style.display="block";
    document.getElementById("button-slow").style.display="block";
    document.getElementById("second-text").style.display="block";
    document.getElementById("second-text-sentence").style.display="block";
}

/**get missing average slow keystrokes from popup */
function missingAverageKeystrokesSlow(){
    var mynewTimeout = setTimeout(function(){
        if(document.readyState == "complete"){ 
            if(document.getElementsByClassName("popup-modal")){
                clearTimeout(mynewTimeout);
                if(document.getElementById("inputslow") != null){

                    /** keydown on slow input field */
                    document.getElementById("inputslow").addEventListener('keydown', (e) =>{
                        if(e.shiftKey && e.key=="Shift"){
                            /**no timeStamp needed */
                        }
                        else if(e.key=="Enter"){
                            calculateSlowKeystroke();
                        }
                        else{
                            if(e.type === "keydown"){
                                personal_slow_keydown.push(e.timeStamp);
                            }
                        } 
                    })

                    /** keyup on slow input field */
                    document.getElementById("inputslow").addEventListener('keyup', (e) =>{
                        if(e.key=="Shift"){
                            /**no timeStamp needed */                        
                        }
                        else{
                            if(e.type === "keyup"){
                                personal_slow_keyup.push(e.timeStamp);
                            }
                        }
                    })
                }

                /** show text for slow keystroke */
                if(document.getElementById("button-slow") != null){
                    document.getElementById("button-slow").onclick = function (){
                        calculateSlowKeystroke();
                    }
                }
            }
        }
    },1000);
};

function calculateSlowKeystroke(){

    /** calculate hold time of key */
    for(let i = 0; i<personal_slow_keydown.length; i++){
        slow_hold_time.push(personal_slow_keyup[i]-personal_slow_keydown[i]);
    }

    /** calculate time between two keydown */
    for(var j = 0; j<personal_slow_keydown.length-1; j++){
        slow_keydown_keydown_time.push(personal_slow_keydown[j+1]-personal_slow_keydown[j]);
    }

    /** calculate time between two keystrokes */
    for(var a=0; a<personal_slow_keydown.length-1;a++){
        slow_keyup_keydown_time.push(personal_slow_keydown[a+1]-personal_slow_keyup[a]);
    }

    /** calculate the sum and average of time between keydown and keyup */
    if(slow_hold_time.length>0){
        for(var b=0; b<slow_hold_time.length;b++){
            slow_hold_time_sum += slow_hold_time[b];
            if(b == slow_hold_time.length-1){
                slow_hold_time_average = slow_hold_time_sum/slow_hold_time.length;
            }
        }
    }

    /** calculate the sum and average of time between two keydown */
    if(slow_keydown_keydown_time.length>0){
        for(var c=0; c<slow_keydown_keydown_time.length;c++){
            slow_keydown_keydown_time_sum += slow_keydown_keydown_time[c];
            if(c == slow_keydown_keydown_time.length-1){
                slow_keydown_keydown_time_average = slow_keydown_keydown_time_sum/slow_keydown_keydown_time.length;
            }
        }
    }

    /** calculate the sum and average of time between keyup and keydown */
    if(slow_keyup_keydown_time.length>0){
        for(var d=0; d<slow_keyup_keydown_time.length;d++){
            slow_keyup_keydown_time_sum += slow_keyup_keydown_time[d];
            if(d == slow_keyup_keydown_time.length-1){
                slow_keyup_keydown_time_average = slow_keyup_keydown_time_sum/slow_keyup_keydown_time.length;
            }
        }
    }

    /** check if average keystroke time ist tracked */
    if(slow_keyup_keydown_time_average !==0 && slow_keydown_keydown_time_average !==0 && slow_hold_time_average !==0){
        var newTimeout = setTimeout(function(){
            if(document.readyState == "complete"){   
                clearTimeout(newTimeout); 
                window.browser.runtime.sendMessage({ 
                    message: "averageValuesSlow",
                    slow_keyup_keydown_time_average:slow_keyup_keydown_time_average,
                    slow_keydown_keydown_time_average:slow_keydown_keydown_time_average,
                    slow_hold_time_average:slow_hold_time_average,
                });
                slow_keyup_keydown_time_average=0;
                slow_keydown_keydown_time_average=0;
                slow_hold_time_average=0;
            }
        });
    }

    /** sefed keystroke dynamics info */
    document.getElementById("inputslow").style.display="none";
    document.getElementById("button-slow").style.display="none";
    document.getElementById("second-text").style.display="none";
    document.getElementById("second-text-sentence").style.display="none";
    document.getElementById("popup-modal").style.display="none";
}

 /** Comparison of stored keystrokes with keystrokes of the password */
function compareKeystrokeTime(){
    if(personal_hold_time_average!==0){
        if(slow_hold_time_average!==0){
            if(hold_time_average<slow_hold_time_average && hold_time_average!= 0){
                if(personal_hold_time_average>hold_time_average){
                    keystroke_safety=keystroke_safety+1;
                }
                else if(personal_hold_time_average<hold_time_average && personal_hold_time_average>=hold_time_average-50.00){
                    keystroke_safety=keystroke_safety+1;
                } 
            }
        }
    }
    
    /** time between two keydown has to be bigger than fast average */
    if(personal_keydown_keydown_time_average!==0 && slow_keydown_keydown_time_average!==0){
        if(keydown_keydown_time_average<slow_keydown_keydown_time_average && keydown_keydown_time_average != 0){
            if(personal_keydown_keydown_time_average>keydown_keydown_time_average){
                keystroke_safety=keystroke_safety+1;
            }
            else if(personal_keydown_keydown_time_average<keydown_keydown_time_average && personal_keydown_keydown_time_average>=keydown_keydown_time_average-50.00){
                keystroke_safety=keystroke_safety+1;
            } 
        }
    }

    /** time between keyup and next keydown has to be bigger than fast average */
    if(personal_keyup_keydown_time_average !==0 && slow_keyup_keydown_time_average !=0){
        if(keyup_keydown_time_average<slow_keyup_keydown_time_average && keyup_keydown_time_average !=0){
            if(personal_keyup_keydown_time_average>keyup_keydown_time_average){
                keystroke_safety=keystroke_safety+1;
                isFastKeystroke()
            }
            else if(personal_keyup_keydown_time_average<keyup_keydown_time_average && personal_keyup_keydown_time_average>=keyup_keydown_time_average-50.00){
                keystroke_safety=keystroke_safety+1;
                isFastKeystroke()
            }
            else{
                isFastKeystroke()
            }
        }
        else{
            isFastKeystroke()
        }
    }
}

/**check if keystroke is fast */
function isFastKeystroke(){
    if(keystroke_safety >=2){
        if(paste == 0){
            var newTimeout = setTimeout(function(){
                if(document.readyState == "complete"){
                    clearTimeout(newTimeout); 
                    window.browser.runtime.sendMessage({ 
                        message: "fastKeystroke",
                    });
                }
            });
            keystroke_safety=0;
            paste =0;
        }
    }
}

/** send Alert text to background.js and from there to implication.js */
function alertText(headtext, firstText, secondText){
    var myTimeoutsafe = setTimeout(function(){
        if (document.readyState === "complete") {
            clearTimeout(myTimeoutsafe);  
            if(showDiary==0){
                if(headtext!=undefined && firstText!=undefined && secondText!=undefined){
                    window.browser.runtime.sendMessage({
                        from:"content",
                        headtext: headtext,
                        firstText: firstText,
                        secondText: secondText,
                    });
                }
            }
        }    
    },1000);            
}

/**error message */
function errorMessage(text){
    console.log(text)
}

