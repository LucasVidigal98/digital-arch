export class Sensor {
  constructor(
    public readonly id: string,
    public name: string,
    public type: string,
    public readonly createdAt: Date = new Date(),
  ) {}
}
