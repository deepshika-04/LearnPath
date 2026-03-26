const axios = require('axios');
const Resource = require('../models/Resource');

// Get recommended resources
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.userId;
    const { topics, targetCompany } = req.query;

    // Get resources matching topics
    const resources = await Resource.find({
      topic: { $in: topics.split(',') }
    });

    // Send to ML service for similarity-based filtering
    const mlResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/recommend-resources`,
      {
        userTopics: topics.split(','),
        targetCompany,
        availableResources: resources.map(r => ({
          id: r._id,
          title: r.title,
          topic: r.topic,
          companyRelevance: r.companyRelevance,
          tags: r.tags,
          difficulty: r.difficulty
        }))
      }
    );

    const recommendedIds = mlResponse.data.recommendations;
    const recommendations = resources.filter(r => recommendedIds.includes(r._id.toString()));

    res.json({
      message: 'Recommendations generated',
      totalResources: recommendations.length,
      resources: recommendations.map(r => ({
        id: r._id,
        title: r.title,
        type: r.type,
        topic: r.topic,
        url: r.url,
        difficulty: r.difficulty,
        companyRelevance: r.companyRelevance,
        description: r.description
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get resources by topic
exports.getResourcesByTopic = async (req, res) => {
  try {
    const { topic, difficulty } = req.query;
    
    const filter = { topic };
    if (difficulty) filter.difficulty = difficulty;

    const resources = await Resource.find(filter);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all resources
exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
