const eventRetrieveal = () => {
 
  const millisecondsInDay = 86400000,
    millisecondsIn7H = 25200000,
    millisecondsin1H = 3600000,
    millisecondsinMin = 60000;

  const now = new Date();
  //no value edge case
  let nearestEvent = null;

  for (const event of calData) {
    if (
      Date.parse(event["dtstart"]) > now &&
      (nearestEvent == null ||
        Date.parse(nearestEvent["dtstart"]) > Date.parse(event["dtstart"]))
    ) {
      nearestEvent = event;
    }
  }

  const diffInMs = new Date(nearestEvent["dtstart"]) - now;

  document.getElementById("title").innerHTML = `${nearestEvent["summary"]}`;
  document.getElementById("date").innerHTML = `${new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "full",
      timeStyle: "short",
    }
  ).format(new Date(nearestEvent["dtstart"]))}`;

  const numDays =
    Math.floor((new Date(nearestEvent["dtstart"]) - now) / millisecondsInDay) +
    1;
  const numHours = Math.floor(diffInMs / millisecondsin1H) + 1;
  const numMins = Math.floor(diffInMs / millisecondsinMin) + 1;

  if (diffInMs < millisecondsIn7H && diffInMs > millisecondsin1H) {
    if (numHours > 1) {
      document.getElementById(
        "countdown"
      ).innerHTML = `Starts in ${numHours} hours`;
      document.getElementById(
        "countdown-mobile"
      ).innerHTML = `Starts in ${numHours} hours`;
    } else {
      document.getElementById(
        "countdown"
      ).innerHTML = `Starts in ${numHours} hour`;
      document.getElementById(
        "countdown-mobile"
      ).innerHTML = `Starts in ${numHours} hour`;
    }
  } else if (diffInMs < millisecondsin1H) {
    if (numMins > 1) {
      document.getElementById(
        "countdown"
      ).innerHTML = `Starts in ${numMins} minutes`;

      document.getElementById(
        "countdown-mobile"
      ).innerHTML = `Starts in ${numMins} minutes`;
    } else {
      document.getElementById("countdown").innerHTML = "Starts in 1 minute";
      document.getElementById("countdown-mobile").innerHTML =
        "Starts in 1 minute";
    }
  } else {
    document.getElementById("countdown").innerHTML =
      `Starts in ${numDays} ` + (numDays > 1 ? "days" : "day");
    document.getElementById("countdown-mobile").innerHTML =
      `Starts in ${numDays} ` + (numDays > 1 ? "days" : "day");
  }
};

window.onload = (_evt) => {
  eventRetrieveal();
};
