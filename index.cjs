// Production entry point for Plesk/Passenger.
// The build process generates the actual server at dist/index.cjs.
try {
  require("./dist/index.cjs");
} catch (error) {
  console.error("Unable to start the production server:", error);
  process.exit(1);
}