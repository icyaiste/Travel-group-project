

import { getCountryInfo } from "./services/fetchDestinations.js";

const runApp = async () => {
  const result = await getCountryInfo("Sweden");
  console.dir(result, { depth: null });
};

runApp();
