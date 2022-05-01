/**variables for calculated keystroke dynamics*/
var personal_keydown_keydown_time = [];
var personal_hold_time = [];
var personal_keyup_keydown_time = [];

var slow_keydown_keydown_time = [];
var slow_hold_time = [];
var slow_keyup_keydown_time = [];

var personal_hold_time_average = 0;
var personal_keydown_keydown_time_average = 0;
var personal_keyup_keydown_time_average = 0;

var slow_hold_time_average = 0;
var slow_keydown_keydown_time_average = 0;
var slow_keyup_keydown_time_average = 0;

/**var to check the password safety between different URLs*/
var url;
var invocation;
var tabName = "";
var currentURL= "";
var passwordlength_counter = 0;
var passwordLength_website = 0;

/** variables for keystroke dynamics */
var keydown_keydown_time = [];
var hold_time = [];
var keyup_keydown_time = [];

var hold_time_average = 0;
var hold_time_sum = 0;
var keydown_keydown_time_sum = 0;
var keydown_keydown_time_average = 0;
var keyup_keydown_time_average = 0;
var keyup_keydown_time_sum = 0;

/**password entry keystrokes*/
var password_safety = [];
var keyStrokePassword = "";
var password_length =0;

var dynamic_keydown = [];
var dynamic_keyup = [];

var implicationTabId;

/**implication text */
var headtext="";
var firstText="";
var secondText ="";
var implicationCounter = 0;
var firstCheck =0;
var hideImplication = 0;

/**main condition on big websites*/
var localPasswordReuse = 0;
var localPasswordShort = 0;
var localPasswordSafety = 0;
var blockAlert = 0;
var oldTabName = 0;
var oldTabURL = 0;
var localfastkeystrokes = 0; 
var twoFA = 0;

/**diary in localstorage */
var triggerAnswer = "";
var reactionAnswer = "";
var diary = "";
var diaryAnswer = 0;

window.browser = (function() {
    return window.msBrowser || window.browser || chrome;
})();


window.browser.runtime.onMessage.addListener(async function(msg,sender,sendResponse) {

    /**set fast keystrokes of popup to localstorage */
    if(msg.message == "averageValuesFast"){
        personal_keyup_keydown_time_average=msg.personal_keyup_keydown_time_average;
        personal_keydown_keydown_time_average=msg.personal_keydown_keydown_time_average;
        personal_hold_time_average=msg.personal_hold_time_average;
        localStorage.setItem('Average Keydown/up', personal_keyup_keydown_time_average);
        localStorage.setItem('Average Keydown/down', personal_keydown_keydown_time_average);
        localStorage.setItem('Average HoldTime', personal_hold_time_average);                    
    }

    /**set slow keystrokes of popup to localstorage */
    if(msg.message == "averageValuesSlow"){
        slow_keyup_keydown_time_average=msg.slow_keyup_keydown_time_average;
        slow_keydown_keydown_time_average=msg.slow_keydown_keydown_time_average;
        slow_hold_time_average=msg.slow_hold_time_average;
        localStorage.setItem('Average Slow Keydown/up', slow_keyup_keydown_time_average);
        localStorage.setItem('Average Slow Keydown/down', slow_keydown_keydown_time_average);
        localStorage.setItem('Average Slow HoldTime', slow_hold_time_average);         
    }

    /** implication.js is waiting for values */
    if (msg.from == "implication") { 
        implicationTabId = sender.tab.id;
    }

    /**send message from content.js to implication.js */
    if (msg.from == "content" && implicationTabId) {     
        /**get name of the page*/
        for(var a = 0; a<oldTabURL.length; a++){ 
            if(oldTabURL[a] == "/"){
                if(oldTabURL[a+1] == "/"){
                    if(oldTabURL[a+2] == "w"){
                        if(oldTabURL[a+3]== "w"){
                            if(oldTabURL[a+4] == "w"){
                                /**www*/
                                for(var b = 0; b<oldTabURL.length; b++){  
                                    if(oldTabURL[b]=="."){
                                        oldTabName = oldTabURL.split('.')[1];
                                    }
                                }
                            }
                        }
                    }     
                    
                    else if(oldTabURL[a+2] != "w"){ 
                        var sumTabName ="";    
                        for(var c=(a+2); c<oldTabURL.length;c++){
                            sumTabName = sumTabName+oldTabURL[c]
                            if(oldTabURL[c+1] == "."){
                                oldTabName = sumTabName;
                            }
                        }    
                    }
                }
            }
        }
        
        /**check if its a new page */
        if(oldTabName != tabName && firstCheck ==0){
            hideImplication=0;
            mainCondition();
            window.browser.tabs.sendMessage(implicationTabId, {  
                from: "background",
                headtext: msg.headtext,
                firstText: msg.firstText,
                secondText: msg.secondText,
            });
            oldTabURL = currentURL;
            oldTabName = tabName;

            blockAlert=0;   
        }
        else if(oldTabName != tabName && oldTabName ==0){
            oldTabURL = currentURL;
            oldTabName = tabName;
            window.browser.tabs.sendMessage(implicationTabId, {  
                from: "background",
                headtext: msg.headtext,
                firstText: msg.firstText,
                secondText: msg.secondText,
            });
        }
        else if(oldTabURL != currentURL){
            implicationCounter = implicationCounter+1;
            callAlert(headtext, firstText, secondText);
            oldTabURL = currentURL;
            oldTabName = tabName;
            window.browser.tabs.sendMessage(implicationTabId, {  
                from: "background",
                headtext: msg.headtext,
                firstText: msg.firstText,
                secondText: msg.secondText,
            });
        }
        else if(oldTabURL == currentURL){
            if(localStorage.getItem('Localtitle')!="" && localStorage.getItem('LocalFirstText')!="" && localStorage.getItem('LocalSecondText')!="" && localStorage.getItem('Localtitle') && localStorage.getItem('LocalFirstText') && localStorage.getItem('LocalSecondText')){
                window.browser.tabs.sendMessage(implicationTabId, {  
                    from: "background",
                    headtext: msg.headtext,
                    firstText: msg.firstText,
                    secondText: msg.secondText,
                });
            }
        }
    }

    /**get diary content from content.js and set to localstorage */
    if(msg.message == "diaryContent"){
        privacyRelevance = msg.privacyRelevance;
        privacyConcern = msg.privacyConcern;
        privacyAttention= msg.privacyAttention,
        reactionAnswer= msg.reactionAnswer,
    	diary = diary + "; " + privacyRelevance + ", "+ privacyConcern + ", " + privacyAttention + " ," + reactionAnswer;
        localStorage.setItem('DiaryAnswer', diary);      
    }

    

    /**get password keystrokes and check safety of website password */
    if(msg.message == "contentButtonclick"){
        blockAlert = 0;
        keyStrokePassword = msg.keyStrokePassword;
        password_safety = msg.password_safety;
        dynamic_keydown = msg.dynamic_keydown;
        dynamic_keyup = msg.dynamic_keyup;
        if(keyStrokePassword.length != 0){
            for(var i=0;i<keyStrokePassword.length;i++){
                password_length = password_length+1;
            }
            checkPasswordLength(password_length); 
            password_length=0;
        }
        if(password_safety == undefined || password_safety == 0 || password_safety == [] && keyStrokePassword !=""){
            for(var j=0; j<keyStrokePassword.length;j++){
                if(keyStrokePassword[j] == "a" || keyStrokePassword[j] == "b" || keyStrokePassword[j] == "c" || keyStrokePassword[j] == "d" || keyStrokePassword[j] == "e" || keyStrokePassword[j] == "f" || keyStrokePassword[j] == "g" || keyStrokePassword[j] == "h" || keyStrokePassword[j] == "i" || keyStrokePassword[j] == "j" || keyStrokePassword[j] == "k" || keyStrokePassword[j] == "l" || keyStrokePassword[j] == "m" || keyStrokePassword[j] == "n" || keyStrokePassword[j] == "o"|| keyStrokePassword[j] == "p" || keyStrokePassword[j] == "q" || keyStrokePassword[j] == "r" || keyStrokePassword[j] == "s" || keyStrokePassword[j] == "t" || keyStrokePassword[j] == "u"|| keyStrokePassword[j] =="v"|| keyStrokePassword[j] == "w"|| keyStrokePassword[j] == "x" || keyStrokePassword[j] == "y" || keyStrokePassword[j] == "z"){
                    if(!password_safety.includes('lowercase')){
                        password_safety.push("lowercase");
                    }
                }
                if(keyStrokePassword[j] == "A" || keyStrokePassword[j] == "B" || keyStrokePassword[j] == "C" || keyStrokePassword[j] == "D" || keyStrokePassword[j] == "E" || keyStrokePassword[j] == "F" || keyStrokePassword[j] == "G" || keyStrokePassword[j] == "H" || keyStrokePassword[j] == "I" || keyStrokePassword[j] == "J" || keyStrokePassword[j] == "K" || keyStrokePassword[j] == "L" || keyStrokePassword[j] == "M" || keyStrokePassword[j] == "N" || keyStrokePassword[j] == "O"|| keyStrokePassword[j] == "P" || keyStrokePassword[j] == "Q" || keyStrokePassword[j] == "R" || keyStrokePassword[j] == "S" || keyStrokePassword[j] == "T" || keyStrokePassword[j] == "U"|| keyStrokePassword[j] =="V"|| keyStrokePassword[j] == "W"|| keyStrokePassword[j] == "X" || keyStrokePassword[j] == "Y" || keyStrokePassword[j] == "Z"){
                    if(!password_safety.includes('uppercase')){
                        password_safety.push("uppercase");
                    }
                }
                if(keyStrokePassword[j] == "0" || keyStrokePassword[j] == "1" || keyStrokePassword[j] == "2" || keyStrokePassword[j] == "3" || keyStrokePassword[j] == "4" || keyStrokePassword[j] == "5" || keyStrokePassword[j] == "6" || keyStrokePassword[j] == "7" || keyStrokePassword[j] == "8" || keyStrokePassword[j] == "9"){
                    if(!password_safety.includes('number')){
                        password_safety.push("number");
                    }
                }
                if(keyStrokePassword[j] == "!" || keyStrokePassword[j] == "\"" || keyStrokePassword[j] == "§" || keyStrokePassword[j] == "$" || keyStrokePassword[j] == "%" || keyStrokePassword[j] == "&" || keyStrokePassword[j] == "/" || keyStrokePassword[j] == "(" || keyStrokePassword[j] == ")" || keyStrokePassword[j] == "=" || keyStrokePassword[j] == "`" || keyStrokePassword[j] == "´" || keyStrokePassword[j] == "'" || keyStrokePassword[j] == "#" || keyStrokePassword[j] == "+" || keyStrokePassword[j] == "*" || keyStrokePassword[j] == "~" || keyStrokePassword[j] == "-" || keyStrokePassword[j] == "_" || keyStrokePassword[j] == "." || keyStrokePassword[j] == ":" || keyStrokePassword[j] == "," || keyStrokePassword[j] == ";" || keyStrokePassword[j] == "@" || keyStrokePassword[j] == "€" || keyStrokePassword[j] == "<" || keyStrokePassword[j] == ">" || keyStrokePassword[j] == "|"){
                    if(!password_safety.includes('symbol')){
                        password_safety.push("symbol");
                    }
                }
            }
        }
        showDynamic();
        mainCondition();
        sendResponse({
            hold_time_average:hold_time_average,
            keydown_keydown_time_average:keydown_keydown_time_average,
            keyup_keydown_time_average:keyup_keydown_time_average,
            firstText:firstText,
            secondText:secondText,
        });
    }

    /**clear implication when user closed it */
    if(msg.from== "implicationclear"){
        hideImplication = msg.hideImplication;
        localStorage.setItem('Localtitle', "");
        localStorage.setItem('LocalFirstText',""); 
        localStorage.setItem('LocalSecondText', "");
        headtext = "";
        firstText="";
        secondText="";
    }

    /**fast keystrokes from content.js detected*/
    if(msg.message == "fastKeystroke"){
        localfastkeystrokes = 1;
        blockAlert = 0;
        mainCondition();
        sendResponse({
        });
    }

    /**get Keystrokes from localstorage and send to content.js */
    if(msg.from == "popupValues"){
        personal_hold_time_average = localStorage.getItem('Average HoldTime');
        slow_hold_time_average = localStorage.getItem('Average Slow HoldTime');
        personal_keydown_keydown_time_average = localStorage.getItem('Average Keydown/down');
        slow_keydown_keydown_time_average = localStorage.getItem('Average Slow Keydown/down');
        personal_keyup_keydown_time_average = localStorage.getItem('Average Keydown/up');
        slow_keyup_keydown_time_average = localStorage.getItem('Average Slow Keydown/up');
        sendResponse({
            personal_hold_time_average:personal_hold_time_average,
            slow_hold_time_average:slow_hold_time_average,
            personal_keydown_keydown_time_average:personal_keydown_keydown_time_average,
            slow_keydown_keydown_time_average:slow_keydown_keydown_time_average,
            personal_keyup_keydown_time_average:personal_keyup_keydown_time_average,
            slow_keyup_keydown_time_average:slow_keyup_keydown_time_average
        });
    };

    /**check if Alert is necessary after new page call */
    if(msg.message == "checkPopup"){
        if(oldTabName != tabName && oldTabURL != currentURL && firstCheck==0){
            oldTabName=tabName;
            localStorage.setItem('Localtitle', "");
            localStorage.setItem('LocalFirstText',""); 
            localStorage.setItem('LocalSecondText', "");
            headtext="";
            firstText=""; 
            secondText="";
            hideImplication=0;
            mainCondition();
        }
        /**new website */
        else if(oldTabName != tabName && firstCheck ==0){
            implicationCounter = implicationCounter+1;
            oldTabName=tabName;
            firstCheck = 1;
            if(localStorage.getItem('Localtitle')!="" && localStorage.getItem('LocalFirstText')!="" && localStorage.getItem('LocalSecondText')!="" && localStorage.getItem('Localtitle') && localStorage.getItem('LocalFirstText') && localStorage.getItem('LocalSecondText')){
                    sendResponse({
                        headtext:localStorage.getItem('Localtitle'), 
                        firstText:localStorage.getItem('LocalFirstText'), 
                        secondText:localStorage.getItem('LocalSecondText'),

                    });
            }
        }
        /**login of youtube is google login */
        else if(oldTabName == "google" && tabName=="youtube"){
            if(hideImplication == 0){
                mainCondition();
            }
            
        }
        /**Same website */
        else if(oldTabName == tabName){
            if(hideImplication==0){
                mainCondition()
            }
            if(localStorage.getItem('Localtitle')!="" && localStorage.getItem('LocalFirstText')!="" && localStorage.getItem('LocalSecondText')!="" && localStorage.getItem('Localtitle') && localStorage.getItem('LocalFirstText') && localStorage.getItem('LocalSecondText')){
                sendResponse({
                    headtext:localStorage.getItem('Localtitle'), 
                    firstText:localStorage.getItem('LocalFirstText'), 
                    secondText:localStorage.getItem('LocalSecondText'),

                });
            }
        }
    }

    if(msg.message == "feedback"){
        var blob = new Blob([localStorage.getItem('DiaryAnswer')],{type:"text/plain"});  
        var url = URL.createObjectURL(blob);
        window.browser.downloads.download({
            url:url
        })
    }

    return true;
});

/**compare frequency of password lengths to detect reuse, check password length and check if password is correct*/
function checkPasswordLength(pw_lngt){

    /**compare passwordlength with other websites password length */
    if(localStorage.getItem(tabName)){
        if(localStorage.getItem(tabName) == pw_lngt){
            for (var i = 0; i < localStorage.length; i++){
                passwordLength_website = passwordLength_website +1;

                /**detect all Logins with the same password length */
                if(localStorage.getItem(localStorage.key(i)) == pw_lngt){
                    passwordlength_counter = passwordlength_counter+1;
                }
            }
            passwordlength_counter = passwordlength_counter-1;
        }

        /**check if password is correct */
        else{
            for (var k = 0; k < localStorage.length; k++){
                if(localStorage.getItem(localStorage.key(k)) == pw_lngt){
                    passwordlength_counter = passwordlength_counter+1;
                    passwordLength_website = passwordLength_website +1;
                }
                else{
                    passwordLength_website = passwordLength_website +1;
                }
            }
            localStorage.setItem(tabName, pw_lngt);       
        }
    }
    else{
        for (var i = 0; i < localStorage.length; i++){
            passwordLength_website = passwordLength_website +1;
            if(localStorage.getItem(localStorage.key(i)) == pw_lngt){
                passwordlength_counter = passwordlength_counter+1;
            }
        }
        localStorage.setItem(tabName, pw_lngt);      
    }

    /**check password length */
    if(pw_lngt<8){
        localPasswordShort = 1; 
        passwordlength_counter=0;
        passwordLength_website=0;
    }

    /**compare frequency of password lengths to detect reuse */
    for (var g = 0; g < localStorage.length; g++){
        if(localStorage.key(g) == "DiaryAnswer"){
            diaryAnswer = 1;      

            /**if all passwords have the same length its no reuse - maybe passwordgenerator used*/
            if(passwordlength_counter == passwordLength_website-10 && passwordlength_counter > 1){
                passwordlength_counter=0;
                passwordLength_website=0;
            }
            var length_sum = ((passwordLength_website-10) + passwordlength_counter);
            var rel_frequ_website = (passwordLength_website-10) / length_sum;
            var rel_frequ_counter = passwordlength_counter / length_sum;
            if(rel_frequ_counter>= 0.5 && rel_frequ_counter!=1){
                localPasswordReuse = 1;  
                passwordlength_counter=0;
                passwordLength_website=0;
            }
            else{
                passwordlength_counter=0;
                passwordLength_website=0;
            } 
        }
    }
    if(diaryAnswer==0){
        if(passwordlength_counter == passwordLength_website-9 && passwordlength_counter != 1 && passwordlength_counter !=0){
            localPasswordReuse = 1;
            passwordlength_counter=0;
            passwordLength_website=0;
        }
        var length_sum = ((passwordLength_website-9) + passwordlength_counter);
        var rel_frequ_website = (passwordLength_website-9) / length_sum;
        var rel_frequ_counter = passwordlength_counter / length_sum;

        if(rel_frequ_counter>= 0.5){
            localPasswordReuse = 1;  
            passwordlength_counter=0;
            passwordLength_website=0;
        }
        else{
            passwordlength_counter=0;
            passwordLength_website=0;
        } 
    }

}

/** get keystrokes from localstorage and get current url and website name */
keystrokeCheck();
function keystrokeCheck(){
    //localStorage.clear();
    if(currentURL == ""){
        localStorage.setItem('Localtitle', "");
        localStorage.setItem('LocalFirstText',""); 
        localStorage.setItem('LocalSecondText', "");
        headtext = "";
        firstText="";
        secondText="";
    }
    window.browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) { 
        tabName = tab.url; //Tab of the website
        currentURL = tab.url; //whole url
        /**get name of the page*/
        for(var a = 0; a<tabName.length; a++){ 
            if(tabName[a] == "/"){
                if(tabName[a+1] == "/"){
                    if(tabName[a+2] == "w"){
                        if(tabName[a+3]== "w"){
                            if(tabName[a+4] == "w"){
                                /**www*/
                                for(var b = 0; b<tabName.length; b++){  
                                    if(tabName[b]=="."){
                                        tabName = tabName.split('.')[1];
                                    }
                                }
                            }
                        }
                    }  
                    /**TODO */
                    else if(tabName[a+2] == "d"){
                        if(tabName[a+3]== "e"){
                            if(tabName[a+4] == "-"){
                                /**www*/
                                for(var b = 0; b<tabName.length; b++){  
                                    if(tabName[b]=="."){
                                        tabName = tabName.split('.')[1];
                                    }
                                }
                            }
                        }
                    }   
                    
                    else if(tabName[a+2] != "w"){ 
                        var sumTabName ="";    
                        for(var c=(a+2); c<tabName.length;c++){
                            sumTabName = sumTabName+tabName[c]
                            if(tabName[c+1] == "."){
                                tabName = sumTabName;
                            }
                        }  
                    }
                }
            }
        }
        
        /**send keystrokes from localstorage to content.js */
        personal_hold_time_average=localStorage.getItem('Average HoldTime');
        slow_hold_time_average=localStorage.getItem('Average Slow HoldTime');
        personal_keydown_keydown_time_average=localStorage.getItem('Average Keydown/down');
        slow_keydown_keydown_time_average=localStorage.getItem('Average Slow Keydown/down');
        personal_keyup_keydown_time_average=localStorage.getItem('Average Keydown/up');
        slow_keyup_keydown_time_average=localStorage.getItem('Average Slow Keydown/up');
        if (changeInfo.status == 'complete') {  
            window.browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
                window.browser.tabs.sendMessage(tabs[0].id, {
                    message: "sendAverageValues",
                    personal_hold_time_average:personal_hold_time_average,
                    slow_hold_time_average:slow_hold_time_average,
                    personal_keydown_keydown_time_average:personal_keydown_keydown_time_average,
                    slow_keydown_keydown_time_average:slow_keydown_keydown_time_average,
                    personal_keyup_keydown_time_average:personal_keyup_keydown_time_average,
                    slow_keyup_keydown_time_average:slow_keyup_keydown_time_average
                });
            });
        }
    });

    /**show Diary after 10 Implication popups*/
    window.browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) { 
        if (changeInfo.status == 'complete') {  
            window.browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if(implicationCounter == 10){
                    implicationCounter = 0;
                    window.browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        window.browser.tabs.sendMessage(tabs[0].id, {
                            message: "showDiary", 
                        });
                    });
                }
            });
        };
    });
};

/**check if website use 2-Factor-Authentication*/
function twoFactorFunction(){
    url = 'https://2fa.directory/de/';
    invocation = new XMLHttpRequest();
    if(invocation) {
        invocation.open('GET', url);
        invocation.responseType = 'document';
        invocation.onload = function(){
            var tableElement = invocation.responseXML.getElementsByTagName("tr");
            for(var i=0;i<tableElement.length;i++){

                /**get websites with 2-Factor-Authentication */
                if(tableElement[i].className == "table-success"){
                    if(tableElement[i].innerHTML.indexOf("site-name") !=-1){
                        var wordsArray = tableElement[i].innerText.split(' ');
                        for(var j=0; j<wordsArray.length;j++){
                            var lowerWordArray = wordsArray[j].toLowerCase();
                            if(lowerWordArray ==tabName){
                                twoFA = 0;
                            }                         
                        }
                    }
                }

                /**get websites without 2-Factor-Authentication */
                else if(tableElement[i].className == "table-danger"){
                    if(tableElement[i].innerHTML.indexOf("site-name") != -1){
                        var searchWord = tableElement[i].getElementsByClassName("searchWords"); 
                        for(var m=0;m<searchWord.length;m++){
                            var wordElement = searchWord[m].innerText.split(' ');
                            for(var n=0; n<wordElement.length;n++){
                                var lowerWordArraywrong = wordElement[n].toLowerCase();
                                if(lowerWordArraywrong == tabName/* || lowerWordArraywrong == wholetabURL*/){
                                    twoFA=2;
                                    mainCondition();
                                    }
                            }
                        }   
                    }
                }
            }
        }
        invocation.send();
    }
    return 1;
};

/**check if password includes all character types */
function allCharacterTypes(){
    if(password_safety.length ==0){
    }

    /** check if password include special character, upper case, lower case, number */
    else if(password_safety.includes('uppercase')&& password_safety.includes('lowercase') && password_safety.includes('symbol') && (password_safety.includes('number') || password_safety.includes('num box'))){
    }

    /** check which keystroke is missing */
    else if(!password_safety.includes('uppercase')){
        localPasswordSafety=1;
        if(!password_safety.includes('lowercase')){
            if(!password_safety.includes('symbol')){    
                //firstText="Your password must contain at least one uppercase letter, one lowercase letter and one special character. It takes on average 120 seconds to decrypt an 8-character password from numbers. <a target='_blank' href='https://www.weforum.org/agenda/2021/12/passwords-safety-cybercrime/#:~:text=To%20make%20a%20password%20truly,computer%2034%2C000%20years%20to%20crack'>(weforum)</a>";
                firstText="Your password must contain at least one uppercase letter, one lowercase letter and one special character. Choose a secure password so that your account will not be attacked.";
            }
            else if(!password_safety.includes('number') && !password_safety.includes('num board')){
                //firstText="Your password must contain at least one uppercase letter, one lowercase letter and one number. It takes on average 120 seconds to decrypt an 8-character password from symbols. <a target='_blank' href='https://www.weforum.org/agenda/2021/12/passwords-safety-cybercrime/#:~:text=To%20make%20a%20password%20truly,computer%2034%2C000%20years%20to%20crack'>(weforum)</a>";
                firstText="Your password must contain at least one uppercase letter, one lowercase letter and one number. Choose a secure password so that your account will not be attacked.";
            }
            else{                  
                //firstText="Your password must have at least one uppercase letter and one lowercase letter. It takes on average 20 minutes to decrypt an 8-character password from numbers and symbols. <a target='_blank' href='https://www.weforum.org/agenda/2021/12/passwords-safety-cybercrime/#:~:text=To%20make%20a%20password%20truly,computer%2034%2C000%20years%20to%20crack'>(weforum)</a>";                  
                firstText="Your password must have at least one uppercase letter and one lowercase letter. Choose a secure password so that your account will not be attacked.";
            }
        }
        else if(!password_safety.includes('symbol')){
            if(!password_safety.includes('number') && !password_safety.includes('num board')){
                //firstText= "Your password must contain at least one capital letter, one number and one symbol. It takes on average 97 seconds to decrypt an 8-character password from lowercase letters. <a target='_blank' href='https://www.weforum.org/agenda/2021/12/passwords-safety-cybercrime/#:~:text=To%20make%20a%20password%20truly,computer%2034%2C000%20years%20to%20crack'>(weforum)</a>";
                firstText= "Your password must contain at least one capital letter, one number and one symbol. Choose a secure password so that your account will not be attacked.";
            }
            else{
                //firstText="Your password must contain at least one capital letter and one symbol. It takes on average 20 minutes to decrypt an 8-character password from lowercase letters and numbers. <a target='_blank' href='https://www.weforum.org/agenda/2021/12/passwords-safety-cybercrime/#:~:text=To%20make%20a%20password%20truly,computer%2034%2C000%20years%20to%20crack'>(weforum)</a>";
                firstText="Your password must contain at least one capital letter and one symbol. Choose a secure password so that your account will not be attacked.";
            }
        }
        else if(!password_safety.includes('number') && !password_safety.includes('num board')){
            //firstText="Your password must contain at least one capital letter and one number. It takes on average 20 minutes to decrypt an 8-character password from lowercase letters and symbols. <a target='_blank' href='https://www.weforum.org/agenda/2021/12/passwords-safety-cybercrime/#:~:text=To%20make%20a%20password%20truly,computer%2034%2C000%20years%20to%20crack'>(weforum)</a>";
            firstText="Your password must contain at least one capital letter and one number. Choose a secure password so that your account will not be attacked.";
        }
        else{
            //firstText="Your password must contain at least one capital letter. It takes on average 60 minutes to decrypt an 8-character password from lowercase letters, numbers and symbols. <a target='_blank' href='https://www.weforum.org/agenda/2021/12/passwords-safety-cybercrime/#:~:text=To%20make%20a%20password%20truly,computer%2034%2C000%20years%20to%20crack'>(weforum)</a>";
            firstText="Your password must contain at least one capital letter. Choose a secure password so that your account will not be attacked.";
        }
    }
    else if(!password_safety.includes('lowercase')){
        localPasswordSafety=1;
        if(!password_safety.includes('symbol')){
            if(!password_safety.includes('number') && !password_safety.includes('num board')){
                //firstText="Your password must contain at least one lowercase letter, one symbol and one number. It takes on average 120 seconds to decrypt an 8-character password from uppercase letters. <a target='_blank' href='https://www.weforum.org/agenda/2021/12/passwords-safety-cybercrime/#:~:text=To%20make%20a%20password%20truly,computer%2034%2C000%20years%20to%20crack'>(weforum)</a>";
                firstText="Your password must contain at least one lowercase letter, one symbol and one number. Choose a secure password so that your account will not be attacked.";
            }
            else{
                //firstText="Your password must contain at least one lowercase letter and one symbol. It takes on average 20 minutes to decrypt an 8-character password from uppercase letters and numbers. <a target='_blank' href='https://www.weforum.org/agenda/2021/12/passwords-safety-cybercrime/#:~:text=To%20make%20a%20password%20truly,computer%2034%2C000%20years%20to%20crack'>(weforum)</a>";
                firstText="Your password must contain at least one lowercase letter and one symbol. Choose a secure password so that your account will not be attacked.";
            }
        }
        else if(!password_safety.includes('number') && !password_safety.includes('num board')){
            //firstText="Your password must contain at least one lowercase letter and one number. It takes on average 20 minutes to decrypt an 8-character password from uppercase letters and symbols. <a target='_blank' href='https://www.weforum.org/agenda/2021/12/passwords-safety-cybercrime/#:~:text=To%20make%20a%20password%20truly,computer%2034%2C000%20years%20to%20crack'>(weforum)</a>";
            firstText="Your password must contain at least one lowercase letter and one number. Choose a secure password so that your account will not be attacked.";
        }
        else{
            //firstText="Your password must contain at least one lowercase letter. It takes on average 60 minutes to decrypt an 8-character password from uppercase letters, numbers and symbols. <a target='_blank' href='https://www.weforum.org/agenda/2021/12/passwords-safety-cybercrime/#:~:text=To%20make%20a%20password%20truly,computer%2034%2C000%20years%20to%20crack'>(weforum)</a>";
            firstText="Your password must contain at least one lowercase letter. Choose a secure password so that your account will not be attacked.";
        }
    }
    else if(!password_safety.includes('symbol')){
        localPasswordSafety=1;
        if(!password_safety.includes('number') && !password_safety.includes('num board')){
            //firstText="Your password must contain at least one symbol and one number. It takes on average 20 minutes to decrypt an 8-character password from lowercase and uppercase letters. <a target='_blank' href='https://www.weforum.org/agenda/2021/12/passwords-safety-cybercrime/#:~:text=To%20make%20a%20password%20truly,computer%2034%2C000%20years%20to%20crack'>(weforum)</a> ";
            firstText="Your password must contain at least one symbol and one number. Choose a secure password so that your account will not be attacked.";
        }
        else{
            //firstText="Your password must have at least one symbol. It takes on average 60 minutes to decrypt an 8-character password from lowercase and uppercase letters and numbers. <a target='_blank' href='https://www.weforum.org/agenda/2021/12/passwords-safety-cybercrime/#:~:text=To%20make%20a%20password%20truly,computer%2034%2C000%20years%20to%20crack'>(weforum)</a>";
            firstText="Your password must have at least one symbol. Choose a secure password so that your account will not be attacked.";
        }
    }
    else if(!password_safety.includes('number') && !password_safety.includes('num board')){
        localPasswordSafety=1;
        //firstText="Your password must contain at least one number. It takes on average 60 minutes to decrypt an 8-character password from lowercase and uppercase letters and symbols. <a target='_blank' href='https://www.weforum.org/agenda/2021/12/passwords-safety-cybercrime/#:~:text=To%20make%20a%20password%20truly,computer%2034%2C000%20years%20to%20crack'>(weforum)</a>";
        firstText="Your password must contain at least one number. Choose a secure password so that your account will not be attacked.";
    } 
};


/** calculate keystroke times */
function showDynamic(){
    allCharacterTypes();

    /** calculate hold time of key - dwell time*/
    for(var i = 0; i<dynamic_keydown.length; i++){
        hold_time.push(dynamic_keyup[i]-dynamic_keydown[i]);
    }
    /** calculate time between two keydown */
    for(var j = 0; j<dynamic_keydown.length-1; j++){
        keydown_keydown_time.push(dynamic_keydown[j+1]-dynamic_keydown[j]);
    }
    /** calculate time between two keystrokes - transition time*/
    for(var a=0; a<dynamic_keydown.length-1;a++){
        keyup_keydown_time.push(dynamic_keydown[a+1]-dynamic_keyup[a]);
    }
    if(hold_time.length>0){
        for(var a=0; a<hold_time.length;a++){
            hold_time_sum += hold_time[a];
            if(a == hold_time.length-1){
                hold_time_average = hold_time_sum/hold_time.length;
            }
        }
    }
    if(keydown_keydown_time.length>0){
        for(var a=0; a<keydown_keydown_time.length;a++){
            keydown_keydown_time_sum += keydown_keydown_time[a];
            if(a == keydown_keydown_time.length-1){
                keydown_keydown_time_average = keydown_keydown_time_sum/keydown_keydown_time.length;
            }
        }
    }
    if(keyup_keydown_time.length>0){
        for(var a=0; a<keyup_keydown_time.length;a++){
            keyup_keydown_time_sum += keyup_keydown_time[a];
            if(a == keyup_keydown_time.length-1){
                keyup_keydown_time_average = keyup_keydown_time_sum/keyup_keydown_time.length;
            }
        }
    }
    twoFactorFunction();
};

/**Checking the alert output for the respective web page*/
function mainCondition(){
    if(blockAlert == 0){
        blockAlert=1;   
        if(localPasswordReuse ==1){
            if(localPasswordShort == 0 && twoFA == 0 && localPasswordSafety==0 && localfastkeystrokes==0){
                headtext="Password reuse";
                firstText="The plugin detected that you often insert passwords with the same length. Maybe you reuse this password on different websites?";
                secondText="Nele V., a participant of the online survey, used the same password on several websites. Since a website with poor security measures was hacked, the hackers were also able to access her Google account and stole her photos and documents."     
                resetLocalValues(headtext,firstText,secondText)
            }
            else if(localPasswordShort == 1 && twoFA == 0 && localPasswordSafety==0 && localfastkeystrokes==0){
                headtext="Short password reuse";
                firstText="The plugin detected that you often insert a short passwords with the same length. Maybe you reuse this password on different websites?";
                secondText="Korbinian E. and Nele V., two participants of the online survey, reused a short password. They lost access to their accounts."     
                resetLocalValues(headtext,firstText,secondText)
            }
            else if(localPasswordShort == 0 && twoFA == 2 && localPasswordSafety==0 && localfastkeystrokes==0){
                headtext= "Password reuse and lack of Two-Factor-Authentication";
                firstText="The plugin detected that you often insert a short passwords with the same length. Maybe you reuse this password on different websites? Also use websites with Two-Factor-Authentication to prevent your account from being hacked.";
                secondText="Korbinian E. and Nele V., two participants of the online survey, reused a short password. They lost access to their accounts. Paul K. was hacked on a website without Two-Factor-Authentication and lost all his private photos as a result."    
                resetLocalValues(headtext,firstText,secondText)
            }
            else if(localPasswordShort == 0 && twoFA == 0 && localPasswordSafety==1 && localfastkeystrokes==0){
                headtext="Weak password reuse";
                secondText="Nele V. and Lena M., participants of the online survey, reused a weak password. Their accounts were hacked and they lost photos, documents and money."     
                resetLocalValues(headtext,firstText,secondText)
            }
            else if(localPasswordShort == 0 && twoFA == 0 && localPasswordSafety==0 && localfastkeystrokes==1){
                headtext="Password reuse";
                firstText="The plugin detected that you typed the password very quickly, which usually happens when you use a password frequently. Use maybe also reused this password. Use strong and unique passwords to avoid losing your private data."
                secondText="Nele V. and Tom K., two participants of the online survey, used the same password on several websites. Their accounts were hacked and they lost photos, documents and money."     
                resetLocalValues(headtext,firstText,secondText)
            }
            else if(localPasswordShort == 1 && twoFA == 2 && localPasswordSafety==0 && localfastkeystrokes==0){
                headtext="Short password reuse and lack of Two-Factor-Authentication";
                firstText="The plugin detected that you often insert a short passwords with the same length. Maybe you reuse this password on different websites? This website also does not offer Two-Factor-Authentication. Use other websites to prevent your account from being hacked.";
                secondText="Korbinian E. and Nele V., two participants of the online survey, reused a short password. They lost access to their accounts. Paul K. was hacked on a website without Two-Factor-Authentication and lost all his private photos as a result."    
                resetLocalValues(headtext,firstText,secondText)
            }
            else if(localPasswordShort == 1 && twoFA == 0 && localPasswordSafety==1 && localfastkeystrokes==0){
                headtext="Weak password reuse";
                secondText="Nele V. and Lena M., participants of the online survey, reused a weak password. Their accounts were hacked and they lost photos, documents and money."     
                resetLocalValues(headtext,firstText,secondText)
            }
            else if(localPasswordShort == 1 && twoFA == 0 && localPasswordSafety==0 && localfastkeystrokes==1){
                headtext="Short password reuse";
                firstText="The plugin detected that you used a short password and typed it very quickly, which usually happens when you use a password frequently. Use maybe also reused this password. Use strong and unique passwords to avoid losing your private data."
                secondText="Korbinian E. and Nele V., two participants of the online survey, reused a short password. They lost access to their accounts."     
                resetLocalValues(headtext,firstText,secondText)
            }
            else if(localPasswordShort == 0 && twoFA == 2 && localPasswordSafety==1 && localfastkeystrokes==0){
                headtext= "Weak password reuse and lack of Two-Factor-Authentication";
                firstText="The plugin detected that you often insert an weak passwords with the same length. Maybe you reuse this password on different websites? Also use websites with Two-Factor-Authentication to prevent your account from being hacked.";
                secondText="Nele V. and Lena M., participants of the online survey, reused a weak password. Their accounts were hacked and they lost photos, documents and money. Paul K. was hacked on a website without Two-Factor-Authentication and lost all his private photos as a result."    
                resetLocalValues(headtext,firstText,secondText)
            }
            else if(localPasswordShort == 0 && twoFA == 2 && localPasswordSafety==0 && localfastkeystrokes==1){
                headtext= "Password reuse and lack of Two-Factor-Authentication";
                firstText="The plugin detected that you often insert an passwords with the same length fast. Maybe you reuse this password on different websites? Also use websites with Two-Factor-Authentication to prevent your account from being hacked.";
                secondText="Nele V. and Tom K., two participants of the online survey, used the same password on several websites. Their accounts were hacked and they lost photos, documents and money. Paul K. was hacked on a website without Two-Factor-Authentication and lost all his private photos as a result."    
                resetLocalValues(headtext,firstText,secondText)
            }
            else if(localPasswordShort == 0 && twoFA == 0 && localPasswordSafety==1 && localfastkeystrokes==1){
                headtext="Weak password reuse";
                secondText="Nele V. and Lena M., participants of the online survey, reused a weak password. Their accounts were hacked and they lost photos, documents and money."     
                resetLocalValues(headtext,firstText,secondText)
            }
            else if(localPasswordShort == 1 && twoFA == 2 && localPasswordSafety==1 && localfastkeystrokes==0){
                headtext= "Short and weak password reuse and lack of Two-Factor-Authentication";
                firstText="The plugin detected that you often insert a short and weak passwords with the same length. Maybe you reuse this password on different websites? Also use websites with Two-Factor-Authentication to prevent your account from being hacked.";
                secondText="Nele V. and Lena M., participants of the online survey, reused a weak and short password. Their accounts were hacked and they lost photos, documents and money. Paul K. was hacked on a website without Two-Factor-Authentication and lost all his private photos as a result."    
                resetLocalValues(headtext,firstText,secondText)
            }
            else if(localPasswordShort == 1 && twoFA == 2 && localPasswordSafety==0 && localfastkeystrokes==1){
                headtext="Short password reuse and lack of Two-Factor-Authentication";
                firstText="The plugin detected that you often insert a short passwords with the same length very fast. Maybe you reuse this password on different websites? This website also does not offer Two-Factor-Authentication. Use other websites to prevent your account from being hacked.";
                secondText="Korbinian E. and Nele V., two participants of the online survey, reused a short password. They lost access to their accounts. Paul K. was hacked on a website without Two-Factor-Authentication and lost all his private photos as a result."    
                resetLocalValues(headtext,firstText,secondText)
            }
            else if(localPasswordShort == 1 && twoFA == 0 && localPasswordSafety==1 && localfastkeystrokes==1){
                headtext="Short and weak password reuse";
                firstText="The plugin detected that you often insert a short and weak passwords with the same length very fast. Maybe you reuse this password on different websites?";
                secondText="Nele V. and Lena M., participants of the online survey, reused a short and weak password. Their accounts were hacked and they lost photos, documents and money."    
                resetLocalValues(headtext,firstText,secondText)
            }
            else if(localPasswordShort == 1 && twoFA == 2 && localPasswordSafety==1 && localfastkeystrokes==1){
                headtext="Short and weak password reuse and lack of Two-Factor-Authentication";
                firstText="The plugin detected that you often insert a short passwords with the same length very fast. Maybe you reuse this password on different websites? This website also does not offer Two-Factor-Authentication. Use other websites to prevent your account from being hacked.";
                secondText="Nele V. and Lena M., participants of the online survey, reused a short and weak password. Their accounts were hacked and they lost photos, documents and money. Paul K. was hacked on a website without Two-Factor-Authentication and lost all his private photos as a result."    
                resetLocalValues(headtext,firstText,secondText)
            }
            
        }
        else{
            if(localPasswordShort == 1){
                if(twoFA == 0 && localPasswordSafety==0 && localfastkeystrokes==0){
                    headtext="Short password!",
                    firstText="The plugin detected that you use a short password. Make sure your password is at least 8 characters long.";
                    secondText="Korbinian E., a participant of the online survey, used a password on Facebook that was too short and got hacked. He lost access to his Facebook account and has not regained it."    
                    resetLocalValues(headtext,firstText,secondText)
                }
                else if(twoFA == 2 && localPasswordSafety==0 && localfastkeystrokes==0){
                    headtext="Short password and lack of Two-Factor-Authentication",
                    firstText="The plugin detected that you use a short password. Make sure your password is at least 8 characters long. This website also does not offer Two-Factor-Authentication. Use other websites to prevent your account from being hacked.";
                    secondText="Korbinian E., a participant of the online survey, used a password on Facebook that was too short and got hacked. He lost access to his Facebook account and has not regained it. Paul K. was hacked on a website without Two-Factor-Authentication and lost all his private photos as a result."    
                    resetLocalValues(headtext,firstText,secondText)
                }
                else if(twoFA == 0 && localPasswordSafety==1 && localfastkeystrokes==0){
                    headtext="Short and weak password!",
                    firstText="The plugin detected that you use a short and weak password. Make sure your password is at least 8 characters long.";
                    secondText="Korbinian E. and Lena M., two participants of the online survey, used a short password on Facebook and a shopping website. They got hacked and lost their accounts and money."    
                    resetLocalValues(headtext,firstText,secondText)
                }
                else if(twoFA == 0 && localPasswordSafety==0 && localfastkeystrokes==1){
                    headtext="Short password reuse",
                    firstText="The plugin detected that you insert a short password fast. Make sure your password is at least 8 characters long. Maybe you reuse this password on different websites?";
                    secondText="Korbinian E. and Nele V., two participants of the online survey, used a short password on their account. They got hacked and lost the account access, photos and documents."    
                    resetLocalValues(headtext,firstText,secondText)
                }
                else if(twoFA == 2 && localPasswordSafety==1 && localfastkeystrokes==0){
                    headtext="Short, weak password and lack of Two-Factor-Authentication",
                    firstText="The plugin detected that you use a short and weak password. Make sure your password is at least 8 characters long. This website also does not offer Two-Factor-Authentication. Use other websites to prevent your account from being hacked.";
                    secondText="Korbinian E. and Lena M., two participants of the online survey, used a short and weak password on Facebook and a shopping website. They got hacked and lost their accounts and money. Paul K. was hacked on a website without Two-Factor-Authentication and lost all his private photos as a result."    
                    resetLocalValues(headtext,firstText,secondText)
                }
                else if(twoFA == 2 && localPasswordSafety==0 && localfastkeystrokes==1){
                    headtext="Short, weak password and lack of Two-Factor-Authentication",
                    firstText="The plugin detected that you use a short and weak password. Make sure your password is at least 8 characters long. This website also does not offer Two-Factor-Authentication. Use other websites to prevent your account from being hacked.";
                    secondText="Korbinian E. and Lena M., two participants of the online survey, used a short and weak password on Facebook and a shopping website. They got hacked and lost their accounts and money. Paul K. was hacked on a website without Two-Factor-Authentication and lost all his private photos as a result."    
                    resetLocalValues(headtext,firstText,secondText)
                }
                else if(twoFA == 2 && localPasswordSafety==1 && localfastkeystrokes==1){
                    headtext="Short, weak password and lack of Two-Factor-Authentication",
                    firstText="The plugin detected that you use a short and weak password. Make sure your password is at least 8 characters long. This website also does not offer Two-Factor-Authentication. Use other websites to prevent your account from being hacked.";
                    secondText="Korbinian E. and Lena M., two participants of the online survey, used a short and weak password on Facebook and a shopping website. They got hacked and lost their accounts and money. Paul K. was hacked on a website without Two-Factor-Authentication and lost all his private photos as a result."    
                    resetLocalValues(headtext,firstText,secondText)
                }
            }
            else{
                if(twoFA == 2){
                    if(localPasswordSafety==0 && localfastkeystrokes==0){
                        headtext = "Lack of Two-Factor-Authentication";
                        firstText="Are you sure you want to use this website? Use websites with Two-Factor-Authentication to prevent your account from being hacked.";
                        secondText="Paul K., a participant of my online survey, was hacked on a website without Two-Factor-Authentication and lost all his private photos as a result.";
                        resetLocalValues(headtext,firstText,secondText) 
                    }
                    else if(localPasswordSafety==1 && localfastkeystrokes==0){
                        headtext = "Weak password and lack of Two-Factor-Authentication";
                        firstText="The plugin detected that you use a weak password and this website does not offer a Two-Factor-Authentication. Are you sure you want to use this website?";
                        secondText="Lena M., a participant of the online survey, used an insecure password on a shopping website. Her account was hacked and products were purchased in her name and with her money. Paul K. was hacked on a website without Two-Factor-Authentication and lost all his private photos as a result.";
                        resetLocalValues(headtext,firstText,secondText)   
                    }
                    else if(localPasswordSafety==0 && localfastkeystrokes==1){
                        headtext = "Fast keystrokes and lack of Two-Factor-Authentication";
                        firstText="The plugin detected that you typed the password very quickly, which usually happens when you use a password frequently. Also this website does not offer a Two-Factor-Authentication. Use an other website to prevent your account from being hacked.";
                        secondText="Tom K., a participant of the online survey, used the same password for different accounts. An insecure account was hacked and the hackers now had his Paypal password as well. He lost a lot of money. Paul K. was hacked on a website without Two-Factor-Authentication and lost all his private photos as a result.";
                        resetLocalValues(headtext,firstText,secondText) 
                    }
                    else if(localPasswordSafety==1 && localfastkeystrokes==1){
                        headtext = "Fast keystrokes, weak password and lack of Two-Factor-Authentication";
                        firstText="The plugin detected that you typed a weak password very quickly, which usually happens when you use a password frequently. Also this website does not offer a Two-Factor-Authentication. Use an other website to prevent your account from being hacked.";
                        secondText="Tom K. and Lena M, two participants of the online survey, used the same, weak password for different accounts. They got hacked and lost money. Paul K. was hacked on a website without Two-Factor-Authentication and lost all his private photos as a result.";
                        resetLocalValues(headtext,firstText,secondText)  
                    }
                }
                else{
                    if(localPasswordSafety == 1){
                        if(localfastkeystrokes==0){
                            headtext ="Your password is not safe enough!"
                            secondText="Lena M., a participant of the online survey, used an insecure password on a shopping website. Her account was hacked and products were purchased in her name and with her money.";
                            resetLocalValues(headtext,firstText,secondText)
                        }
                        else{
                            headtext ="Fast keystrokes and weak password";
                            firstText="The plugin detected that you typed the password very quickly, which usually happens when you use a password frequently. Use strong and unique passwords to avoid losing your private data."
                            secondText="Tom K. and Lena M., two participants of the online survey, used the same, weak password for different accounts. A account was hacked and they both lost money.";
                            resetLocalValues(headtext,firstText,secondText);
                        }
                    }
                    else{
                        if(localfastkeystrokes==1){
                            headtext ="Fast keystrokes";
                            firstText="The plugin detected that you typed the password very quickly, which usually happens when you use a password frequently. Use strong and unique passwords to avoid losing your private data."
                            secondText="Tom K., a participant of the online survey, used the same password for different accounts. An insecure account was hacked and the hackers now had his Paypal password as well. He lost a lot of money.";
                            resetLocalValues(headtext,firstText,secondText)
                        }
                        else{
                            if(tabName == "facebook" || tabName == "instagram" || tabName == "amazon" || tabName == "ebay" || tabName =="twitter" || tabName =="youtube"){
                                blockAlert=0;
                                headtext = "Effects of your authentication";
                                firstText ="This website is a popular target for hacking attacks. Enable Two-Factor-Authentication und use unique and long passwords. Do not use the password of this website twice.";
                                secondText="Many participants in my online survey reported data loss on this and other websites. Documents, pictures, data and money were stolen. "
                                resetLocalValues(headtext,firstText,secondText)
                            }
                            else{
                                blockAlert=0;
                            }
                        }
                    }
                }
            } 
        }
    }
}

function resetLocalValues(headtext,firstText,secondText){
    localPasswordReuse = 0;
    localPasswordShort= 0;
    twoFA= 0;
    localPasswordSafety= 0;
    localfastkeystrokes= 0;
    blockAlert=1;   
    localStorage.setItem('Localtitle', headtext);
    localStorage.setItem('LocalFirstText', firstText);
    localStorage.setItem('LocalSecondText', secondText);
    callAlert(headtext, firstText, secondText);
}

/**call alert on one of the big sides */
function callAlert(titletext, firstText, secondText){
    firstCheck=0;
    var myTimeoutsafe = setTimeout(function(){
        clearTimeout(myTimeoutsafe);
        window.browser.tabs.query({active: true, currentWindow: true}, function(tabs) {   
            window.browser.tabs.sendMessage(tabs[0].id, {
                message: "mainCondition",
                headtext: titletext,
                firstText:firstText,
                secondText:secondText,
            });
            localPasswordReuse = 0;
            localPasswordShort = 0;
            localPasswordSafety = 0;
            localfastkeystrokes = 0;
            twoFA = 0;
        });                
    },1000);
}