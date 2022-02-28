const WRITE_ENDPOINT = "https://lab5.ryanleung.ca/api/write";


function submitScore() {
    let data = getUserInput();
    if (data) {
        postWord(data, WRITE_ENDPOINT);
    }
}

function getUserInput() {
    let name = document.getElementById("name").value;
    let score = document.getElementById("score").value;
    validateUserInput(name, score);

    return JSON.stringify({
        name: name,
        score: parseInt(score)
    });
}

function validateUserInput(name, score) {
    if (!name || !score) {
        requestFailed("Error: name or score not defined");
        return false;
    } 

    const num = Number(score);
    if (!Number.isInteger(num)) {
        requestFailed("Error: score must be a number");
        return false;
    }
    
    return true;
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
            requestSuccess(response.data.message);
        } else {
            requestFailed(response.data.message);
        }
    }));
}

function requestFailed(msg) {
    cleanUserScreen();
    document.getElementById("response").innerHTML = msg;
}

function requestSuccess(msg) {
    cleanUserScreen();
    document.getElementById("response").innerHTML = `<p>${msg}</p>`;
}

function cleanUserScreen() {
    document.getElementById("name").value = "";
    document.getElementById("score").value = "";
}