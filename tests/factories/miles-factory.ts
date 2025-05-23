import { faker } from '@faker-js/faker';
import { Trip, Location, ServiceClass,  AffiliateStatus } from "../../src/protocols";

// {
// 	code: string;        // código identificador da viagem
// 	origin: {            // coordenadas do ponto de origem
// 		lat: number;
// 		long: number;
// 	},
// 	destination: {       // coordenadas do ponto de destino
// 		lat: number;
// 		long: number;	
// 	},
// 	miles: boolean;       // indica se a viagem foi paga em milhas
// 	plane: string;        // modelo do avião utilizado
// 	service: string;      // classe de serviço utilizada
// 	affiliate: string;    // status de afiliação no programa de milhas
// 	date: string;         // data da viagem no formato yyyy-MM-DD
// }

export function createNewTrip() {
    const trip = {
      code: faker.string.alphanumeric(),
      origin: {
        lat: createLocation().lat,
        long: createLocation().long,
      },
      destination: {
        lat: createLocation().lat,
        long: createLocation().long,
      },
      miles: faker.datatype.boolean(),
      plane: faker.airline.airplane().name,
      service: faker.helpers.enumValue(ServiceClass),
      affiliate: faker.helpers.enumValue(AffiliateStatus),
      date: "2050-02-22"
    };

    const miles = createMiles()

    return { trip, miles }
  }
  
export function createNewTripCalc() {
  const trip: Trip = {
    code: faker.string.alphanumeric(),
    origin: createLocation(),
    destination: createLocation(),
    miles: false,
    plane: faker.airline.airplane().name,
    service: ServiceClass.ECONOMIC,
    affiliate: AffiliateStatus.BRONZE,
    date: "2050-02-22"
  };
  
  return trip;
}

// {
//   lat: number;
//   long: number;
// };

function createLocation(): Location {
    return {
      lat: faker.location.latitude(),
      long: faker.location.longitude(),
    };
  }

function createMiles() {
    const miles = faker.number.int()

    return miles
  }