import { mainMenu } from "./cli";


mainMenu().catch((error) => {
  console.error("Unhandled error:", error);
});

