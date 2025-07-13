import express from "express";

import { categoriesStore } from "../db/index.js";

export default express
    .Router()
    .get("/", (_, res) =>
        res.status(200).json(categoriesStore.getCategories())
    );
