class DateFormatter {
    constructor(date) {
        this.date = new Date(date);
    }

    toDateTime() {
        const day = String(this.date.getDate()).padStart(2, "0");
        const month = String(this.date.getMonth() + 1).padStart(2, "0"); 
        const year = this.date.getFullYear();
        const hours = String(this.date.getHours()).padStart(2, "0");
        const minutes = String(this.date.getMinutes()).padStart(2, "0");

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
}

export default DateFormatter;