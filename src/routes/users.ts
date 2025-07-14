import express from "express";

import prisma from "../db/prisma.js";

export default express
    .Router()
    .get("/", async (_, res) =>
        res.status(200).json(await prisma.user.findMany({select:{
            email:true,
            id:true,
            name:true
        }}))
    );
