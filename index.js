//TODO 
//1. Make ICS file / Outlook link
//2. Make a way to retrieve our newest events without needing to do it ourselves.

//Methods
//Airtable (We will go ahead with this one! API here we come)

//Issues
//Current events are one hour ahead
var dotenv = require('dotenv');
dotenv.config()
var Airtable = require('airtable')

Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY })
const base = Airtable.base(process.env.AIRTABLE_BASE);

const eventRetrieveal = () => {

  let airtableData = []

  base('Table 1').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 11,
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function (record) {
      airtableData.push({
        "dtstart": `${record.get('Start Date')}`,
        "dtend": `${record.get('End Date')}`,
        "description": `${record.get('Event Summary')}`,
        "location": `${record.get('Event Link')}`,
        "image": `${record.get('Image')}`,
        "summary": `${record.get('Title')}`
      })
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

  }, function done(err) {
    if (err) { console.error(err); return; }
  });

  const millisecondsInDay = 86400000,
    millisecondsIn7H = 25200000,
    millisecondsin1H = 3600000,
    millisecondsinMin = 60000;

  const now = new Date();
  //no value edge case
  let nearestEvent = null;

  //Grabbing the events from calendar.js
  for (const currEvent of airtableData) {
    //Checks if the event has ended already
    if (Date.parse(currEvent["dtend"]) > now) {
      //Checks if the next event start is greater than the current event
      if (
        nearestEvent == null ||
        Date.parse(nearestEvent["dtstart"]) > Date.parse(currEvent["dtstart"])
      ) {
        //If our current event has ended and our next event start date is close then it will 
        // be assigned as our current event
        nearestEvent = currEvent;
      }
    }
  }

  const timeTillStart = new Date(nearestEvent["dtstart"]) - now,
    dateOptions = {
      dateStyle: "full",
      timeStyle: "short",
    };

  document.getElementById("title").innerHTML = `${nearestEvent["summary"]}`;
  document.getElementById("date").innerHTML = `${new Intl.DateTimeFormat(
    "en-US",
    dateOptions
  ).format(new Date(nearestEvent["dtstart"]))}`;

  //Getting the year, month, day, hour for the nearest event
  let eventStartFullYear = new Date(nearestEvent["dtstart"]).getFullYear();
  let eventStartMonth = parseInt(new Date(nearestEvent["dtstart"]).getMonth()) + 1;
  let eventStartDay = new Date(nearestEvent["dtstart"]).getDate();
  let eventStartHour = parseInt(new Date(nearestEvent["dtstart"]).getHours()) + 4;
  let eventEndHour = parseInt(new Date(nearestEvent["dtend"]).getHours()) + 4;

  document.getElementById("google-calendar").href = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${nearestEvent["summary"]}&dates=${eventStartFullYear}${eventStartMonth}${eventStartDay}T${eventStartHour}0000Z/${eventStartFullYear}${eventStartMonth}${eventStartDay}T${eventEndHour}0000Z&details=https://us02web.zoom.us/j/88292728501?pwd%3DY0tBR25GbFF4MUxhWnd5MFI5S3hNUT09&location=https://us02web.zoom.us/j/88292728501?pwd=Y0tBR25GbFF4MUxhWnd5MFI5S3hNUT09&trp=true`

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
