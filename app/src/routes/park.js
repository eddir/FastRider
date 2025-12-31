// src/routes/parkRoutes.js
import express from "express";
import * as areaController from "../controllers/areaController.js";
import * as attractionController from "../controllers/attractionController.js";
import * as foodStandController from "../controllers/foodStandController.js";
import * as restaurantController from "../controllers/restaurantController.js";
import * as searchController from "../controllers/searchController.js";

const router = express.Router();

// Areas
router.get("/areas", areaController.getAllAreas);
router.get("/areas/:id", areaController.getAreaById);

// Attractions
router.get("/attractions", attractionController.getAttractions);
router.get("/attractions/:id", attractionController.getAttractionById);

// Food Stands
router.get("/food-stands", foodStandController.getFoodStands);
router.get("/food-stands/:id", foodStandController.getFoodStandById);

// Restaurants
router.get("/restaurants", restaurantController.getRestaurants);
router.get("/restaurants/:id", restaurantController.getRestaurantById);

// Search
router.get("/search", searchController.searchParkItems);

export default router;
