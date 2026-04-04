const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Company = require("../src/models/Company");
const Question = require("../src/models/Question");
const Resource = require("../src/models/Resource");
const User = require("../src/models/User");
const SkillAnalysis = require("../src/models/SkillAnalysis");
const LearningPath = require("../src/models/LearningPath");
const StudyPlan = require("../src/models/StudyPlan");

const envPath = path.resolve(__dirname, "../.env");
const envExamplePath = path.resolve(__dirname, "../.env.example");

dotenv.config({ path: fs.existsSync(envPath) ? envPath : envExamplePath });

const companies = [
  {
    name: "Amazon",
    topicWeightage: {
      DSA: 40,
      DBMS: 20,
      OS: 15,
      CN: 15,
      Aptitude: 10,
    },
    difficultyLevel: "Hard",
    frequentlyAskedTopics: [
      "Arrays",
      "Trees",
      "Graphs",
      "Dynamic Programming",
      "Linked Lists",
    ],
    focusAreas: ["Problem Solving", "System Design", "Optimization"],
  },
  {
    name: "Google",
    topicWeightage: {
      DSA: 45,
      DBMS: 15,
      OS: 20,
      CN: 10,
      Aptitude: 10,
    },
    difficultyLevel: "Hard",
    frequentlyAskedTopics: ["Algorithms", "Advanced DSA", "Bit Manipulation"],
    focusAreas: ["Scalability", "Optimization", "Algorithm Design"],
  },
  {
    name: "Microsoft",
    topicWeightage: {
      DSA: 35,
      DBMS: 20,
      OS: 20,
      CN: 15,
      Aptitude: 10,
    },
    difficultyLevel: "Hard",
    frequentlyAskedTopics: ["Arrays", "Strings", "Trees"],
    focusAreas: ["Logic", "Coding", "Problem Analysis"],
  },
  {
    name: "TCS",
    topicWeightage: {
      DSA: 25,
      DBMS: 20,
      OS: 15,
      CN: 15,
      Aptitude: 25,
    },
    difficultyLevel: "Medium",
    frequentlyAskedTopics: ["Basic DSA", "SQL", "Aptitude"],
    focusAreas: ["Speed", "Accuracy", "Fundamentals"],
  },
  {
    name: "Infosys",
    topicWeightage: {
      DSA: 20,
      DBMS: 25,
      OS: 15,
      CN: 15,
      Aptitude: 25,
    },
    difficultyLevel: "Medium",
    frequentlyAskedTopics: ["SQL", "DBMS Concepts", "Aptitude"],
    focusAreas: ["Core Concepts", "Database", "Logical Reasoning"],
  },
];

const sampleQuestions = [
  {
    topic: "DSA",
    difficulty: "Easy",
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
    correctAnswer: 1,
    explanation:
      "Binary search divides the array in half each time, resulting in O(log n) complexity.",
  },
  {
    topic: "DSA",
    difficulty: "Medium",
    question: "What is the difference between DFS and BFS?",
    options: [
      "DFS uses stack, BFS uses queue",
      "DFS uses queue, BFS uses stack",
      "They are the same",
      "DFS is faster",
    ],
    correctAnswer: 0,
    explanation:
      "DFS (Depth-First Search) uses a stack, while BFS (Breadth-First Search) uses a queue.",
  },
  {
    topic: "DBMS",
    difficulty: "Easy",
    question: "What does ACID stand for in databases?",
    options: [
      "Atomicity, Consistency, Isolation, Durability",
      "Availability, Consistency, Integrity, Distribution",
      "Accuracy, Completeness, Integration, Delivery",
      "Application, Code, Interface, Design",
    ],
    correctAnswer: 0,
    explanation: "ACID properties ensure reliable database transactions.",
  },
  {
    topic: "OS",
    difficulty: "Easy",
    question: "What is a semaphore?",
    options: [
      "A traffic signal",
      "A synchronization primitive for managing access",
      "A type of memory",
      "A file system structure",
    ],
    correctAnswer: 1,
    explanation:
      "Semaphores are used to control access to shared resources in concurrent programming.",
  },
  {
    topic: "CN",
    difficulty: "Easy",
    question: "What is the OSI model?",
    options: [
      "A 7-layer model for network communication",
      "A file transfer protocol",
      "An encryption algorithm",
      "A web server",
    ],
    correctAnswer: 0,
    explanation:
      "The OSI model has 7 layers defining how network communication occurs.",
  },
  {
    topic: "Aptitude",
    difficulty: "Easy",
    question:
      "If A can do a work in 10 days and B can do the same work in 15 days, in how many days can they do it together?",
    options: ["6 days", "25 days", "30 days", "12.5 days"],
    correctAnswer: 0,
    explanation:
      "Combined work rate = 1/10 + 1/15 = 5/30 = 1/6, so they need 6 days.",
  },
];

const sampleResources = [
  {
    title: "LeetCode - Array Problems",
    type: "Problem",
    topic: "DSA",
    url: "https://leetcode.com/explore/learn/card/array-and-string/",
    difficulty: "Easy",
    companyRelevance: ["Amazon", "Google", "Microsoft"],
    description:
      "Practice array and string problems commonly asked in interviews.",
    tags: ["arrays", "strings", "practice"],
  },
  {
    title: "GeeksforGeeks - DSA Basics",
    type: "Article",
    topic: "DSA",
    url: "https://www.geeksforgeeks.org/data-structures/",
    difficulty: "Easy",
    companyRelevance: ["All"],
    description: "Comprehensive guide to DSA fundamentals.",
    tags: ["fundamentals", "learning"],
  },
  {
    title: "YouTube - SQL Tutorial",
    type: "Video",
    topic: "DBMS",
    url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
    difficulty: "Easy",
    companyRelevance: ["TCS", "Infosys", "Wipro"],
    description: "Complete SQL tutorial for beginners.",
    tags: ["sql", "database", "tutorial"],
  },
  {
    title: "Operating System Concepts",
    type: "Article",
    topic: "OS",
    url: "https://www.geeksforgeeks.org/operating-system/",
    difficulty: "Medium",
    companyRelevance: ["All"],
    description: "Learn about processes, threads, deadlocks, and more.",
    tags: ["processes", "threading", "synchronization"],
  },
  {
    title: "Computer Networks - OSI Model",
    type: "Article",
    topic: "CN",
    url: "https://www.geeksforgeeks.org/layers-of-osi-model/",
    difficulty: "Easy",
    companyRelevance: ["Amazon", "Google", "Microsoft"],
    description: "Understand the 7 layers of the OSI model and network protocols.",
    tags: ["networking", "osi-model", "protocols"],
  },
  {
    title: "TutorialsPoint - Computer Networks",
    type: "Video",
    topic: "CN",
    url: "https://www.tutorialspoint.com/computer_networks/",
    difficulty: "Medium",
    companyRelevance: ["TCS", "Infosys"],
    description: "Complete computer networks course covering TCP/IP and more.",
    tags: ["networking", "tcp-ip", "learning"],
  },
  {
    title: "Quantitative Aptitude - Practice Problems",
    type: "Problem",
    topic: "Aptitude",
    url: "https://www.indiabix.com/aptitude/",
    difficulty: "Medium",
    companyRelevance: ["TCS", "Infosys", "Wipro", "Accenture"],
    description: "Practice quantitative aptitude and logical reasoning problems.",
    tags: ["aptitude", "reasoning", "practice"],
  },
  {
    title: "YouTube - Aptitude Shortcuts",
    type: "Video",
    topic: "Aptitude",
    url: "https://www.youtube.com/watch?v=EsZl0n0OITc",
    difficulty: "Easy",
    companyRelevance: ["All"],
    description: "Learn quick shortcuts for solving aptitude questions.",
    tags: ["aptitude", "shortcuts", "tutorial"],
  },
];

// Sample test user
const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "hashedPassword123", // In real scenario, this would be hashed
  targetCompany: "Amazon",
  studyHoursPerDay: 3,
};

// Sample skill analysis
const sampleSkillAnalysis = {
  skillLevel: "Intermediate",
  weakTopics: ["CN", "Aptitude"],
  strongTopics: ["DSA", "DBMS"],
  topicScores: {
    DSA: 75,
    DBMS: 68,
    OS: 55,
    CN: 40,
    Aptitude: 35,
  },
};

// Sample learning path
const sampleLearningPath = {
  targetCompany: "Amazon",
  topics: [
    {
      topicName: "DSA",
      priority: "High",
      prerequisites: [],
      estimatedDays: 60,
      status: "In Progress",
    },
    {
      topicName: "DBMS",
      priority: "High",
      prerequisites: [],
      estimatedDays: 25,
      status: "Not Started",
    },
    {
      topicName: "OS",
      priority: "Medium",
      prerequisites: ["DSA"],
      estimatedDays: 20,
      status: "Not Started",
    },
    {
      topicName: "CN",
      priority: "Medium",
      prerequisites: [],
      estimatedDays: 15,
      status: "Not Started",
    },
    {
      topicName: "Aptitude",
      priority: "Low",
      prerequisites: [],
      estimatedDays: 10,
      status: "Not Started",
    },
  ],
  totalDaysEstimated: 130,
};

// Sample study plan
const sampleStudyPlan = {
  weeklySchedule: [
    {
      day: "Monday",
      topics: ["DSA - Arrays", "DSA - Strings"],
      estimatedHours: 3,
      priority: "High",
    },
    {
      day: "Tuesday",
      topics: ["DSA - Trees"],
      estimatedHours: 3,
      priority: "High",
    },
    {
      day: "Wednesday",
      topics: ["DBMS - SQL Basics"],
      estimatedHours: 2.5,
      priority: "High",
    },
    {
      day: "Thursday",
      topics: ["DSA - Graphs", "DSA - Dynamic Programming"],
      estimatedHours: 3,
      priority: "High",
    },
    {
      day: "Friday",
      topics: ["OS - Process Management"],
      estimatedHours: 2,
      priority: "Medium",
    },
    {
      day: "Saturday",
      topics: ["CN - Networking Basics", "Aptitude - Quantitative"],
      estimatedHours: 2,
      priority: "Medium",
    },
    {
      day: "Sunday",
      topics: ["Revision - DSA", "Mock Test"],
      estimatedHours: 2,
      priority: "Low",
    },
  ],
  dailyTasks: [
    {
      date: new Date(),
      tasks: [
        {
          topic: "DSA",
          subtopic: "Array Problems",
          hours: 1.5,
          completed: true,
        },
        {
          topic: "DSA",
          subtopic: "String Algorithms",
          hours: 1.5,
          completed: false,
        },
      ],
    },
  ],
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Clear existing data
    await Company.deleteMany({});
    await Question.deleteMany({});
    await Resource.deleteMany({});
    await User.deleteMany({});
    await SkillAnalysis.deleteMany({});
    await LearningPath.deleteMany({});
    await StudyPlan.deleteMany({});

    // Insert companies
    await Company.insertMany(companies);
    console.log(`${companies.length} companies inserted`);

    // Insert questions
    await Question.insertMany(sampleQuestions);
    console.log(`${sampleQuestions.length} questions inserted`);

    // Insert resources
    await Resource.insertMany(sampleResources);
    console.log(`${sampleResources.length} resources inserted`);

    // Create test user
    const user = new User(testUser);
    await user.save();
    console.log("Test user created");

    // Create skill analysis
    const skillAnalysis = new SkillAnalysis({
      ...sampleSkillAnalysis,
      userId: user._id,
    });
    await skillAnalysis.save();
    console.log("Skill analysis created");

    // Create learning path
    const learningPath = new LearningPath({
      ...sampleLearningPath,
      userId: user._id,
    });
    await learningPath.save();
    console.log("Learning path created");

    // Create study plan
    const studyPlan = new StudyPlan({
      ...sampleStudyPlan,
      userId: user._id,
    });
    await studyPlan.save();
    console.log("Study plan created");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
