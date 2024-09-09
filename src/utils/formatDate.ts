const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata"
}

export const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-EN", options).format(date)
}