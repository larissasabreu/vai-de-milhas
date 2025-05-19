import { calculateMiles } from "../../src/services/miles-calculator-service";
import { calculateDistance } from "../../src/services/distances-calculator-service";
import { createNewTripCalc } from "../factories/miles-factory";
import { AffiliateStatus, ServiceClass, Trip } from "../../src/protocols";

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock("../../src/services/distances-calculator-service", () => ({
  calculateDistance: jest.fn(),
}));

describe("calculateMiles", () => {
  // As milhas só são geradas se a viagem não estiver sendo paga com milhas
    it("should return 0 miles = true", () => {
    const trip : Trip = createNewTripCalc();
    trip.miles = true;
    const miles = calculateMiles(trip);
    
    expect(miles).toBe(0);
  });

  // ECONOMIC_PREMIUM, EXECUTIVE e FIRST_CLASS + default
  it("should return miles ServiceClass", () => {
    const trip : Trip = createNewTripCalc();
    (calculateDistance as jest.Mock).mockReturnValue(100);
   
    // - No bonus
    trip.service = ServiceClass.ECONOMIC;
    const milesEconomic = calculateMiles(trip);
    expect(milesEconomic).toBe(100);

    // - Classe Econômica Premium: 1.25x milhas // ECONOMIC_PREMIUM
    trip.service = ServiceClass.ECONOMIC_PREMIUM;
    const milesEconomicPremium = calculateMiles(trip);
    expect(milesEconomicPremium).toBe(125);

    // - Classe Executiva: 1.5x milhas // EXECUTIVE
    trip.service = ServiceClass.EXECUTIVE;
    const milesExecutive = calculateMiles(trip);
    expect(milesExecutive).toBe(150);

    // - Primeira Classe: 2x milhas // FIRST_CLASS
    trip.service = ServiceClass.FIRST_CLASS;
    const milesFirstClass = calculateMiles(trip);
    expect(milesFirstClass).toBe(200);
  });

  // BRONZE, SILVER, GOLD e PLATINUM + default
  it("should return miles AffiliatesStatus", () => {
    const trip : Trip = createNewTripCalc();
    (calculateDistance as jest.Mock).mockReturnValue(100);

    // - No bonus
    trip.affiliate = AffiliateStatus.BRONZE;
    const milesBronze = calculateMiles(trip);
    expect(milesBronze).toBe(100);

    // - Status Prata: 10% de bônus // SILVER
    trip.affiliate = AffiliateStatus.SILVER;
    const milesSilver = calculateMiles(trip);
    expect(milesSilver).toBe(110);

    // - Status Ouro: 25% de bônus // GOLD
    trip.affiliate = AffiliateStatus.GOLD;
    const milesGold = calculateMiles(trip);
    expect(milesGold).toBe(125);

    // - Status Platina: 50% de bônus // PLATINUM
    trip.affiliate = AffiliateStatus.PLATINUM;
    const milesPlatinum = calculateMiles(trip);
    expect(milesPlatinum).toBe(150);
  });

  // Se a data da viagem for no mês de aniversário da Driven (Maio), 
  // o usuário ganha 10% de bônus no valor das milhas finais geradas.
  it("should return birthday bonus", () => {
    const trip : Trip = createNewTripCalc();
    (calculateDistance as jest.Mock).mockReturnValue(100);
    trip.date = "2025-05-22";

    const miles = calculateMiles(trip);
    expect(miles).toBe(110);
  });

  // * bonus
  it("should return bonus miles for FIRST_CLASS, PLATINUM and birthday", () => {
    const trip : Trip = createNewTripCalc();
    (calculateDistance as jest.Mock).mockReturnValue(100);
    
    trip.service = ServiceClass.FIRST_CLASS;
    trip.affiliate = AffiliateStatus.PLATINUM;
    trip.date = "2025-05-22";

    const miles = calculateMiles(trip);
    expect(miles).toBe(330);
  });

    // ECONOMIC, BRONZE e no birthday
  it("should return miles", () => {
    const trip : Trip = createNewTripCalc();
    (calculateDistance as jest.Mock).mockReturnValue(100);

    const miles = calculateMiles(trip);
    expect(miles).toBe(100);
  });
});