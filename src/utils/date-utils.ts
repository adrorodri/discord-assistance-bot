export class DateUtils {
    static getTodayAsString(): string {
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();
        return mm + '-' + dd + '-' + yyyy;
    }

    static isBetween(startTime: string, endTime: string): boolean {
        const from = new Date();
        from.setHours(Number(startTime.split(':')[0]));
        from.setHours(Number(startTime.split(':')[1]));
        const to = new Date();
        to.setHours(Number(endTime.split(':')[0]));
        to.setHours(Number(endTime.split(':')[1]));
        const now = new Date();
        return from.getTime() < now.getTime() && now.getTime() < to.getTime();
    }
}