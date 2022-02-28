const READ_ENDPOINT = "https://lab5.ryanleung.ca/api/read";


function loadScores() {
    fetch(READ_ENDPOINT)
    .then(response => 
        response.json().then(data => ({
            data: data,
            status: response.status
        })
    ).then(response => {
        if (response.status == 200) {
            let result = "";

            let scores = response.data.data;
            for (const scoreObj in scores) {
                result += scores[scoreObj].name + ": " + scores[scoreObj].score + "<br>";
            }
            document.getElementById("result").innerHTML = `${result}`;
        } else {
            document.getElementById("result").innerHTML = `Error ${response.status}: ${response.data.message}`;
        }
    })); 
}
