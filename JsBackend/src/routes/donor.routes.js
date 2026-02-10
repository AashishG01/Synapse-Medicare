import express from "express";
import { getDonors } from "../controllers/donor.controller.js";

const router = express.Router();

router.get("/", getDonors);

export default router;

