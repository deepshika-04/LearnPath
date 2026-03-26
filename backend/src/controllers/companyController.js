const Company = require("../models/Company");

// Get all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get company by name
exports.getCompanyByName = async (req, res) => {
  try {
    const { name } = req.params;
    const company = await Company.findOne({ name });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get company requirements
exports.getCompanyRequirements = async (req, res) => {
  try {
    const { targetCompany } = req.query;
    const company = await Company.findOne({ name: targetCompany });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({
      company: company.name,
      topicWeightage: company.topicWeightage,
      frequentlyAskedTopics: company.frequentlyAskedTopics,
      focusAreas: company.focusAreas,
      difficulty: company.difficultyLevel,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
