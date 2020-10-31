var count = 0;
var myVar = setInterval(myTimer, 1000);
function myTimer() {
    count++;
    var d = new Date();
    var t = d.toLocaleTimeString();
    document.getElementById("demo").innerHTML = t;
    $("#counter").html(count);
}