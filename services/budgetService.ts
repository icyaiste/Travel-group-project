import * as fs from "fs";
import * as path from "path";
import { Trip, Activity, Database } from "../types/interfaces";

// Loads all trips from db.json
export const loadTrips = (): Trip[] => {
  const dbPath = path.join(__dirname, "../../db.json");
  const raw = fs.readFileSync(dbPath, "utf-8");
  const db: Database = JSON.parse(raw);
  return db.trips;
};

// Calculates the total cost of all activities in a trip
export const calculateTotalCost = (trip: Trip): number => {
  return trip.activities.reduce((sum, activity) => sum + activity.cost, 0);
};

// Returns activities that exceed the given cost threshold
export const getHighCostActivities = (trip: Trip, threshold: number): Activity[] => {
  return trip.activities.filter((activity) => activity.cost > threshold);
};

// Returns total cost grouped by category
export const getCostByCategory = (trip: Trip): Record<string, number> => {
  return trip.activities.reduce<Record<string, number>>((acc, activity) => {
    acc[activity.category] = (acc[activity.category] ?? 0) + activity.cost;
    return acc;
  }, {});
};

// Returns true if total cost exceeds the budget limit
export const isOverBudget = (trip: Trip, budgetLimit: number): boolean => {
  return calculateTotalCost(trip) > budgetLimit;
};

