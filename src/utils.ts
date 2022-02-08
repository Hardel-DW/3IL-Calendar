const sleep = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Turn a date into a number of the week.
 * @param {Date} date - The date to convert. 
 * @returns {number} The number of the week.
 */
 export function getWeekNumber(date: Date): number {
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));

    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = <number>Math.ceil((((date.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);

    return weekNo;
}

export default sleep;