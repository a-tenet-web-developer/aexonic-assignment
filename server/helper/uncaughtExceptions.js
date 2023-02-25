import Config from "config";
import logger from "./logger";

export class UncaughtException {
  constructor() {
    if (process.env.NODE_ENV === "production") {
      process.on("uncaughtException", function (er) {
        console.error("=>>>>>>>>>>>>>>>", er.message);
      });
    }
  }
}
export default new UncaughtException();
