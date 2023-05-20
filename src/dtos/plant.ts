export class PlantDTO {
    plantId: string;
    name: string;
    description: string;
    temperatures: Array<PlantDataDTO>;
    humidities: Array<PlantDataDTO>;
    moistures: Array<PlantDataDTO>;
    lightValues: Array<PlantDataDTO>;
    users: Array<number>;
  
    constructor(
      plantId: string,
      name: string,
      description: string,
      temperatures: Array<PlantDataDTO>,
      humidities: Array<PlantDataDTO>,
      moistures: Array<PlantDataDTO>,
      lightValues: Array<PlantDataDTO>,
      users: Array<number>,
    ) {
      this.plantId = plantId;
      this.name = name;
      this.description = description;
      this.temperatures = temperatures;
      this.humidities = humidities;
      this.moistures = moistures;
      this.lightValues = lightValues;
      this.users = users;
    }
  }
  
  export class PlantDataDTO {
    plantDataId: number;
    data: number;
    date: number;
  
    constructor(plantDataId: number, data: number, date: number) {
      this.plantDataId = plantDataId;
      this.data = data;
      this.date = date;
    }
  }
  