const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");

// Get all companies
router.get("/all", companyController.getAllCompanies);

// Get company by name
router.get("/:name", companyController.getCompanyByName);

// Get company requirements
router.get("/requirements", companyController.getCompanyRequirements);

module.exports = router;
