export const formatDate = (date, timeZone = "UTC") => {
  if (!date || isNaN(Date.parse(date))) return "";

  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })
      .format(new Date(date))
      .replace(/(\w{3}) (\d+) ?, (\d{4}),/, "$1 $2, $3 |");
};
