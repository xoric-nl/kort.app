'use strict';

// Fix for student class
var studentClass = document.querySelector("#scrollBox > div.contentBox > div.contThird.middleRight > table > tbody > tr:nth-child(4) > td:nth-child(2)");
if (studentClass != null && studentClass.innerText !== "") {
  var className = studentClass.innerText;
  var partClassName = className.split(" - ")[0];
  var lastUrlPart = "/app/groep/Groepkaart/" + partClassName;

  studentClass.innerHTML = "<a href='" + lastUrlPart + "'>" + className + "</a>";
}

// Fix for student mail
var studentMail  = document.querySelector("#scrollBox > div.contentBox > div.contThird.middleLeft > table > tbody:nth-child(5) > tr > td:nth-child(2)");
if (studentMail != null && studentMail.innerText !== "") {
  var mailAddress = studentMail.innerText;

  studentMail.innerHTML = "<a href='mailto:" + mailAddress + "' target='_blank'>" + mailAddress + "</a>";
}

// Adds link to the students address
var studentAddress  = document.querySelector("#scrollBox > div.contentBox > div.contThird.middleLeft > table > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2)");
var studentCity     = document.querySelector("#scrollBox > div.contentBox > div.contThird.middleLeft > table > tbody:nth-child(2) > tr:nth-child(2) > td:nth-child(2)");

if ((studentAddress != null && studentAddress.innerText !== "") &&
    (studentCity != null && studentCity.innerText !== "")) {
  var studentAddressContent = studentAddress.innerText;
  var studentCityContent = studentCity.innerHTML;
  var studentPostal = studentCityContent.split("&nbsp;");

  var mapsUrl = "https://www.google.com/maps/place/" + studentAddressContent+ ", " + studentPostal[0] + studentPostal[1] + " " + studentPostal[3];
  studentAddress.innerHTML = "<a href='" + mapsUrl + "' target='_blank'>" + studentAddressContent + "</a>";
}