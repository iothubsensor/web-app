export class SensorDTO {
    sensorId: string;
    name: string;
    description: string;
    datas: Array<SensorDataDTO>;
    users: Array<number>;

    constructor(sensorId: string, name: string, description: string, datas: Array<SensorDataDTO>, users: Array<number>) {
        this.sensorId = sensorId;
        this.name = name;
        this.description = description;
        this.datas = datas;
        this.users = users;
    }
}

export class SensorDataDTO {
    sensorDataId: number;
    data: number;
    date: number;

    constructor(sensorDataId: number, data: number, date: number) {
        this.sensorDataId = sensorDataId;
        this.data = data;
        this.date = date;
    }
}