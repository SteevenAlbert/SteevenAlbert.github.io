/*------------------------*/
/*       The Ciphers      */
/*------------------------*/

//-------------- Ceaser Cipher -------------------//
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
//---------------------------------------------------------//

//-------------- Monoalphabetic Cipher -------------------//
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
    key = key.toUpperCase();
    for(let i = 0; i < key.length; i++){
        map.set(key[i],i);
    }

    let plaintext = ""
   
    ciphertext = ciphertext.toUpperCase();
    for(let i = 0; i<ciphertext.length; i++){
        if(removespace==true && ciphertext[i].charCodeAt(0) == 32){
            continue;
        }else if(ciphertext[i].charCodeAt(0) == 32){
            plaintext += " ";
            continue;
        }
        plaintext+= String.fromCharCode(map.get(ciphertext[i])+65); 
    }
    return plaintext;
}
//---------------------------------------------------------//

//------------------- Playfair Cipher --------------------//
function encryptPlayfair(plaintext, key, removespace, operation){
    let matrix = printMatrix(key);
    plaintext = preparePlaintext(plaintext);
    ciphertext = "";
    for(var k=0; k<plaintext.length; k=k+2){
        var firstLetter = plaintext[k] 
        var secondLetter= plaintext[k+1];

        var firstLetterIndex = null, secondLetterIndex = null;
        for(var i=0; i<5; i++){
            for(var j=0; j<5; j++){
                if(firstLetter == "I" || firstLetter =="J"){
                    firstLetter = "I"
                }
                if(secondLetter == "I" || secondLetter =="J"){
                    secondLetter = "I";
                }
                if(matrix[i][j]==firstLetter){
                    firstLetterIndex = [i,j];
                   
                }if(matrix[i][j]==secondLetter){
                    secondLetterIndex = [i,j]; 
                }
            } 
         
        }   
        //handling same row or column
        var rowColumnDirection;
        if(operation=="encrypt"){
            rowColumnDirection = 1;
        }else if(operation=="decrypt"){
            rowColumnDirection = -1;
        }
    
        if(firstLetterIndex[0] == secondLetterIndex[0]){
            ciphertext+= matrix[secondLetterIndex[0]][mod(firstLetterIndex[1]+rowColumnDirection,5)];
            ciphertext+= matrix[firstLetterIndex[0]][mod(secondLetterIndex[1]+rowColumnDirection,5)];
        }else if(firstLetterIndex[1] == secondLetterIndex[1]){
            ciphertext+= matrix[mod(firstLetterIndex[0]+rowColumnDirection, 5)][secondLetterIndex[1]];
            ciphertext+= matrix[mod(secondLetterIndex[0]+rowColumnDirection,5)][firstLetterIndex[1]];           
        }else{
            ciphertext+= matrix[firstLetterIndex[0]][secondLetterIndex[1]];
            ciphertext+= matrix[secondLetterIndex[0]][firstLetterIndex[1]];
        }
       
    }
    ciphertext = ciphertext.toLowerCase();
    return ciphertext;
}

//pPlayfair helper methods
function createKeyMatrix(key){
    key = key.toUpperCase();
    key = removeDuplicate(key)
  
    var matrix = new Array(5);
    var ijexists = false;

    // Loop to create 2D array using 1D array
    for (var i = 0; i < matrix.length; i++) {
        matrix[i] = new Array(5);
    }
    var letter = 0;
  
    // Loop to initialize 2D array with Key letters.
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
            if(key.length>letter){
                if(key[letter]=='I' || key[letter]=='J'){
                    if(ijexists==false){
                        matrix[i][j] = "I";     
                        letter++;     
                        ijexists=true;
                    }else{
                        matrix[i][j] = key[++letter];
                    }         
                }else{
                    matrix[i][j] = key[letter++]; 
                }
                           
            }else{
                i=5;
                j=5;
            }
        }
    }
    
    var startingRow = Math.floor(key.length/5);
    var startingColumn = key.length%5;
    letter = 65;
    // Loop to initialize 2D array with the rest of the letters.
    for (var i = startingRow; i < 5; i++) {
        for (var j = startingColumn; j < 5; j++) {       
            //check that the letter doesn't exist in the key
            while(key.includes(String.fromCharCode(letter))){
                letter++;
            }

            if(String.fromCharCode(letter)=='I' || String.fromCharCode(letter)=='J'){
                if(ijexists==false){
                    matrix[i][j] = "I";
                    ijexists=true;
                }else{
                    if(String.fromCharCode(letter)=='I'){
                        letter+=2;
                        matrix[i][j] = String.fromCharCode(letter);
                    }else{
                        matrix[i][j] = String.fromCharCode(++letter);
                    }
                }         
            }else{
                matrix[i][j] = String.fromCharCode(letter); 
            }
           letter++;
        }
        startingColumn = 0;
    }
    return matrix;
}

function printMatrix(key){
    let Matrix = createKeyMatrix(key);
    var table = document.getElementById("tbody");
    table.innerHTML = "";
    var rowNode = document.createElement("tr");
    for(var i=0; i<5; i++){
        for(var j=0 ; j<5; j++){
            var textNode = document.createTextNode(Matrix[i][j]);
            var cellNode = document.createElement("td");
            cellNode.appendChild(textNode);
            rowNode.appendChild(cellNode);
        }
        table.appendChild(rowNode);
        var rowNode = document.createElement("tr");
    }
    return Matrix;
}

function removeDuplicate(key){
    var result ="";
    var ijexists= false;
    for(var i=0; i<key.length; i++){
        if(!result.includes(key[i])){
            if((key[i]=="I" || key[i]=="J") && ijexists==false){
                result +=key[i];
                ijexists = true;
            }else if(key[i]!="I" && key[i]!="J"){
                result +=key[i];
            }
        }
    }

    return result;
}

function preparePlaintext(plaintext){
    var plaintextResult ="";
    plaintext = plaintext.toUpperCase();

    for(var i=0; i<plaintext.length; i++){
    
        if(plaintext[i] == plaintext[i+1] || (plaintext[i] == 'J' && plaintext[i+1] == 'I') ||(plaintext[i] == 'I' && plaintext[i+1] == 'J')){
            plaintextResult += plaintext[i] + 'X';

        }else{
            if(i+1 >= plaintext.length){
                plaintextResult += plaintext[i] + 'X';
            }else{
                plaintextResult += plaintext[i] + plaintext[i+1];
            }
            i++;
        }
    }

    //plaintextResult = plaintextResult.replace(/J/g, "I");

    return plaintextResult;
}

function mod(n, m) {
    return ((n % m) + m) % m;
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
            validateInputMono(key);
            form.elements['Ciphertext'].value = encryptMonoalphabetic(text, key, removespace);
        }
        else if(document.getElementById("caeser").className=="selected"){
            const shift = form.elements['Shift'].value;
            validateShift(shift);
            form.elements['Ciphertext'].value = encryptCaeser(text, parseInt(shift), removespace);
        } else if(document.getElementById("playfair").className=="selected"){
            const key = form.elements['Shift'].value;
            validateInput(key, text);
            form.elements['Ciphertext'].value = encryptPlayfair(text, key, removespace, "encrypt");
        }
    }else{
        if(document.getElementById("mono").className=="selected"){
            const key = form.elements['Shift'].value; 
            validateInputMono(key);
            form.elements['Ciphertext'].value = decryptMonoalphabetic(text, key, removespace);
        }
        else if(document.getElementById("caeser").className=="selected"){
            const shift = form.elements['Shift'].value;
            validateShift(shift);
            form.elements['Ciphertext'].value = decryptCaeser(text, parseInt(shift), removespace);
        }else if(document.getElementById("playfair").className=="selected"){
            const key = form.elements['Shift'].value;
            form.elements['Ciphertext'].value = encryptPlayfair(text, key, removespace, "decrypt");
        }
    }
}

/* Switching to Monoalphabetic Cipher */
document.getElementById("mono").onclick = function(){
    var mono = document.getElementById("mono");
    var caeser = document.getElementById("caeser");
    form.elements['Shift'].value = "QWERTYUIOPASDFGHJKLZXCVBNM";
    form.elements['Shift'].placeholder = "Enter the substitution alphabet";
    form.elements['Shift'].setAttribute("onkeydown", "");
    document.getElementById('shiftlabel').innerHTML = "Subtitution Alphabet";
    document.getElementById("matrixdiv").style.display = "none";
    mono.className = "selected";
    caeser.className ="unselected";
    playfair.className = "unselected";
}

/* Switching to Caeser Cipher */
document.getElementById("caeser").onclick = function(){
    var mono = document.getElementById("mono");
    var caeser = document.getElementById("caeser");
    form.elements['Shift'].value = "";
    form.elements['Shift'].placeholder = "Enter the Shift you need";
    form.elements['Shift'].setAttribute("onkeydown", "");
    document.getElementById('shiftlabel').innerHTML = "Shift";
    document.getElementById("matrixdiv").style.display = "none";
    
    mono.className = "unselected";
    caeser.className ="selected";
    playfair.className = "unselected";

}

/* Switching to Playfair Cipher */
document.getElementById("playfair").onclick = function(){
    var playfair = document.getElementById("playfair");
    var caeser = document.getElementById("caeser");
    var mono = document.getElementById("mono");
    form.elements['Shift'].value = "";
    form.elements['Shift'].placeholder = "Enter the Key";
    form.elements['Shift'].setAttribute("onkeyup", "printMatrix(this.value)");
   //onkeydown="printMatrix(this.value)""
    document.getElementById('shiftlabel').innerHTML = "Key";
    document.getElementById("matrixdiv").style.display = "block";
    printMatrix("");
    playfair.className = "selected";
    caeser.className ="unselected";
    mono.className ="unselected";
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
    for(var i=0; i<shift.length; i++){
        if(Number.isNaN(parseInt(shift[i]))){      
            showMessage("Please enter a number");
        }else{
            hideMessage();
        }
    } 
}

function validateInputMono(key, plaintext){
    plaintext = plaintext || "";

    if(key.length!=26){
        showMessage("Please enter all 26 letters");
    }else{
        hideMessage();
    }
}

function validateInput(key, plaintext){
    plaintext = plaintext || "";

    for(var i=0; i<key.length; i++){
        if(!/^[a-zA-Z]+$/.test(key[i])){
            showMessage("Please enter alphabetic characters only");
        }else{
            hideMessage();
        } 
    }

    for(var i=0; i<plaintext.length; i++){
        if(!/^[a-zA-Z]+$/.test(key[i])){
            showMessage("Please enter alphabetic characters only");
            console.log("Error!");
        }else{
            hideMessage();
        }
    }
}