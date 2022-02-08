/**
 * Add new method to Date prototype
 */
interface Date {
    addDays(days: number): Date;
    isToday(): boolean;
    clone(): Date;
    isAnotherMonth(date: Date): boolean;
    isWeekend(): boolean;
    isSameDate(date: Date): boolean;
    getWeekNumber(): number;
    getWeekYear(): number;
}

/**
 * @param {number} days - the number of days to add to the date.
 * @returns {Date} - returns a new date with the given number of days added.
 */
 Date.prototype.addDays = function(days: number): Date {
    if (!days)  {
        return this;
    }

    let date: Date = this;
    date.setDate(date.getDate() + days);
 
    return date;
 };
 
 /**
  * @returns {boolean} - return true if the date is today, false otherwise.
  */
 Date.prototype.isToday = function(): boolean {
    let today = new Date();
    return this.isSameDate(today);
 };
 
 /**
  * @returns {Date} - returns a clone of the date.
  */
 Date.prototype.clone = function(): Date {
    return new Date(+this);
 };
 
 /**
  * @param {Date} date - The date to compare.
  * @returns {boolean} - returns true if the date is in another month, false otherwise.
  */
 Date.prototype.isAnotherMonth = function(date: Date): boolean {
    return date && this.getMonth() !== date.getMonth();
 };
 
 /**
  * @returns {boolean} - True if the date is a weekend, false otherwise.
  */
 Date.prototype.isWeekend = function(): boolean {
    return this.getDay() === 0 || this.getDay() === 6;
 };
 
 /**
 * Check if the given date is the same day as the second given date.
 * @param {Date} date - The second date to compare. 
 * @returns {boolean} - True if the two dates are the same day, false otherwise.
 */
 Date.prototype.isSameDate = function(date: Date): boolean {
    return date && this.getFullYear() === date.getFullYear() && this.getMonth() === date.getMonth() && this.getDate() === date.getDate();
 };
 