import fs from "node:fs/promises";
import { Trip, Activity } from "../types/interfaces";

export const calculateTotalCost = (trip: Trip): number => {
  return trip.activities.reduce((sum, activity) => {
    return sum + activity.cost;
  }, 0);
};

export const identifyHighCostActivities = (
  trip: Trip,
  threshold: number,
): Activity[] => {
  return trip.activities.filter((activity) => {
    return activity.cost > threshold;
  });
};

interface DBStructure {
  trips: Trip[];
}

export const processTrips = async (): Promise<void> => {
  try {
    const data: string = await fs.readFile("./db.json", "utf-8");
    const parsedData = JSON.parse(data) as DBStructure;
    const trips: Trip[] = parsedData.trips;

    console.log("--- Trip Budget Report --- \n");

    trips.forEach((trip) => {
      const total = calculateTotalCost(trip);
      const expensive = identifyHighCostActivities(trip, 2000);

      console.log(`\nTrip to ${trip.destination}`);
      console.table(trip.activities);
      console.log(`Total Cost: ${total}`);
      console.log(`High Cost Items: ${expensive.length}`);
      console.log("=".repeat(40));
    });
  } catch (error) {
    console.error("Error reading db.json:", error);
  }
};

processTrips();
