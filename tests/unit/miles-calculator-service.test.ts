import { createNewTrip } from "../factories/miles-factory";
import { calculateMiles } from "services/miles-calculator-service";

describe("test miles calculator service", () => {
  it("should return 0 if miles = true", () => {
    const trip = createNewTrip({ miles: true });
    const miles = calculateMiles(trip);

    expect(miles).toEqual(0);
  });
});