import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import {
  calculateTotalCost,
  getHighCostActivities,
  getCostByCategory,
  isOverBudget,
} from "./services/budgetService";
import { getCountryInfo } from "./services/fetchDestinations";
import { Trip, Activity, Database } from "./types/interfaces";

// Local Database that saves trips we create and reads from it

const dbPath = path.join(__dirname, "db.json");

const loadDB = (): Database => {
  const raw = fs.readFileSync(dbPath, "utf-8"); 
  return JSON.parse(raw) as Database;  
};

const saveDB = (db: Database): void => {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
};

// Create Trip 

const createTrip = async (): Promise<void> => {
  const answers = await inquirer.prompt<{
    destination: string;
    startDate: string;
  }>([
    {
      type: "list",
      name: "destination",
      message: "Select destination:",
      choices: [
        "Paris, France",
        "Rome, Italy",
        "Barcelona, Spain",
        "Berlin, Germany",
        "Amsterdam, Netherlands",
        "Lisbon, Portugal",
        "Athens, Greece",
        "Budapest, Hungary",
        "Prague, Czech Republic",
        "Vienna, Austria",
      ],
    },
    {
      type: "input",
      name: "startDate",
      message: "Enter start date (YYYY-MM-DD):",
      validate: (value: string) =>
        {return /^\d{4}-\d{2}-\d{2}$/.test(value) ||
        "Please enter a valid date (YYYY-MM-DD)"},
    },
  ]);

  const db = loadDB();

  const newTrip: Trip = {
    id: `trip-${Date.now()}`,
    destination: answers.destination,
    startDate: new Date(answers.startDate),
    activities: [],
  };

  db.trips.push(newTrip);
  saveDB(db);

  console.log(`\n✔ Trip to ${answers.destination} created for ${answers.startDate} successfully!\n`);
};

// Add Activity

type ActivityOption = {
  name: string;
  cost: number;
  category: "outdoors" | "culinary" | "sightseeing";
};

const addActivity = async (): Promise<void> => {
  const db = loadDB();

  if (db.trips.length === 0) {
    console.log("\n⚠ No trips found. Please create a trip first.\n");
    return;
  }

  const { tripId } = await inquirer.prompt<{ tripId: string }>([
    {
      type: "list",
      name: "tripId",
      message: "Select a trip to add the activity to:",
      choices: db.trips.map((t) => {return { name: t.destination, value: t.id }}),
    },
  ]);

  const predefinedActivities: { [key: string]: ActivityOption[] } = {
    outdoors: [
      { name: "City Bike Tour", cost: 350, category: "outdoors" },
      { name: "Hiking Day Trip", cost: 800, category: "outdoors" },
      { name: "Kayaking Experience", cost: 600, category: "outdoors" },
      { name: "Nature Walk (guided)", cost: 250, category: "outdoors" },
    ],
    culinary: [
      { name: "Local Food Tasting Tour", cost: 700, category: "culinary" },
      { name: "Cooking Class", cost: 1100, category: "culinary" },
      { name: "Fine Dining Experience", cost: 2000, category: "culinary" },
      { name: "Street Food Tour", cost: 400, category: "culinary" },
    ],
    sightseeing: [
      { name: "Museum Visit (guided)", cost: 300, category: "sightseeing" },
      { name: "Historical Landmarks Tour", cost: 500, category: "sightseeing" },
      { name: "City Bus Tour", cost: 200, category: "sightseeing" },
      { name: "Castle or Palace Tour", cost: 450, category: "sightseeing" },
    ],
  };

  const { category } = await inquirer.prompt<{
    category: "outdoors" | "culinary" | "sightseeing";
  }>([
    {
      type: "list",
      name: "category",
      message: "Select a category:",
      choices: ["outdoors", "culinary", "sightseeing"],
    },
  ]);

  const { selectedActivity } = await inquirer.prompt<{ selectedActivity: string }>([
    {
      type: "list",
      name: "selectedActivity",
      message: "Select an activity:",
      choices: (predefinedActivities[category] ?? []).map((a: ActivityOption) => {return {
        name: `${a.name} — $${a.cost}`,
        value: a.name,
      }}),
    },
  ]);

  const activityData = (predefinedActivities[category] ?? []).find(
    (a: ActivityOption) => {return a.name === selectedActivity}
  )!;

  const { startTime } = await inquirer.prompt<{ startTime: string }>([
    {
      type: "list",
      name: "startTime",
      message: "Select a start time:",
      choices: [
        "09:00", "10:00", "11:00", "12:00",
        "13:00", "14:00", "15:00", "16:00",
        "17:00", "18:00", "19:00", "20:00",
      ],
    },
  ]);

  const { activityDate } = await inquirer.prompt<{ activityDate: string }>([
    {
      type: "input",
      name: "activityDate",
      message: "Enter activity date (YYYY-MM-DD):",
      validate: (value: string) =>
        {return /^\d{4}-\d{2}-\d{2}$/.test(value) ||
        "Please enter a valid date (YYYY-MM-DD)"},
    },
  ]);

  const newActivity: Activity = {
    id: `act-${Date.now()}`,
    name: activityData.name,
    cost: activityData.cost,
    category: activityData.category,
    startTime: new Date(`${activityDate}T${startTime}:00`),
  };

  const trip = db.trips.find((t) => {return t.id === tripId})!;
  trip.activities.push(newActivity);
  saveDB(db);

  console.log(`\n✔ "${activityData.name}" added to ${trip.destination} — ${activityData.category}, $${activityData.cost}\n`);
};

// View Budget

const viewBudget = async (): Promise<void> => {
  const db = loadDB();

  if (db.trips.length === 0) {
    console.log("\n⚠ No trips found. Please create a trip first.\n");
    return;
  }

  const { selectedTripId } = await inquirer.prompt<{ selectedTripId: string }>([
    {
      type: "list",
      name: "selectedTripId",
      message: "Select a trip:",
      choices: db.trips.map((t) => {return { name: t.destination, value: t.id }}),
    },
  ]);

  const trip = db.trips.find((t) => {return t.id === selectedTripId})!;

  const { budgetAction } = await inquirer.prompt<{ budgetAction: string }>([
    {
      type: "list",
      name: "budgetAction",
      message: "What would you like to do?",
      choices: [
        "View Total Cost",
        "View Cost by Category",
        "Find High-Cost Activities",
        "Check if Over Budget",
      ],
    },
  ]);

  switch (budgetAction) {
    case "View Total Cost":
      const total = calculateTotalCost(trip);
      console.log(`\nTotal cost for ${trip.destination}: $${total}\n`);
      break;

    case "View Cost by Category":
      const breakdown = getCostByCategory(trip);
      console.log(`\nCost breakdown for ${trip.destination}:`);
      Object.entries(breakdown).forEach(([category, cost]) => {
        console.log(`  ${category}: $${cost}`);
      });
      console.log();
      break;

    case "Find High-Cost Activities":
      const { threshold } = await inquirer.prompt<{ threshold: string }>([
        {
          type: "input",
          name: "threshold",
          message: "Enter cost threshold ($):",
          validate: (value: string) =>
            {return !isNaN(Number(value)) || "Please enter a valid number"},
        },
      ]);
      const expensive = getHighCostActivities(trip, Number(threshold));
      if (expensive.length === 0) {
        console.log(`\n⚠ No activities exceed $${threshold}\n`);
      } else {
        console.log(`\nActivities over $${threshold} in ${trip.destination}:`);
        expensive.forEach((a) => {return console.log(`  - ${a.name}: $${a.cost}`)});
        console.log();
      }
      break;

    case "Check if Over Budget":
      const { limit } = await inquirer.prompt<{ limit: string }>([
        {
          type: "input",
          name: "limit",
          message: "Enter your budget limit ($):",
          validate: (value: string) =>
            {return !isNaN(Number(value)) || "Please enter a valid number"},
        },
      ]);
      const totalCost = calculateTotalCost(trip);
      const over = isOverBudget(trip, Number(limit));
      console.log(`\nTotal cost: $${totalCost}`);
      console.log(
        over
          ? `⚠  Over budget by $${totalCost - Number(limit)}!\n`
          : `✔  Within budget. $${Number(limit) - totalCost} remaining.\n`
      );
      break;
  }
};

// Get Country Info 

const viewCountryInfo = async (): Promise<void> => {
  const { countryName } = await inquirer.prompt<{ countryName: string }>([
    {
      type: "list",
      name: "countryName",
      message: "Select a country to look up:",
      choices: [
        "France",
        "Italy",
        "Spain",
        "Germany",
        "Netherlands",
        "Portugal",
        "Greece",
        "Hungary",
        "Czech Republic",
        "Austria",
      ],
    },
  ]);

  console.log(`\nFetching info for ${countryName}...`);

  const info = await getCountryInfo(countryName);

  if (!info) {
    console.log(`\n⚠ Could not find information for ${countryName}\n`);
    return;
  }

  console.log(`\n🌍 ${info.name}`);
  console.log(`  Capital:    ${info.capital}`);
  console.log(`  Region:     ${info.region}`);
  console.log(`  Population: ${info.population.toLocaleString()}`);
  console.log(`  Currency:   ${info.currency}`);
  console.log(`  Languages:  ${info.languages.join(", ")}`);
  console.log(`  Flag:       ${info.flag}`);
  console.log();
};

// View Activities by Day 

const viewActivitiesByDay = async (): Promise<void> => {
  const db = loadDB();

  if (db.trips.length === 0) {
    console.log("\n⚠ No trips found. Please create a trip first.\n");
    return;
  }

  const { tripId } = await inquirer.prompt<{ tripId: string }>([
    {
      type: "list",
      name: "tripId",
      message: "Select a trip:",
      choices: db.trips.map((t) => {return { name: t.destination, value: t.id }}),
    },
  ]);

  const trip = db.trips.find((t) => {return t.id === tripId})!;

  const { date } = await inquirer.prompt<{ date: string }>([
    {
      type: "input",
      name: "date",
      message: "Enter date to view (YYYY-MM-DD):",
      validate: (value: string) =>
        {return /^\d{4}-\d{2}-\d{2}$/.test(value) ||
        "Please enter a valid date (YYYY-MM-DD)"},
    },
  ]);

  const filtered = trip.activities.filter((a) => {
    const activityDate = new Date(a.startTime).toISOString().split("T")[0];
    return activityDate === date;
  });

  if (filtered.length === 0) {
    console.log(`\n⚠ No activities found for ${date}\n`);
  } else {
    console.log(`\nActivities on ${date} for ${trip.destination}:`);
    filtered.forEach((a) => {
      const time = (new Date(a.startTime).toISOString().split("T")[1] ?? "00:00").slice(0, 5);
      console.log(`  ${time} — ${a.name} (${a.category}) — $${a.cost}`);
    });
    console.log();
  }
};

// Filter by Category 

const filterByCategory = async (): Promise<void> => {
  const db = loadDB();

  if (db.trips.length === 0) {
    console.log("\n⚠ No trips found. Please create a trip first.\n");
    return;
  }

  const { tripId } = await inquirer.prompt<{ tripId: string }>([
    {
      type: "list",
      name: "tripId",
      message: "Select a trip:",
      choices: db.trips.map((t) => {return { name: t.destination, value: t.id }}),
    },
  ]);

  const trip = db.trips.find((t) => {return t.id === tripId})!;

  const { category } = await inquirer.prompt<{ category: string }>([
    {
      type: "list",
      name: "category",
      message: "Select a category to filter by:",
      choices: ["outdoors", "culinary", "sightseeing"],
    },
  ]);

  const filtered = trip.activities.filter((a) => {return a.category === category});

  if (filtered.length === 0) {
    console.log(`\n⚠ No ${category} activities found for ${trip.destination}\n`);
  } else {
    console.log(`\n${category} activities in ${trip.destination}:`);
    filtered.forEach((a) => {return console.log(`  - ${a.name} — $${a.cost}`)});
    console.log();
  }
};

// View Sorted Itinerary 

const viewSortedActivities = async (): Promise<void> => {
  const db = loadDB();

  if (db.trips.length === 0) {
    console.log("\n⚠ No trips found. Please create a trip first.\n");
    return;
  }

  const { tripId } = await inquirer.prompt<{ tripId: string }>([
    {
      type: "list",
      name: "tripId",
      message: "Select a trip:",
      choices: db.trips.map((t) => {return { name: t.destination, value: t.id }}),
    },
  ]);

  const trip = db.trips.find((t) => {return t.id === tripId})!;

  const sorted = [...trip.activities].sort(
    (a, b) => {return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()}
  );

  if (sorted.length === 0) {
    console.log(`\n⚠ No activities found for ${trip.destination}\n`);
  } else {
    console.log(`\nAll activities for ${trip.destination} (chronological order):`);
    sorted.forEach((a) => {
      const date = new Date(a.startTime).toISOString().split("T")[0];
      const time = (new Date(a.startTime).toISOString().split("T")[1] ?? "00:00").slice(0, 5);
      console.log(`  ${date} ${time} — ${a.name} (${a.category}) — $${a.cost}`);
    });
    console.log();
  }
};

// Main Menu 

export const mainMenu = async (): Promise<void> => {
  const answers = await inquirer.prompt<{ action: string }>([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "Create Trip",
        "Add Activity",
        "View Budget",
        "View Activities by Day",
        "Filter by Category",
        "View Sorted Itinerary",
        "Get Country Info",
        "Exit",
      ],
    },
  ]);

  switch (answers.action) {
    case "Create Trip":
      await createTrip();
      await mainMenu();
      break;
    case "Add Activity":
      await addActivity();
      await mainMenu();
      break;
    case "View Budget":
      await viewBudget();
      await mainMenu();
      break;
    case "View Activities by Day":
      await viewActivitiesByDay();
      await mainMenu();
      break;
    case "Filter by Category":
      await filterByCategory();
      await mainMenu();
      break;
    case "View Sorted Itinerary":
      await viewSortedActivities();
      await mainMenu();
      break;
    case "Get Country Info":
      await viewCountryInfo();
      await mainMenu();
      break;
    case "Exit":
      console.log("Have a nice trip!");
      process.exit(0);
  }
};
