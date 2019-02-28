var bioHead =   document.getElementsByClassName("biohead");
var text = document.getElementsByClassName("theme");
var tableToggle = "HIDDEN";
function themeBlue() {
    document.getElementById("theme").style.backgroundColor = "#595ee1"; 
    bioHead[0].style.backgroundColor = "#595ee1"; 
    console.log("theme changed");
    document.body.style.backgroundColor = "rgb(247,247,255)";
    document.getElementById("text").style.color = "#595ee1";
    document.getElementById("table").style.color = "#595ee1";
    document.getElementsByClassName("musicText").style.color = "#595ee1";
}
function themeRed() {
    document.getElementById("theme").style.backgroundColor = "#ff5e59";
    bioHead[0].style.backgroundColor = "#ff5e59"; 
    console.log("theme changed");
    document.body.style.backgroundColor = "rgb(255,247,247)";
    document.getElementById("text").style.color = "#ff5e59";
    document.getElementById("table").style.color = "#ff5e59";
    document.getElementsByClassName("musicText").style.color = "#595ee1";
}
function themeGreen() {
    document.getElementById("theme").style.backgroundColor = "#595ee1"; 
    bioHead[0].style.backgroundColor = "#5ef078"; 
    console.log("theme changed");
    document.body.style.backgroundColor = "rgb(247,255,247)";
    document.getElementById("text").style.color = "#5ef078";
    document.getElementById("table").style.color = "#5ef078";
    document.getElementsByClassName("musicText").style.color = "#5ef078";
}
function toggleTable(){
    if(tableToggle === "HIDDEN"){
        document.getElementById("table").style.display = "block";
        tableToggle = "SHOW";
    }
    else{
        document.getElementById("table").style.display = "none";        
        tableToggle = "HIDDEN";
    }
}