import e from "express";

import { myListingsHandler } from "../controllers/my.js";

export default e.Router().get("/", myListingsHandler);
