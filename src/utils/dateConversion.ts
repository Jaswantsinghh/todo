export const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const suffix = getDaySuffix(day);
    return `${day}${suffix} ${month}`;
}

// Function to get the day suffix (e.g., 'st', 'nd', 'rd', 'th')
const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) {
        return 'th';
    }
    const lastDigit = day % 10;
    switch (lastDigit) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}