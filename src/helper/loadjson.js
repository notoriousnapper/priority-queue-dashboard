// ref: https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript

function init() {
    loadJSON(function (response) {
        // Parse JSON string into object
        var actual_JSON = JSON.parse(response);
    });
}

function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'my_data.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

const printConsoleTest = () => {
    loadJSON(function(response) {
        // Parse JSON string into object
        console.log("response" + response);
        var actual_JSON = JSON.parse(response);
        console.log(actual_JSON);
    });
}

export {
    printConsoleTest
}
