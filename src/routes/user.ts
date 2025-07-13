import express from "express";

import { getUserHandler } from "../controllers/user.js";

export default express.Router().get("/:id", getUserHandler);
