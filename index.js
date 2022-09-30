const eventRetrieveal = () => {
  const millisecondsInDay = 86400000,
    millisecondsIn7H = 25200000,
    millisecondsin1H = 3600000,
    millisecondsinMin = 60000;

  const now = new Date();
  //no value edge case
  let nearestEvent = null;

  for (const event of calData) {
    if (Date.parse(event["dtend"]) > now) {
      if (
        nearestEvent == null ||
        Date.parse(nearestEvent["dtstart"]) > Date.parse(event["dtstart"])
      ) {
        nearestEvent = event;
      }
    }
  }
 
  const timeTillStart = new Date(nearestEvent["dtstart"]) - now;
  const dateOptions = {
    dateStyle: "full",
    timeStyle: "short",
  };

  document.getElementById("title").innerHTML = `${nearestEvent["summary"]}`;
  document.getElementById("date").innerHTML = `${new Intl.DateTimeFormat(
    "en-US",
    dateOptions
  ).format(new Date(nearestEvent["dtstart"]))}`;

  const numDays = Math.floor(timeTillStart / millisecondsInDay) + 1;
  const numHours = Math.floor(timeTillStart / millisecondsin1H) + 1;
  const numMins = Math.floor(timeTillStart / millisecondsinMin) + 1;

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
