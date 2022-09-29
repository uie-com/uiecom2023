const eventRetrieveal = () => {
  const millisecondsInDay = 86400000;
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
  var days =
    Math.floor((new Date(nearestEvent["dtstart"]) - now) / millisecondsInDay) +
    1;
  document.getElementById("title").innerHTML = `${nearestEvent["summary"]}`;
  document.getElementById("date").innerHTML = `${new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "full",
      timeStyle: "long",
    }
  ).format(new Date(nearestEvent["dtstart"]))}`;
  document.getElementById("countdown").innerHTML =
    `Starts in ${days} ` + (days > 1 ? "days" : "day");

  document.getElementById("countdown-mobile").innerHTML =
    `Starts in ${days} ` + (days > 1 ? "days" : "day");
};

window.onload = (_evt) => {
  eventRetrieveal();
};
