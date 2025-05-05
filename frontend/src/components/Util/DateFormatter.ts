const DateFormatter = (date: string | Date): string => {
    let parsedDate: Date;

    if (typeof date === "string") {
        parsedDate = new Date(date);
    } else {
        parsedDate = date;
    }

    if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
        return "Data inválida";
    }

    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const year = parsedDate.getFullYear();
    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default DateFormatter;
