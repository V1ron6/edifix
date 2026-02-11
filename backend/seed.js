import sequelize from './Config/database.js';
import { User, Course, Lesson, Question, Article, ForumCategory } from './Model/index.js';
import bcrypt from 'bcryptjs';
import allQuestions from './seedData/questions/index.js';

// Helper function to safely create records
const safeCreate = async (Model, data, uniqueField = null) => {
  try {
    if (uniqueField) {
      const existing = await Model.findOne({ where: { [uniqueField]: data[uniqueField] } });
      if (existing) {
        console.log(`  - Skipped (already exists): ${data[uniqueField]}`);
        return existing;
      }
    }
    const record = await Model.create(data);
    console.log(`  - Created: ${data[uniqueField] || data.title || data.question?.substring(0, 50) || 'record'}`);
    return record;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.log(`  - Skipped (duplicate): ${data[uniqueField] || 'record'}`);
      return null;
    }
    throw error;
  }
};

// Helper function to safely bulk create
const safeBulkCreate = async (Model, dataArray, uniqueField) => {
  const results = [];
  for (const data of dataArray) {
    const result = await safeCreate(Model, data, uniqueField);
    if (result) results.push(result);
  }
  return results;
};

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    console.log('=========================================\n');

    // Connect to database
    await sequelize.authenticate();
    console.log('[OK] Database connected\n');

    // Sync database (creates tables if they dont exist, does NOT drop)
    await sequelize.sync({ alter: false });
    console.log('[OK] Tables synchronized (no data dropped)\n');

    // ==================== SEED ADMIN USER ====================
    console.log('--- Seeding Admin User ---');
    const existingAdmin = await User.findOne({ where: { email: 'admin@edifix.com' } });
    if (!existingAdmin) {
      const adminPassword = await bcrypt.hash('2026@edifixadmin', 10);
      await User.create({
        username: 'admin',
        email: 'admin@edifix.com',
        password: adminPassword,
        role: 'admin',
        isEmailVerified: true
      });
      console.log('  - Created: admin@edifix.com');
    } else {
      console.log('  - Skipped (already exists): admin@edifix.com');
    }
    console.log('');

    // ==================== SEED COURSES ====================
    console.log('--- Seeding Courses ---');
    
    const allCourses = [
      // ==================== FRONTEND LEARNING PATH (Based on W3Schools) ====================
      
      // HTML Course - w3schools.com/html
      {
        title: 'HTML Tutorial',
        slug: 'html-tutorial',
        description: 'HTML is the standard markup language for Web pages. Learn HTML from W3Schools comprehensive tutorial covering elements, attributes, headings, paragraphs, formatting, links, images, tables, lists, forms, and more.',
        category: 'frontend',
        order: 1,
        difficulty: 'beginner',
        estimatedHours: 10,
        isPublished: true
      },
      {
        title: 'HTML Forms',
        slug: 'html-forms',
        description: 'Learn how to create interactive HTML forms. Covers form elements, input types, validation, form attributes, and best practices for user input handling.',
        category: 'frontend',
        order: 2,
        difficulty: 'beginner',
        estimatedHours: 4,
        isPublished: true
      },
      {
        title: 'HTML5 Graphics',
        slug: 'html5-graphics',
        description: 'Master HTML5 Canvas and SVG graphics. Learn to create drawings, animations, and visual content directly in the browser.',
        category: 'frontend',
        order: 3,
        difficulty: 'intermediate',
        estimatedHours: 6,
        isPublished: true
      },
      {
        title: 'HTML5 APIs',
        slug: 'html5-apis',
        description: 'Explore HTML5 APIs including Geolocation, Drag/Drop, Web Storage, Web Workers, and Server-Sent Events for building modern web applications.',
        category: 'frontend',
        order: 4,
        difficulty: 'intermediate',
        estimatedHours: 8,
        isPublished: true
      },
      
      // CSS Course - w3schools.com/css
      {
        title: 'CSS Tutorial',
        slug: 'css-tutorial',
        description: 'CSS is the language for styling HTML documents. Learn selectors, colors, backgrounds, borders, margins, padding, height/width, box model, text formatting, fonts, and more.',
        category: 'frontend',
        order: 5,
        difficulty: 'beginner',
        estimatedHours: 12,
        isPublished: true
      },
      {
        title: 'CSS Flexbox',
        slug: 'css-flexbox',
        description: 'Master CSS Flexbox layout module. Learn flex containers, flex items, alignment, ordering, and responsive design patterns using Flexbox.',
        category: 'frontend',
        order: 6,
        difficulty: 'intermediate',
        estimatedHours: 5,
        isPublished: true
      },
      {
        title: 'CSS Grid',
        slug: 'css-grid',
        description: 'Learn CSS Grid Layout for creating complex, responsive web layouts. Covers grid containers, grid items, row/column spanning, and grid areas.',
        category: 'frontend',
        order: 7,
        difficulty: 'intermediate',
        estimatedHours: 6,
        isPublished: true
      },
      {
        title: 'Responsive Web Design',
        slug: 'responsive-web-design',
        description: 'Create websites that look great on all devices. Learn media queries, responsive images, fluid grids, and mobile-first design principles.',
        category: 'frontend',
        order: 8,
        difficulty: 'intermediate',
        estimatedHours: 6,
        isPublished: true
      },
      {
        title: 'CSS Animations',
        slug: 'css-animations',
        description: 'Bring your websites to life with CSS animations and transitions. Learn keyframes, timing functions, transforms, and animation best practices.',
        category: 'frontend',
        order: 9,
        difficulty: 'intermediate',
        estimatedHours: 5,
        isPublished: true
      },
      
      // JavaScript Course - w3schools.com/js
      {
        title: 'JavaScript Tutorial',
        slug: 'javascript-tutorial',
        description: 'JavaScript is the programming language of the Web. Learn variables, data types, operators, functions, objects, arrays, loops, conditions, and more.',
        category: 'frontend',
        order: 10,
        difficulty: 'beginner',
        estimatedHours: 15,
        isPublished: true
      },
      {
        title: 'JavaScript DOM',
        slug: 'javascript-dom',
        description: 'Learn to manipulate HTML documents with JavaScript DOM. Covers selecting elements, changing content, handling events, and dynamic page modifications.',
        category: 'frontend',
        order: 11,
        difficulty: 'intermediate',
        estimatedHours: 8,
        isPublished: true
      },
      {
        title: 'JavaScript ES6+',
        slug: 'javascript-es6-modern',
        description: 'Master modern JavaScript features: let/const, arrow functions, template literals, destructuring, spread/rest operators, classes, modules, promises, and async/await.',
        category: 'frontend',
        order: 12,
        difficulty: 'intermediate',
        estimatedHours: 10,
        isPublished: true
      },
      {
        title: 'JavaScript AJAX and Fetch',
        slug: 'javascript-ajax-fetch',
        description: 'Learn asynchronous JavaScript. Covers XMLHttpRequest, Fetch API, working with JSON, making API calls, and handling responses.',
        category: 'frontend',
        order: 13,
        difficulty: 'intermediate',
        estimatedHours: 6,
        isPublished: true
      },
      {
        title: 'JavaScript JSON',
        slug: 'javascript-json',
        description: 'Understand JSON (JavaScript Object Notation). Learn to parse, stringify, and work with JSON data in web applications.',
        category: 'frontend',
        order: 14,
        difficulty: 'beginner',
        estimatedHours: 3,
        isPublished: true
      },
      
      // Git Version Control
      {
        title: 'Git Tutorial',
        slug: 'git-tutorial',
        description: 'Git is a version control system for tracking changes in code. Learn repositories, commits, branches, merging, pull requests, and GitHub collaboration.',
        category: 'frontend',
        order: 15,
        difficulty: 'beginner',
        estimatedHours: 6,
        isPublished: true
      },
      
      // Frontend Deployment
      {
        title: 'Web Hosting and Deployment',
        slug: 'web-hosting-deployment',
        description: 'Learn to deploy frontend projects to the web. Covers GitHub Pages, Netlify, Vercel, domain setup, and continuous deployment.',
        category: 'frontend',
        order: 16,
        difficulty: 'intermediate',
        estimatedHours: 4,
        isPublished: true
      },
      
      // ==================== BACKEND LEARNING PATH ====================
      
      // Node.js Course
      {
        title: 'Node.js Tutorial',
        slug: 'nodejs-tutorial',
        description: 'Node.js is a JavaScript runtime for server-side programming. Learn the Node.js architecture, modules, file system, HTTP module, and npm package management.',
        category: 'backend',
        order: 1,
        difficulty: 'intermediate',
        estimatedHours: 12,
        isPublished: true
      },
      {
        title: 'NPM and Package Management',
        slug: 'npm-package-management',
        description: 'Master NPM (Node Package Manager). Learn to install, update, and manage packages, create package.json, understand semantic versioning, and publish packages.',
        category: 'backend',
        order: 2,
        difficulty: 'beginner',
        estimatedHours: 4,
        isPublished: true
      },
      
      // Database Courses
      {
        title: 'SQL Tutorial',
        slug: 'sql-tutorial',
        description: 'SQL is a standard language for storing and retrieving data in databases. Learn SELECT, INSERT, UPDATE, DELETE, JOIN, and database design principles.',
        category: 'backend',
        order: 3,
        difficulty: 'intermediate',
        estimatedHours: 12,
        isPublished: true
      },
      {
        title: 'MySQL Tutorial',
        slug: 'mysql-tutorial',
        description: 'MySQL is a popular relational database. Learn database creation, table design, CRUD operations, indexing, and MySQL with Node.js integration.',
        category: 'backend',
        order: 4,
        difficulty: 'intermediate',
        estimatedHours: 10,
        isPublished: true
      },
      {
        title: 'MongoDB Tutorial',
        slug: 'mongodb-tutorial',
        description: 'MongoDB is a popular NoSQL database. Learn document-based data storage, CRUD operations, queries, indexing, and aggregation pipelines.',
        category: 'backend',
        order: 5,
        difficulty: 'intermediate',
        estimatedHours: 10,
        isPublished: true
      },
      
      // Express.js Course
      {
        title: 'Express.js Tutorial',
        slug: 'expressjs-tutorial',
        description: 'Express.js is the most popular Node.js web framework. Learn routing, middleware, templates, RESTful API design, and MVC architecture.',
        category: 'backend',
        order: 6,
        difficulty: 'intermediate',
        estimatedHours: 12,
        isPublished: true
      },
      {
        title: 'RESTful API Design',
        slug: 'restful-api-design',
        description: 'Learn to design and build RESTful APIs. Covers HTTP methods, status codes, API versioning, pagination, filtering, and API documentation.',
        category: 'backend',
        order: 7,
        difficulty: 'intermediate',
        estimatedHours: 8,
        isPublished: true
      },
      
      // Authentication and Security
      {
        title: 'Authentication with JWT',
        slug: 'authentication-jwt',
        description: 'Secure your applications with JSON Web Tokens. Learn token-based authentication, refresh tokens, password hashing, and session management.',
        category: 'backend',
        order: 8,
        difficulty: 'advanced',
        estimatedHours: 8,
        isPublished: true
      },
      {
        title: 'Web Security Basics',
        slug: 'web-security-basics',
        description: 'Protect your applications from common vulnerabilities. Learn about CORS, XSS, CSRF, SQL injection, input validation, and security headers.',
        category: 'backend',
        order: 9,
        difficulty: 'advanced',
        estimatedHours: 6,
        isPublished: true
      },
      {
        title: 'Middleware Patterns',
        slug: 'middleware-patterns',
        description: 'Master Express.js middleware. Learn to create custom middleware for authentication, logging, error handling, rate limiting, and more.',
        category: 'backend',
        order: 10,
        difficulty: 'intermediate',
        estimatedHours: 5,
        isPublished: true
      },
      
      // Deployment
      {
        title: 'Backend Deployment',
        slug: 'backend-deployment',
        description: 'Deploy your backend to production. Learn about Railway, Render, AWS, environment variables, SSL certificates, and continuous deployment.',
        category: 'backend',
        order: 11,
        difficulty: 'advanced',
        estimatedHours: 8,
        isPublished: true
      },
      {
        title: 'Docker for Developers',
        slug: 'docker-for-developers',
        description: 'Containerize your applications with Docker. Learn Dockerfiles, images, containers, Docker Compose, and container orchestration basics.',
        category: 'backend',
        order: 12,
        difficulty: 'advanced',
        estimatedHours: 10,
        isPublished: true
      }
    ];

    await safeBulkCreate(Course, allCourses, 'slug');
    console.log('');

    // ==================== SEED ARTICLES ====================
    console.log('--- Seeding Articles ---');
    
    const adminUser = await User.findOne({ where: { email: 'admin@edifix.com' } });
    
    if (adminUser) {
      const allArticles = [
        // HTML Best Practices
        {
          title: '10 HTML Best Practices Every Developer Should Know',
          slug: '10-html-best-practices',
          content: `# 10 HTML Best Practices Every Developer Should Know

Writing clean, semantic HTML is the foundation of good web development. Here are 10 best practices that will improve your code quality.

## 1. Use Semantic Elements

Always prefer semantic HTML5 elements over generic divs:

\`\`\`html
<!-- Bad -->
<div class="header">
  <div class="nav">...</div>
</div>

<!-- Good -->
<header>
  <nav>...</nav>
</header>
\`\`\`

## 2. Always Declare DOCTYPE

Start every HTML document with a DOCTYPE:

\`\`\`html
<!DOCTYPE html>
\`\`\`

## 3. Use Proper Document Structure

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title</title>
</head>
<body>
  <!-- Content here -->
</body>
</html>
\`\`\`

## 4. Always Include Alt Attributes on Images

\`\`\`html
<img src="logo.png" alt="Company Logo">
\`\`\`

## 5. Use Headings Correctly

Use h1-h6 in hierarchical order, with only one h1 per page.

## 6. Validate Your HTML

Use the W3C Validator to check your HTML for errors.

## 7. Keep It Simple

Don't add unnecessary elements. Less markup = faster loading.

## 8. Use Comments Wisely

\`\`\`html
<!-- Main Navigation -->
<nav>...</nav>
\`\`\`

## 9. Close All Tags

Even optional closing tags should be included for consistency.

## 10. Separate Structure from Style

Keep CSS in external stylesheets, not inline styles.`,
          excerpt: 'Learn the essential HTML best practices including semantic elements, proper document structure, accessibility, and code organization.',
          category: 'html',
          tags: ['html', 'best-practices', 'semantic-html', 'accessibility'],
          source: 'https://www.w3schools.com/html/',
          authorId: adminUser.id,
          readTimeMinutes: 8,
          isPublished: true,
          isFeatured: true,
          publishedAt: new Date()
        },
        
        // CSS Best Practices
        {
          title: 'CSS Best Practices for Modern Web Development',
          slug: 'css-best-practices-modern-web',
          content: `# CSS Best Practices for Modern Web Development

Writing maintainable CSS is crucial for scalable projects. Follow these best practices.

## 1. Use a CSS Reset or Normalize

Start with a consistent baseline across browsers:

\`\`\`css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
\`\`\`

## 2. Use CSS Custom Properties (Variables)

\`\`\`css
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --font-size-base: 16px;
}

.button {
  background-color: var(--primary-color);
}
\`\`\`

## 3. Follow a Naming Convention (BEM)

\`\`\`css
/* Block Element Modifier */
.card { }
.card__title { }
.card__button--primary { }
\`\`\`

## 4. Use Flexbox and Grid for Layouts

\`\`\`css
/* Flexbox for 1D layouts */
.container {
  display: flex;
  justify-content: space-between;
}

/* Grid for 2D layouts */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
\`\`\`

## 5. Mobile-First Approach

\`\`\`css
/* Base styles for mobile */
.card { width: 100%; }

/* Tablet and up */
@media (min-width: 768px) {
  .card { width: 50%; }
}

/* Desktop */
@media (min-width: 1024px) {
  .card { width: 33.33%; }
}
\`\`\`

## 6. Avoid !important

Use specificity correctly instead of forcing styles.

## 7. Organize Your Stylesheets

Group related styles and use comments for sections.`,
          excerpt: 'Master CSS best practices including custom properties, BEM naming, Flexbox, Grid, and responsive design techniques.',
          category: 'css',
          tags: ['css', 'best-practices', 'flexbox', 'grid', 'responsive'],
          source: 'https://www.w3schools.com/css/',
          authorId: adminUser.id,
          readTimeMinutes: 10,
          isPublished: true,
          isFeatured: true,
          publishedAt: new Date()
        },
        
        // JavaScript Best Practices
        {
          title: 'JavaScript Best Practices for Clean Code',
          slug: 'javascript-best-practices-clean-code',
          content: `# JavaScript Best Practices for Clean Code

Write JavaScript that is maintainable, readable, and efficient.

## 1. Use const and let Instead of var

\`\`\`javascript
// Bad
var name = 'John';

// Good
const name = 'John';
let count = 0;
\`\`\`

## 2. Use Arrow Functions

\`\`\`javascript
// Traditional
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;
\`\`\`

## 3. Destructuring

\`\`\`javascript
// Object destructuring
const { name, age } = user;

// Array destructuring
const [first, second] = items;
\`\`\`

## 4. Template Literals

\`\`\`javascript
const greeting = \\\`Hello, \\\${name}! You are \\\${age} years old.\\\`;
\`\`\`

## 5. Use Async/Await for Promises

\`\`\`javascript
// Bad
fetch(url)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Good
async function getData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
\`\`\`

## 6. Use Optional Chaining

\`\`\`javascript
// Instead of
const street = user && user.address && user.address.street;

// Use
const street = user?.address?.street;
\`\`\`

## 7. Use Nullish Coalescing

\`\`\`javascript
const value = input ?? 'default';
\`\`\`

## 8. Keep Functions Small

Each function should do one thing well.`,
          excerpt: 'Learn JavaScript best practices including ES6+ features, async/await, destructuring, and clean code principles.',
          category: 'javascript',
          tags: ['javascript', 'best-practices', 'es6', 'clean-code'],
          source: 'https://www.w3schools.com/js/',
          authorId: adminUser.id,
          readTimeMinutes: 12,
          isPublished: true,
          isFeatured: true,
          publishedAt: new Date()
        },
        
        // Node.js Best Practices
        {
          title: 'Node.js Best Practices for Production Applications',
          slug: 'nodejs-best-practices-production',
          content: `# Node.js Best Practices for Production Applications

Build robust and scalable Node.js applications with these best practices.

## 1. Use Environment Variables

\`\`\`javascript
// config.js
export const config = {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET
};
\`\`\`

## 2. Handle Errors Properly

\`\`\`javascript
// Async error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
\`\`\`

## 3. Use a Process Manager

Use PM2 or similar tools for production:

\`\`\`bash
pm2 start app.js --name "my-app" -i max
\`\`\`

## 4. Implement Logging

\`\`\`javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
\`\`\`

## 5. Validate Input Data

Always validate and sanitize user input.

## 6. Use Helmet for Security Headers

\`\`\`javascript
import helmet from 'helmet';
app.use(helmet());
\`\`\`

## 7. Implement Rate Limiting

\`\`\`javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);
\`\`\`

## 8. Use Connection Pooling for Databases

Configure proper connection pools for database efficiency.`,
          excerpt: 'Essential Node.js best practices for building production-ready applications including security, error handling, and performance.',
          category: 'nodejs',
          tags: ['nodejs', 'best-practices', 'production', 'security'],
          source: 'https://nodejs.org/en/docs/guides/',
          authorId: adminUser.id,
          readTimeMinutes: 10,
          isPublished: true,
          isFeatured: false,
          publishedAt: new Date()
        },
        
        // Express.js Best Practices
        {
          title: 'Express.js Best Practices for API Development',
          slug: 'expressjs-best-practices-api',
          content: `# Express.js Best Practices for API Development

Build professional RESTful APIs with Express.js.

## 1. Project Structure

\`\`\`
project/
  src/
    controllers/
    middleware/
    models/
    routes/
    config/
    utils/
  tests/
  app.js
  server.js
\`\`\`

## 2. Use Router for Route Organization

\`\`\`javascript
// routes/users.js
import express from 'express';
const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUser);

export default router;
\`\`\`

## 3. Proper HTTP Status Codes

\`\`\`javascript
res.status(200).json({ data }); // OK
res.status(201).json({ data }); // Created
res.status(400).json({ error }); // Bad Request
res.status(401).json({ error }); // Unauthorized
res.status(404).json({ error }); // Not Found
res.status(500).json({ error }); // Server Error
\`\`\`

## 4. Consistent Response Format

\`\`\`javascript
// Success response
res.json({
  success: true,
  data: result,
  message: 'Operation successful'
});

// Error response
res.json({
  success: false,
  error: 'Error message',
  code: 'ERROR_CODE'
});
\`\`\`

## 5. Use Async Handler Wrapper

\`\`\`javascript
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.json({ data: users });
}));
\`\`\`

## 6. Implement Request Validation

Use express-validator or Joi for input validation.`,
          excerpt: 'Learn Express.js best practices for building scalable APIs including project structure, routing, error handling, and validation.',
          category: 'expressjs',
          tags: ['expressjs', 'api', 'best-practices', 'rest'],
          source: 'https://expressjs.com/en/guide/',
          authorId: adminUser.id,
          readTimeMinutes: 8,
          isPublished: true,
          isFeatured: false,
          publishedAt: new Date()
        },
        
        // Git Best Practices
        {
          title: 'Git Best Practices for Team Collaboration',
          slug: 'git-best-practices-collaboration',
          content: `# Git Best Practices for Team Collaboration

Master Git workflows for effective team collaboration.

## 1. Write Good Commit Messages

\`\`\`
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
style: format code with prettier
refactor: extract validation logic
test: add unit tests for auth
\`\`\`

## 2. Commit Often, Push Regularly

Make small, focused commits rather than large ones.

## 3. Use Branches Effectively

\`\`\`bash
# Feature branch
git checkout -b feature/user-auth

# Bug fix branch
git checkout -b fix/login-error

# Hotfix branch
git checkout -b hotfix/security-patch
\`\`\`

## 4. Keep main/master Clean

Never commit directly to main. Use pull requests.

## 5. Review Before Merging

Always review code before merging pull requests.

## 6. Use .gitignore

\`\`\`
node_modules/
.env
.DS_Store
dist/
*.log
\`\`\`

## 7. Rebase for Clean History

\`\`\`bash
git rebase main
# or
git pull --rebase origin main
\`\`\`

## 8. Tag Releases

\`\`\`bash
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0
\`\`\``,
          excerpt: 'Essential Git best practices for team collaboration including commit messages, branching strategies, and code review workflows.',
          category: 'git',
          tags: ['git', 'version-control', 'collaboration', 'best-practices'],
          source: 'https://www.w3schools.com/git/',
          authorId: adminUser.id,
          readTimeMinutes: 7,
          isPublished: true,
          isFeatured: false,
          publishedAt: new Date()
        },
        
        // Database Best Practices
        {
          title: 'Database Design Best Practices',
          slug: 'database-design-best-practices',
          content: `# Database Design Best Practices

Design efficient and scalable databases.

## 1. Normalize Your Data

Follow normalization rules to reduce redundancy:
- 1NF: Atomic values, no repeating groups
- 2NF: No partial dependencies
- 3NF: No transitive dependencies

## 2. Use Appropriate Data Types

\`\`\`sql
-- Use the right type for the job
id CHAR(36) -- UUID
email VARCHAR(255) -- Variable length
description TEXT -- Long text
price DECIMAL(10,2) -- Precise numbers
isActive BOOLEAN -- True/False
createdAt DATETIME -- Timestamps
\`\`\`

## 3. Index Strategically

\`\`\`sql
-- Index frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_date ON orders(userId, orderDate);
\`\`\`

## 4. Use Foreign Keys

\`\`\`sql
FOREIGN KEY (userId) REFERENCES users(id) 
  ON DELETE CASCADE 
  ON UPDATE CASCADE
\`\`\`

## 5. Name Things Consistently

\`\`\`sql
-- Tables: plural, snake_case
users, order_items, product_categories

-- Columns: camelCase or snake_case (be consistent)
userId, created_at, isActive
\`\`\`

## 6. Always Have Primary Keys

Every table should have a primary key.

## 7. Use Transactions

\`\`\`sql
START TRANSACTION;
-- Multiple operations
COMMIT;
-- or ROLLBACK;
\`\`\`

## 8. Backup Regularly

Implement automated backup strategies.`,
          excerpt: 'Database design best practices including normalization, indexing, data types, and performance optimization techniques.',
          category: 'databases',
          tags: ['database', 'sql', 'mysql', 'best-practices', 'design'],
          source: 'https://www.w3schools.com/sql/',
          authorId: adminUser.id,
          readTimeMinutes: 9,
          isPublished: true,
          isFeatured: false,
          publishedAt: new Date()
        },
        
        // Web Security Article
        {
          title: 'Web Application Security Fundamentals',
          slug: 'web-security-fundamentals',
          content: `# Web Application Security Fundamentals

Protect your applications from common vulnerabilities.

## Common Vulnerabilities (OWASP Top 10)

### 1. Injection Attacks

\`\`\`javascript
// Bad - SQL Injection vulnerable
const query = "SELECT * FROM users WHERE id = " + userId;

// Good - Parameterized query
const query = "SELECT * FROM users WHERE id = ?";
db.query(query, [userId]);
\`\`\`

### 2. Cross-Site Scripting (XSS)

\`\`\`javascript
// Always sanitize user input
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
\`\`\`

### 3. Cross-Site Request Forgery (CSRF)

Use CSRF tokens for state-changing requests.

### 4. Broken Authentication

- Use secure password hashing (bcrypt)
- Implement rate limiting
- Use secure session management

## Security Headers

\`\`\`javascript
import helmet from 'helmet';
app.use(helmet());

// Includes:
// X-Content-Type-Options
// X-Frame-Options
// X-XSS-Protection
// Content-Security-Policy
\`\`\`

## HTTPS Everywhere

Always use HTTPS in production.

## Input Validation

\`\`\`javascript
import { body, validationResult } from 'express-validator';

app.post('/user', [
  body('email').isEmail(),
  body('password').isLength({ min: 8 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
});
\`\`\`

## Keep Dependencies Updated

Regularly audit and update dependencies:

\`\`\`bash
npm audit
npm update
\`\`\``,
          excerpt: 'Learn web application security fundamentals including protection against injection, XSS, CSRF, and implementing security best practices.',
          category: 'best-practices',
          tags: ['security', 'owasp', 'xss', 'csrf', 'best-practices'],
          source: 'https://owasp.org/www-project-top-ten/',
          authorId: adminUser.id,
          readTimeMinutes: 11,
          isPublished: true,
          isFeatured: true,
          publishedAt: new Date()
        }
      ];

      await safeBulkCreate(Article, allArticles, 'slug');
      console.log('');
    }

    // ==================== SEED FORUM CATEGORIES ====================
    console.log('--- Seeding Forum Categories ---');
    
    const forumCategories = [
      {
        name: 'General Discussion',
        slug: 'general-discussion',
        description: 'General conversations about web development, learning tips, and community discussions.',
        icon: 'chat',
        color: '#3498db',
        order: 1
      },
      {
        name: 'HTML & CSS',
        slug: 'html-css',
        description: 'Questions and discussions about HTML markup, CSS styling, layouts, and responsive design.',
        icon: 'code',
        color: '#e44d26',
        order: 2
      },
      {
        name: 'JavaScript',
        slug: 'javascript',
        description: 'JavaScript programming questions, DOM manipulation, ES6+ features, and frontend frameworks.',
        icon: 'javascript',
        color: '#f7df1e',
        order: 3
      },
      {
        name: 'Node.js & Backend',
        slug: 'nodejs-backend',
        description: 'Server-side JavaScript, Node.js, Express.js, APIs, and backend development topics.',
        icon: 'server',
        color: '#68a063',
        order: 4
      },
      {
        name: 'Databases',
        slug: 'databases',
        description: 'SQL, MySQL, MongoDB, database design, queries, and data management discussions.',
        icon: 'database',
        color: '#336791',
        order: 5
      },
      {
        name: 'Git & DevOps',
        slug: 'git-devops',
        description: 'Version control, Git workflows, deployment, CI/CD, and DevOps practices.',
        icon: 'git',
        color: '#f05032',
        order: 6
      },
      {
        name: 'Career & Jobs',
        slug: 'career-jobs',
        description: 'Career advice, job hunting tips, interview preparation, and professional development.',
        icon: 'briefcase',
        color: '#9b59b6',
        order: 7
      },
      {
        name: 'Show & Tell',
        slug: 'show-and-tell',
        description: 'Share your projects, get feedback, and celebrate your achievements with the community.',
        icon: 'star',
        color: '#f39c12',
        order: 8
      }
    ];

    await safeBulkCreate(ForumCategory, forumCategories, 'slug');
    console.log('');

    // ==================== SEED LESSONS ====================
    console.log('--- Seeding Lessons ---');
    
    const htmlCourse = await Course.findOne({ where: { slug: 'html-tutorial' } });
    const cssCourse = await Course.findOne({ where: { slug: 'css-tutorial' } });
    const jsCourse = await Course.findOne({ where: { slug: 'javascript-tutorial' } });
    
    if (htmlCourse) {
      const htmlLessons = [
        {
          courseId: htmlCourse.id,
          title: 'Introduction to HTML',
          slug: 'introduction-to-html',
          content: `# Introduction to HTML

HTML (HyperText Markup Language) is the standard markup language for creating web pages.

## What is HTML?

- HTML stands for HyperText Markup Language
- HTML is the standard markup language for Web pages
- HTML elements are the building blocks of HTML pages
- HTML elements are represented by tags

## Your First HTML Document

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first HTML page.</p>
</body>
</html>
\`\`\`

## Key Points

1. The <!DOCTYPE html> declaration defines this document as HTML5
2. The <html> element is the root element
3. The <head> element contains meta information
4. The <body> element contains the visible content`,
          order: 1,
          type: 'theory',
          estimatedMinutes: 15,
          isPublished: true
        },
        {
          courseId: htmlCourse.id,
          title: 'HTML Elements and Tags',
          slug: 'html-elements-and-tags',
          content: `# HTML Elements and Tags

## Anatomy of an HTML Element

An HTML element usually consists of a start tag and end tag, with content in between.

\`\`\`html
<tagname>Content goes here...</tagname>
\`\`\`

## Common HTML Tags

### Headings
\`\`\`html
<h1>Heading 1 - Largest</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6 - Smallest</h6>
\`\`\`

### Paragraphs and Text
\`\`\`html
<p>This is a paragraph.</p>
<strong>Bold text</strong>
<em>Italic text</em>
<br> <!-- Line break -->
<hr> <!-- Horizontal rule -->
\`\`\`

### Links
\`\`\`html
<a href="https://example.com">Click me</a>
<a href="page.html" target="_blank">Open in new tab</a>
\`\`\`

### Images
\`\`\`html
<img src="image.jpg" alt="Description of image">
\`\`\``,
          order: 2,
          type: 'theory',
          estimatedMinutes: 20,
          isPublished: true
        },
        {
          courseId: htmlCourse.id,
          title: 'HTML Lists and Tables',
          slug: 'html-lists-tables',
          content: `# HTML Lists and Tables

## Unordered Lists
\`\`\`html
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>
\`\`\`

## Ordered Lists
\`\`\`html
<ol>
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
</ol>
\`\`\`

## Tables
\`\`\`html
<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Age</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>John</td>
            <td>25</td>
        </tr>
    </tbody>
</table>
\`\`\``,
          order: 3,
          type: 'theory',
          estimatedMinutes: 20,
          isPublished: true
        },
        {
          courseId: htmlCourse.id,
          title: 'HTML Forms',
          slug: 'html-forms',
          content: `# HTML Forms

Forms are used to collect user input.

## Basic Form Structure
\`\`\`html
<form action="/submit" method="POST">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
    
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
    
    <label for="password">Password:</label>
    <input type="password" id="password" name="password">
    
    <button type="submit">Submit</button>
</form>
\`\`\`

## Input Types
- text, email, password, number
- checkbox, radio
- date, time, datetime-local
- file, color, range
- submit, reset, button`,
          order: 4,
          type: 'theory',
          estimatedMinutes: 25,
          isPublished: true
        },
        {
          courseId: htmlCourse.id,
          title: 'Semantic HTML',
          slug: 'semantic-html',
          content: `# Semantic HTML

Semantic elements clearly describe their meaning to both the browser and developer.

## Common Semantic Elements

\`\`\`html
<header>Site header content</header>
<nav>Navigation links</nav>
<main>Main content of the page</main>
<article>Self-contained content</article>
<section>Grouped content</section>
<aside>Sidebar content</aside>
<footer>Footer content</footer>
\`\`\`

## Why Use Semantic HTML?
1. Better accessibility for screen readers
2. Improved SEO
3. Easier to read and maintain code
4. Better structure for styling`,
          order: 5,
          type: 'theory',
          estimatedMinutes: 15,
          isPublished: true
        },
        {
          courseId: htmlCourse.id,
          title: 'Practice: Build a Portfolio Page',
          slug: 'practice-portfolio-page',
          content: `# Practice: Build a Portfolio Page

Create a simple portfolio page with:
1. A header with your name and navigation
2. An about section
3. A skills list
4. A contact form
5. A footer`,
          order: 6,
          type: 'practice',
          estimatedMinutes: 45,
          codeTemplate: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
</head>
<body>
    <!-- Create your header with nav here -->
    
    <!-- Create your about section here -->
    
    <!-- Create your skills list here -->
    
    <!-- Create your contact form here -->
    
    <!-- Create your footer here -->
</body>
</html>`,
          hints: JSON.stringify([
            'Use semantic elements like <header>, <main>, <section>, <footer>',
            'Use <nav> with <ul> for navigation',
            'Use <form> with proper input types',
            'Remember alt attributes for images'
          ]),
          isPublished: true
        }
      ];

      await safeBulkCreate(Lesson, htmlLessons, 'slug');
    }
    console.log('');

    // ==================== SEED QUESTIONS ====================
    console.log('--- Seeding Questions (Interview and Beginner Friendly) ---');
    console.log(`  - Total questions to seed: ${allQuestions.length}`);
    
    const questions = allQuestions;

    // Insert questions one by one to avoid duplicates
    let questionsCreated = 0;
    for (const q of questions) {
      const existing = await Question.findOne({ 
        where: { 
          question: q.question,
          category: q.category 
        } 
      });
      if (!existing) {
        await Question.create(q);
        questionsCreated++;
      }
    }
    console.log(`  - Created ${questionsCreated} new questions (${questions.length - questionsCreated} already existed)`);
    console.log('');

    // ==================== SUMMARY ====================
    const userCount = await User.count();
    const courseCount = await Course.count();
    const lessonCount = await Lesson.count();
    const questionCount = await Question.count();
    const articleCount = await Article.count();
    const forumCategoryCount = await ForumCategory.count();

    console.log('=========================================');
    console.log('         SEEDING COMPLETE!              ');
    console.log('=========================================');
    console.log('');
    console.log('  Admin Login:');
    console.log('    Email:    admin@edifix.com');
    console.log('    Password: 2026@edifixadmin');
    console.log('');
    console.log('  Database Summary:');
    console.log(`    - ${userCount} Users`);
    console.log(`    - ${courseCount} Courses`);
    console.log(`    - ${lessonCount} Lessons`);
    console.log(`    - ${questionCount} Questions`);
    console.log(`    - ${articleCount} Articles`);
    console.log(`    - ${forumCategoryCount} Forum Categories`);
    console.log('');
    console.log('=========================================');

    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
