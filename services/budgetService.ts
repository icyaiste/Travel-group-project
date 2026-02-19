// mock data for testing
const myParisTrip: Trip = {
  id: "trip-1",
  destination: "Paris",
  startDate: new Date("2026-07-01"),
  activities: [
    {
      id: "a1",
      name: "Eiffel Tower",
      cost: 50,
      category: "sightseeing",
      startTime: new Date(),
    },
    {
      id: "a2",
      name: "Louvre",
      cost: 30,
      category: "culinary",
      startTime: new Date(),
    },
  ],
};

// Calculate total cost

import { Trip, Activity } from "../types/interfaces";

export const calculateTotalCost = (trip: Trip): number => {
  if (!trip || !trip.activities) return 0;

  return trip.activities.reduce((sum, activity) => {
    return sum + activity.cost;
  }, 0);
};

// Identify high-cost activities

export const identifyHighCostActivities = (
  trip: Trip,
  threshold: number,
): Activity[] => {
  return trip.activities.filter((activity) => {
    return activity.cost > threshold;
  });
};

const total = calculateTotalCost(myParisTrip);
const expensiveStuff = identifyHighCostActivities(myParisTrip, 20);

console.log(`Total Cost: $${total}`);
console.log("Expensive Activities over your budget:", expensiveStuff);
