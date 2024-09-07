import mongoose from "mongoose";
import config from "./app.config.js";

const CONNECTION_URL = `mongodb://${config.localDatabaseUrl}/${config.databaseName}`;

await mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Mongo has connected successfully");
});
mongoose.connection.on("reconnected", () => {
  console.log("Mongo has reconnected");
});
mongoose.connection.on("error", async (error) => {
  console.log("Mongo connection has an error", error);
  await mongoose.disconnect();
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongo connection is disconnected");
});

export default {
  connectDb: async () => {},
};
