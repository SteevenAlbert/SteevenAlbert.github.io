/*------------------------*/
/*       The Ciphers      */
/*------------------------*/
function encryptCaeser(plaintext, shift, removespace)
    {
        let ciphertext=""
        for (let i = 0; i < plaintext.length; i++)
        {
            let char = plaintext[i];
            let ch= "";

            //Remove spaces or replace their ascii character instead of shifting it
            if(removespace==true && char.charCodeAt(0) == 32){
                continue;
            }else if(char.charCodeAt(0) == 32){
                ciphertext += " ";
                continue;
            }

            if (char.toUpperCase() === plaintext[i]) // Check if char is upper or lower case
            {
                if(char.charCodeAt(0) + shift > 90){
                     ch =  String.fromCharCode((char.charCodeAt(0) - 65 + shift % 26) % 26 + 65 );
                }else{
                     ch =  String.fromCharCode(char.charCodeAt(0) + shift);
                }
                ciphertext += ch;
            }
            else
            {   
                if(char.charCodeAt(0) + shift > 122){
                    ch =  String.fromCharCode((char.charCodeAt(0) - 95 + shift % 26) % 26 + 95 );
                }else{
                    ch =  String.fromCharCode(char.charCodeAt(0) + shift);
                }
               ciphertext += ch;
            }
        }
        return ciphertext;
    }

function decryptCaeser(ciphertext, shift, removespace)
    {
        ciphertext = encryptCaeser(ciphertext, 26-shift%26, removespace) //same function, but inverted the shift
        return ciphertext;
    }


function encryptMonoalphabetic(plaintext, key, removespace){
    let map = new Map();
    for(let i = 0; i < key.length; i++){
        map.set(i,key[i]);
    }

    let ciphertext = ""
    for(let i = 0; i<plaintext.length; i++){
        if(removespace==true && plaintext[i].charCodeAt(0) == 32){
            continue;
        }else if(plaintext[i].charCodeAt(0) == 32){
            ciphertext += " ";
            continue;
        }
        var subtractionVal = (plaintext[i].toUpperCase() === plaintext[i]) ? 65 : 97; //Check upper or lower case
        ciphertext+= map.get(plaintext[i].charCodeAt(0)-subtractionVal);
    }
    
    return ciphertext;
}

function decryptMonoalphabetic(ciphertext, key, removespace){
    let map = new Map();
    for(let i = 0; i < key.length; i++){
        map.set(key[i],i);
    }

    let plaintext = ""
    key= key.toUpperCase();
    ciphertext = ciphertext.toUpperCase();
    for(let i = 0; i<ciphertext.length; i++){
        if(removespace==true && ciphertext[i].charCodeAt(0) == 32){
            continue;
        }else if(ciphertext[i].charCodeAt(0) == 32){
            ciphertext += " ";
            continue;
        }
        plaintext+= String.fromCharCode(map.get(ciphertext[i])+65); 
    }
    return plaintext;
}


/*------------------------*/
/*       UI Handling      */
/*------------------------*/
const form = document.getElementById('form');

/* Call the chosen cipher */
document.getElementById('submit').onclick = function() {
    const text = form.elements['Plaintext'].value;
    const removespace = form.elements["removespace"].checked;

    if(!form.elements['encryptdecryptswitch'].checked){
        if(document.getElementById("mono").className=="selected"){
            const key = form.elements['Shift'].value; 
            validateKey(key);
            form.elements['Ciphertext'].value = encryptMonoalphabetic(text, key, removespace);
        }
        else{
            const shift = form.elements['Shift'].value;
            validateShift(shift);
            form.elements['Ciphertext'].value = encryptCaeser(text, parseInt(shift), removespace);
        }
    }else{
        if(document.getElementById("mono").className=="selected"){
            const key = form.elements['Shift'].value; 
            validateKey(key);
            form.elements['Ciphertext'].value = decryptMonoalphabetic(text, key, removespace);
        }
        else{
            const shift = form.elements['Shift'].value;
            validateShift(shift);
            form.elements['Ciphertext'].value = decryptCaeser(text, parseInt(shift), removespace);
        }
    }
}

/* Switching to Monoalphabetic Cipher */
document.getElementById("mono").onclick = function(){
    var mono = document.getElementById("mono");
    var caeser = document.getElementById("caeser");
    form.elements['Shift'].value = "QWERTYUIOPASDFGHJKLZXCVBNM";
    form.elements['Shift'].placeholder = "Enter the substitution alphabet";
  
    document.getElementById('shiftlabel').innerHTML = "Subtitution Alphabet";
    
    mono.className = "selected";
    caeser.className ="link";
}

/* Switching to Caeser Cipher */
document.getElementById("caeser").onclick = function(){
    var mono = document.getElementById("mono");
    var caeser = document.getElementById("caeser");
    form.elements['Shift'].value = "";
    form.elements['Shift'].placeholder = "Enter the Shift you need";
    document.getElementById('shiftlabel').innerHTML = "Shift";
  
    mono.className = "link";
    caeser.className ="selected";
}

/*Switch between Encryption and Decryption*/
function switchmode(element){
    if(element.checked){
        form.elements['Plaintext'].placeholder = "Enter your Ciphertext";
        form.elements['Ciphertext'].placeholder = "Your Plaintext will appear Here";
        form.elements['submit'].innerHTML = "Decrypt";
        document.getElementById('ciphertextlabel').innerHTML = "Plaintext";
        document.getElementById('plaintextlabel').innerHTML = "Ciphertext";
  
    }else{
        form.elements['Plaintext'].placeholder = "Enter your Plaintext";
        form.elements['Ciphertext'].placeholder = "Your Ciphertext will appear Here";
        form.elements['submit'].innerHTML = "Encrypt";
        document.getElementById('ciphertextlabel').innerHTML = "Ciphertext";
        document.getElementById('plaintextlabel').innerHTML = "Plaintext";
    }
}

function showMessage(message) {
	const msg = document.getElementById('error');
	msg.innerHTML = message;
}

function hideMessage() {
	// get the small element and set the message
	const msg = document.getElementById('error');
	msg.innerHTML = "";
	// update the class for the input
}


function validateShift(shift){
    console.log(Number.isNaN(shift));
    for(var i=0; i<shift.length; i++){
        if(Number.isNaN(parseInt(shift[i]))){      
            showMessage("Please enter a number");
        }else{
            hideMessage();
        }
    } 
}

function validateKey(key){
    if(key.length!=26){
        showMessage("Please enter all 26 letters");
    }else{
        hideMessage();
    }
}