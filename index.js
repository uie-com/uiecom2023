//TODO 
//1. Make ICS file / Outlook link
//2. Make a way to retrieve our newest events without needing to do it ourselves.

//Methods
//Airtable (We will go ahead with this one! API here we come)

//Issues
//Current events are one hour ahead
import { AIRTABLE_API_KEY, AIRTABLE_BASE } from './secret.js'

async function eventRetrieveal() {

  let airtableData = [];

  let response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/Events?api_key=${AIRTABLE_API_KEY}`);
  let text = await response.text();

  if (text.endsWith(",")) text = text.slice(0, -1);

  airtableData = JSON.parse(text);

  const millisecondsInDay = 86400000,
    millisecondsIn7H = 25200000,
    millisecondsin1H = 3600000,
    millisecondsinMin = 60000;

  const now = new Date();
  //no value edge cases
  let nearestEvent = null;

  //Grabbing the events from calendar.js
  for (let i = 0; i < airtableData.records.length; i++) {
    //Checks if the event has ended already
    if (Date.parse(airtableData.records[i].fields["Start Date"]) > now) {
      //Checks if the next event start is greater than the current event
      nearestEvent = airtableData.records[i];
    }
  }

  const timeTillStart = new Date(nearestEvent.fields["Start Date"]) - now,
    dateOptions = {
      dateStyle: "full",
      timeStyle: "short",
    };

  document.getElementById("title").innerHTML = `${nearestEvent.fields["Title"]}`;
  document.getElementById("date").innerHTML = `${new Intl.DateTimeFormat(
    "en-US",
    dateOptions
  ).format(new Date(nearestEvent.fields["Start Date"]))}`;
  document.getElementById("inner-text").innerHTML = `${nearestEvent.fields["Event Summary"]}`
  //Getting the year, month, day, hour for the nearest event
  let eventStartFullYear = new Date(nearestEvent.fields["Start Date"]).getFullYear();
  let eventStartMonth = parseInt(new Date(nearestEvent.fields["Start Date"]).getMonth()) + 1;
  let eventStartDay = new Date(nearestEvent.fields["Start Date"]).getDate();
  if (eventStartDay < 10) {
    eventStartDay = `0` + new Date(nearestEvent.fields["Start Date"]).getDate();
  } else {
    new Date(nearestEvent.fields["Start Date"]).getDate();
  }
  let eventStartHour = parseInt(new Date(nearestEvent.fields["Start Date"]).getHours()) + 5;
  let eventEndHour = parseInt(new Date(nearestEvent.fields["End Date"]).getHours()) + 5;

  document.getElementById("google-calendar").href = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${nearestEvent.fields["Title"]}&dates=${eventStartFullYear}${eventStartMonth}${eventStartDay}T${eventStartHour}0000Z/${eventStartFullYear}${eventStartMonth}${eventStartDay}T${eventEndHour}0000Z&details=${nearestEvent.fields["Event Summary"]}&location=https://us02web.zoom.us/j/88292728501?pwd=Y0tBR25GbFF4MUxhWnd5MFI5S3hNUT09&trp=true`

  const numDays = Math.floor(timeTillStart / millisecondsInDay) + 1,
    numHours = Math.floor(timeTillStart / millisecondsin1H) + 1,
    numMins = Math.floor(timeTillStart / millisecondsinMin) + 1;

  if (
    timeTillStart < millisecondsIn7H &&
    timeTillStart > millisecondsin1H &&
    timeTillStart > 0
  ) {
    if (numHours > 1) {
      document.getElementById("countdown").innerHTML = document.getElementById(
        "countdown-mobile"
      ).innerHTML = `Starts in ${numHours} hours`;
    }
  } else if (timeTillStart < millisecondsin1H && timeTillStart > 0) {
    if (numMins > 1) {
      document.getElementById("countdown").innerHTML = document.getElementById(
        "countdown-mobile"
      ).innerHTML = `Starts in ${numMins} minutes`;
    } else {
      document.getElementById("countdown").innerHTML = document.getElementById(
        "countdown-mobile"
      ).innerHTML = "Starts in 1 minute";
    }
    //When the event is happening it will say it's in progress.
  } else if (
    now >= Date.parse(nearestEvent["dtstart"]) &&
    now <= Date.parse(nearestEvent["dtend"])
  ) {
    document.getElementById("countdown").innerHTML = document.getElementById(
      "countdown-mobile"
    ).innerHTML = "Currently in progress.";
  } else {
    document.getElementById("countdown").innerHTML = document.getElementById(
      "countdown-mobile"
    ).innerHTML = `Starts in ${numDays} ` + (numDays > 1 ? "days" : "day");
  }
};

window.onload = (_evt) => {
  eventRetrieveal();
};
