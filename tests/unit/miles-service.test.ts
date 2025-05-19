import { generateMilesForTrip, getMilesFromCode } from "../../src/services/miles-service";
import * as milesRepository from "../../src/repositories/miles-repository";
import * as milesCalculatorService from "../../src/services/miles-calculator-service";
import { faker } from "@faker-js/faker";
import { createNewTrip } from "../factories/miles-factory";

beforeEach(() => {
  jest.clearAllMocks();
});

// milesRouter.get("/miles/:code", recoverMiles);
describe("GET /miles/:code", () => {

  it("should return miles", async () => {
    const {trip, miles: milesTest} = createNewTrip();
    
    jest.spyOn(milesRepository, "findMiles").mockResolvedValueOnce({
      id: 1,
      code: trip.code,
      miles: milesTest,
    });
    
    const miles = await getMilesFromCode(trip.code);
    expect(miles).toEqual({
      id: 1,
      code: trip.code,
      miles: milesTest,
    });
    expect(milesRepository.findMiles).toHaveBeenCalled();
  });

  it("should return not_found and a message", async () => {
    const code = faker.string.alphanumeric();

    jest.spyOn(milesRepository, "findMiles").mockResolvedValueOnce(null);
    
    const findMiles = getMilesFromCode(code);
    
    expect(findMiles).rejects.toEqual({
      type: "not_found",
      message: `Miles not found for code ${code}`,
    });
  });
});

// milesRouter.post("/miles", validateSchema(milesSchema), generateMiles);
describe("POST /miles", () => {
  it("should return miles", async () => {
    const {trip, miles: milesTest} = createNewTrip();

    jest.spyOn(milesRepository, "findMiles").mockResolvedValueOnce(null);
    jest.spyOn(milesCalculatorService, "calculateMiles").mockReturnValueOnce(milesTest);
    jest.spyOn(milesRepository, "saveMiles").mockResolvedValueOnce({
      id: 1,
      code: trip.code,
      miles: milesTest,
    });

    const miles = await generateMilesForTrip(trip);

    expect(miles).toBe(milesTest);

    expect(milesRepository.findMiles).toHaveBeenCalled();
    expect(milesRepository.saveMiles).toHaveBeenCalled();

    expect(milesCalculatorService.calculateMiles).toHaveBeenCalled();
    expect(milesCalculatorService.calculateMiles).toHaveBeenCalledWith(trip);
  });

  it("should return conflict error and a message", async () => {
    const {trip, miles: milesTest} = createNewTrip();
    
    jest.spyOn(milesRepository, "findMiles").mockResolvedValueOnce({
      id: 1,
      code: trip.code,
      miles: milesTest,
    });

    const existingMiles = generateMilesForTrip(trip);
    expect(existingMiles).rejects.toEqual({
      type: "conflict",
      message: `Miles already registered for code ${trip.code}`,
    });
  });
});