const ROOT_ENDPOINT = "https://lab4.ryanleung.ca/api/definitions/";
const VALID_WORD = new RegExp("^[A-Za-z'-]+$");


function submitWord() {
    let data = getUserInput();
    if (data) {
        postWord(data, ROOT_ENDPOINT);
    }
}

function getUserInput() {
    let word = document.getElementById("word").value;
    let definition = document.getElementById("definition").value;
    validateUserInput();

    return JSON.stringify({
        word: word,
        definition: definition
    });
}

function validateUserInput(word, definition) {
    if (!VALID_WORD.test(word)) {
        requestFailed("Invalid word");  
        return false;
    }

    if (!VALID_WORD.test(definition)) {
        requestFailed("Invalid definition");
        return false;
    }

    return true;
}

function searchWord() {
    let word = document.getElementById("searchWord").value;
    if (!VALID_WORD.test(word)) {
        document.getElementById("searchResult").value = "Invalid search word";
        return;
    }

    getUrl= ROOT_ENDPOINT + "?word=" + word;

    fetch(getUrl)
    .then(response => 
        response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(response => {
        if (response.status == 200) {
            document.getElementById("searchResult").value = `term: ${response.data.word}
definition: ${response.data.definition}`;
        } else if (response.status == 404) {
            document.getElementById("searchResult").value = `Request# ${response.data.requestCount}, word '${word}' not found!`;
        }
    })); 
}

function postWord(data, url) {
    let iterator = fetch(url, {
        method : "POST",
        body: data
    });

    iterator
    .then(response => 
        response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(response => {
        if (response.status == 200) {
            requestSuccess(response.data.message, response.data.data, response.data.requestCount);
        } else {
            requestFailed(response.data.message);
        }
    }));
}

function requestFailed(msg) {
    cleanUserScreen();
    document.getElementById("response").innerHTML = msg;
}

function requestSuccess(msg, data, count) {
    cleanUserScreen();
    document.getElementById("response").innerHTML = `
    <p>Request # ${count}</p>

    <p>${msg}</p>

    <p>${data}</p>
    `;
}

function cleanUserScreen() {
    document.getElementById("word").value = "";
    document.getElementById("definition").value = "";
}