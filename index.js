const eventRetrieveal = () => {
  const millisecondsInDay = 86400000;
  const millisecondsIn7H = 25200000;
  const millisecondsin1H = 3600000;
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

  const diffInMs = (new Date(nearestEvent["dtstart"]) - now) 

  const numDays =
    Math.floor((new Date(nearestEvent["dtstart"]) - now) / millisecondsInDay) +
    1;
  document.getElementById("title").innerHTML = `${nearestEvent["summary"]}`;
  document.getElementById("date").innerHTML = `${new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "full",
      timeStyle: "short",
    }
  ).format(new Date(nearestEvent["dtstart"]))}`;

 const numHours = Math.floor(diffInMs / millisecondsin1H)
  if (diffInMs < millisecondsIn7H) {
    if ((numHours + 1) > 1)  {
      document.getElementById("countdown").innerHTML = `Starts in ${numHours + 1} hours`
      document.getElementById("countdown-mobile").innerHTML = `Starts in ${numHours + 1} hours`
    }
    else{
      document.getElementById("countdown").innerHTML = `Starts in ${numHours + 1} hour`
      document.getElementById("countdown-mobile").innerHTML = `Starts in ${numHours + 1} hour`
    }
  }

  else{
    document.getElementById("countdown").innerHTML =
    `Starts in ${numDays} ` + (numDays > 1 ? "days" : "day");
    document.getElementById("countdown-mobile").innerHTML =
    `Starts in ${numDays} ` + (numDays > 1 ? "days" : "day");
  }
  
};

window.onload = (_evt) => {
  eventRetrieveal();
};
