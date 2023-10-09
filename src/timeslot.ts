export class Timeslot {
    readonly startTime: Date;
    readonly endTime: Date;
    readonly startTimeDataId: string;
    readonly endTimeId: string;
    readonly provider: string;

    constructor(startTime: Date, endTime: Date, startTimeDataId: string, provider: string) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.provider = provider;
        this.startTimeDataId = startTimeDataId;
    }
}