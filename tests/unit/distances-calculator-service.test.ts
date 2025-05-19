import { calculateDistance, applyHaversineFormula } from "../../src/services/distances-calculator-service";
import { Location } from "../../src/protocols";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("calculateDistance", () => {
  const location1: Location = { lat: 22.9068, long: 43.1729 }; // RJ
  const location2: Location = { lat: 23.5558, long: 46.6396 }; // SP

  it("should return miles", () => {
    const miles = calculateDistance(location1, location2, true);
    expect(miles).toBe(225);
  });

  it("should return km", () => {
    const km = calculateDistance(location1, location2, false);
    expect(km).toBe(361);
  })
});