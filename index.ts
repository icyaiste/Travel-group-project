

import { getCountryInfo } from "./services/fetchDestinations";
import type { Trip } from "./types/interfaces.ts";


const runApp = async (): Promise<void> => {

  const trip: Trip = {
    id: "1",
    destination: "Sweden",
    startDate: new Date("2026-06-01"),
    activities: [],
  };

  console.log("Trip created!");
  console.log("Destination:", trip.destination);
  console.log("Trip starts on:", trip.startDate.toDateString());
  console.log("=".repeat(40));

  // Fetch destination information

  const result = await getCountryInfo(trip.destination);

  if (result) {
    console.log("Country Information:");
    console.dir(result, { depth: null });
  } else {
    console.log("Could not fetch country information.");
  }
};

runApp();

