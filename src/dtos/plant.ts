export class PlantDTO {
    id: string;
    name: string;
    description: string;
    key: string;
    state: boolean;
    online: boolean;
    temperatures: Array<PlantDataDTO>;
    humidities: Array<PlantDataDTO>;
    moistures: Array<PlantDataDTO>;
    light_values: Array<PlantDataDTO>;

    constructor(
      id: string,
      name: string,
      description: string,
      key: string,
      state: boolean,
      online: boolean,
      temperatures: Array<PlantDataDTO>,
      humidities: Array<PlantDataDTO>,
      moistures: Array<PlantDataDTO>,
      light_values: Array<PlantDataDTO>,
    ) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.key = key;
      this.state = state;
      this.online = online;
      this.temperatures = temperatures;
      this.humidities = humidities;
      this.moistures = moistures;
      this.light_values = light_values;
    }
  }

  export class PlantDataDTO {
    value: number;
    timestamp: string;

    constructor(value: number, timestamp: string) {
      this.value = value;
      this.timestamp = timestamp;
    }
  }
