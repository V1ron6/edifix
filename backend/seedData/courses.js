// Complete Course Data based on W3Schools curriculum
// All content is comprehensive and detailed - no external links required

export const allCourses = [
  // ==================== FRONTEND LEARNING PATH ====================
  
  // 1. HTML Tutorial - Complete Course
  {
    title: 'HTML Tutorial',
    slug: 'html-tutorial',
    description: 'HTML is the standard markup language for Web pages. Learn HTML from this comprehensive tutorial covering all fundamental concepts from basic elements to advanced HTML5 features. Master document structure, text formatting, links, images, tables, lists, forms, semantic elements, and multimedia. This course provides hands-on examples and practice exercises to build real-world web pages.',
    category: 'frontend',
    order: 1,
    difficulty: 'beginner',
    estimatedHours: 12,
    isPublished: true,
    thumbnail: '/images/courses/html.png'
  },
  
  // 2. HTML Forms - Complete Course
  {
    title: 'HTML Forms',
    slug: 'html-forms',
    description: 'Master HTML forms to create interactive user interfaces. Learn all input types including text, email, password, number, date, file uploads, checkboxes, radio buttons, and more. Understand form validation, accessibility best practices, form attributes, and how to structure forms for optimal user experience. Build real-world forms for login, registration, contact, and surveys.',
    category: 'frontend',
    order: 2,
    difficulty: 'beginner',
    estimatedHours: 5,
    isPublished: true,
    thumbnail: '/images/courses/html-forms.png'
  },
  
  // 3. HTML5 Graphics
  {
    title: 'HTML5 Graphics',
    slug: 'html5-graphics',
    description: 'Create stunning visual content with HTML5 Canvas and SVG. Learn to draw shapes, paths, text, images, and create animations directly in the browser. Master the Canvas 2D API for dynamic graphics and understand SVG for scalable vector graphics. Build interactive visualizations, games, and artistic projects.',
    category: 'frontend',
    order: 3,
    difficulty: 'intermediate',
    estimatedHours: 8,
    isPublished: true,
    thumbnail: '/images/courses/html5-graphics.png'
  },
  
  // 4. HTML5 APIs
  {
    title: 'HTML5 APIs',
    slug: 'html5-apis',
    description: 'Explore powerful HTML5 APIs for building modern web applications. Learn Geolocation for location-based services, Web Storage (localStorage and sessionStorage) for client-side data persistence, Web Workers for background processing, Drag and Drop for interactive interfaces, and Server-Sent Events for real-time updates.',
    category: 'frontend',
    order: 4,
    difficulty: 'intermediate',
    estimatedHours: 10,
    isPublished: true,
    thumbnail: '/images/courses/html5-apis.png'
  },
  
  // 5. CSS Tutorial - Complete Course
  {
    title: 'CSS Tutorial',
    slug: 'css-tutorial',
    description: 'CSS (Cascading Style Sheets) is the language for styling web pages. Learn selectors, colors, backgrounds, borders, margins, padding, the box model, text formatting, fonts, icons, links, lists, tables, and display properties. Master positioning, overflow, float, combinators, pseudo-classes, pseudo-elements, and CSS specificity. Build beautiful, professional websites.',
    category: 'frontend',
    order: 5,
    difficulty: 'beginner',
    estimatedHours: 15,
    isPublished: true,
    thumbnail: '/images/courses/css.png'
  },
  
  // 6. CSS Flexbox
  {
    title: 'CSS Flexbox',
    slug: 'css-flexbox',
    description: 'Master CSS Flexbox for creating flexible, responsive layouts. Learn flex containers and flex items, main axis and cross axis concepts, justify-content, align-items, align-content, flex-wrap, flex-grow, flex-shrink, flex-basis, and order. Build common layout patterns including navigation bars, card grids, equal-height columns, and centered content.',
    category: 'frontend',
    order: 6,
    difficulty: 'intermediate',
    estimatedHours: 6,
    isPublished: true,
    thumbnail: '/images/courses/css-flexbox.png'
  },
  
  // 7. CSS Grid
  {
    title: 'CSS Grid',
    slug: 'css-grid',
    description: 'Learn CSS Grid Layout for powerful two-dimensional page layouts. Master grid containers, grid items, grid lines, grid tracks, grid areas, grid-template-columns, grid-template-rows, grid-template-areas, gap, and item placement. Build complex layouts including magazine-style layouts, dashboards, and responsive grid systems.',
    category: 'frontend',
    order: 7,
    difficulty: 'intermediate',
    estimatedHours: 7,
    isPublished: true,
    thumbnail: '/images/courses/css-grid.png'
  },
  
  // 8. Responsive Web Design
  {
    title: 'Responsive Web Design',
    slug: 'responsive-web-design',
    description: 'Create websites that work perfectly on all devices and screen sizes. Learn the viewport meta tag, media queries, responsive images, responsive typography, mobile-first design principles, and responsive frameworks. Understand breakpoints, fluid grids, and flexible layouts. Build websites that provide optimal viewing experience across desktop, tablet, and mobile.',
    category: 'frontend',
    order: 8,
    difficulty: 'intermediate',
    estimatedHours: 7,
    isPublished: true,
    thumbnail: '/images/courses/responsive.png'
  },
  
  // 9. CSS Animations
  {
    title: 'CSS Animations',
    slug: 'css-animations',
    description: 'Bring your websites to life with CSS animations and transitions. Learn transition properties, timing functions, transform (translate, rotate, scale, skew), keyframe animations, animation properties, and performance optimization. Create engaging hover effects, loading animations, page transitions, and interactive UI elements.',
    category: 'frontend',
    order: 9,
    difficulty: 'intermediate',
    estimatedHours: 6,
    isPublished: true,
    thumbnail: '/images/courses/css-animations.png'
  },
  
  // 10. JavaScript Tutorial - Complete Course
  {
    title: 'JavaScript Tutorial',
    slug: 'javascript-tutorial',
    description: 'JavaScript is the programming language of the Web. Learn variables, data types, operators, strings, numbers, arrays, objects, functions, conditionals, loops, scope, hoisting, closures, and error handling. Master the fundamentals that power dynamic web applications, from basic syntax to complex programming concepts.',
    category: 'frontend',
    order: 10,
    difficulty: 'beginner',
    estimatedHours: 20,
    isPublished: true,
    thumbnail: '/images/courses/javascript.png'
  },
  
  // 11. JavaScript DOM
  {
    title: 'JavaScript DOM',
    slug: 'javascript-dom',
    description: 'Learn to manipulate web pages with the Document Object Model (DOM). Master selecting elements, traversing the DOM tree, modifying content, attributes, and styles, creating and removing elements, event handling, event bubbling and capturing, and event delegation. Build interactive, dynamic web applications.',
    category: 'frontend',
    order: 11,
    difficulty: 'intermediate',
    estimatedHours: 10,
    isPublished: true,
    thumbnail: '/images/courses/js-dom.png'
  },
  
  // 12. JavaScript ES6+
  {
    title: 'JavaScript ES6+',
    slug: 'javascript-es6-modern',
    description: 'Master modern JavaScript (ES6 and beyond). Learn let and const, arrow functions, template literals, destructuring, spread and rest operators, default parameters, enhanced object literals, classes, modules (import/export), symbols, iterators, generators, promises, async/await, and new array/object methods.',
    category: 'frontend',
    order: 12,
    difficulty: 'intermediate',
    estimatedHours: 12,
    isPublished: true,
    thumbnail: '/images/courses/js-es6.png'
  },
  
  // 13. JavaScript AJAX and Fetch
  {
    title: 'JavaScript AJAX and Fetch',
    slug: 'javascript-ajax-fetch',
    description: 'Learn asynchronous JavaScript for communicating with servers. Understand AJAX concepts, XMLHttpRequest, the Fetch API, working with JSON, handling responses and errors, async/await with fetch, and making API calls. Build applications that load data dynamically without page refreshes.',
    category: 'frontend',
    order: 13,
    difficulty: 'intermediate',
    estimatedHours: 7,
    isPublished: true,
    thumbnail: '/images/courses/js-fetch.png'
  },
  
  // 14. JavaScript JSON
  {
    title: 'JavaScript JSON',
    slug: 'javascript-json',
    description: 'Understand JSON (JavaScript Object Notation), the most common data format for web APIs. Learn JSON syntax, data types, parsing JSON with JSON.parse(), converting to JSON with JSON.stringify(), working with nested data, and best practices for data exchange between client and server.',
    category: 'frontend',
    order: 14,
    difficulty: 'beginner',
    estimatedHours: 4,
    isPublished: true,
    thumbnail: '/images/courses/js-json.png'
  },
  
  // 15. Git Tutorial
  {
    title: 'Git Tutorial',
    slug: 'git-tutorial',
    description: 'Git is the most widely used version control system. Learn repository initialization, staging and committing, viewing history, branching and merging, resolving conflicts, remote repositories, pushing and pulling, pull requests, Git workflow strategies, and collaboration best practices. Essential for any developer.',
    category: 'frontend',
    order: 15,
    difficulty: 'beginner',
    estimatedHours: 8,
    isPublished: true,
    thumbnail: '/images/courses/git.png'
  },
  
  // 16. Web Hosting and Deployment
  {
    title: 'Web Hosting and Deployment',
    slug: 'web-hosting-deployment',
    description: 'Learn to deploy your projects to the web. Understand hosting options, domain names, DNS configuration, GitHub Pages for static sites, Netlify and Vercel deployment, environment variables, continuous deployment from Git, and SSL certificates. Make your projects accessible to the world.',
    category: 'frontend',
    order: 16,
    difficulty: 'intermediate',
    estimatedHours: 5,
    isPublished: true,
    thumbnail: '/images/courses/deployment.png'
  },
  
  // ==================== BACKEND LEARNING PATH ====================
  
  // 17. Node.js Tutorial
  {
    title: 'Node.js Tutorial',
    slug: 'nodejs-tutorial',
    description: 'Node.js is a JavaScript runtime for server-side programming. Learn the Node.js architecture, event-driven programming, the event loop, built-in modules (fs, path, http, url), creating servers, working with files, streams and buffers, and npm package management. Build fast, scalable network applications.',
    category: 'backend',
    order: 1,
    difficulty: 'intermediate',
    estimatedHours: 15,
    isPublished: true,
    thumbnail: '/images/courses/nodejs.png'
  },
  
  // 18. NPM and Package Management
  {
    title: 'NPM and Package Management',
    slug: 'npm-package-management',
    description: 'Master NPM (Node Package Manager) for managing JavaScript packages. Learn package.json configuration, installing and updating packages, semantic versioning, scripts, dependencies vs devDependencies, npx, publishing packages, and security best practices. Essential for any Node.js developer.',
    category: 'backend',
    order: 2,
    difficulty: 'beginner',
    estimatedHours: 5,
    isPublished: true,
    thumbnail: '/images/courses/npm.png'
  },
  
  // 19. SQL Tutorial
  {
    title: 'SQL Tutorial',
    slug: 'sql-tutorial',
    description: 'SQL (Structured Query Language) is the standard language for relational databases. Learn SELECT, INSERT, UPDATE, DELETE, WHERE clauses, operators, ORDER BY, GROUP BY, HAVING, JOINs (INNER, LEFT, RIGHT, FULL), subqueries, aggregate functions, and database normalization. Query and manage data effectively.',
    category: 'backend',
    order: 3,
    difficulty: 'intermediate',
    estimatedHours: 14,
    isPublished: true,
    thumbnail: '/images/courses/sql.png'
  },
  
  // 20. MySQL Tutorial
  {
    title: 'MySQL Tutorial',
    slug: 'mysql-tutorial',
    description: 'MySQL is the most popular open-source relational database. Learn database and table creation, data types, constraints, indexes, stored procedures, triggers, views, transactions, user management, and Node.js integration with mysql2. Build robust database-driven applications.',
    category: 'backend',
    order: 4,
    difficulty: 'intermediate',
    estimatedHours: 12,
    isPublished: true,
    thumbnail: '/images/courses/mysql.png'
  },
  
  // 21. MongoDB Tutorial
  {
    title: 'MongoDB Tutorial',
    slug: 'mongodb-tutorial',
    description: 'MongoDB is a popular NoSQL document database. Learn document structure, CRUD operations, query operators, projection, sorting, indexing, aggregation pipeline, data modeling, relationships, and Node.js integration with Mongoose. Build flexible, scalable applications with schema-less data.',
    category: 'backend',
    order: 5,
    difficulty: 'intermediate',
    estimatedHours: 12,
    isPublished: true,
    thumbnail: '/images/courses/mongodb.png'
  },
  
  // 22. Express.js Tutorial
  {
    title: 'Express.js Tutorial',
    slug: 'expressjs-tutorial',
    description: 'Express.js is the most popular Node.js web framework. Learn routing, middleware, request and response objects, serving static files, template engines, error handling, RESTful API design, and MVC architecture. Build professional web applications and APIs with Express.',
    category: 'backend',
    order: 6,
    difficulty: 'intermediate',
    estimatedHours: 14,
    isPublished: true,
    thumbnail: '/images/courses/expressjs.png'
  },
  
  // 23. RESTful API Design
  {
    title: 'RESTful API Design',
    slug: 'restful-api-design',
    description: 'Learn to design and build professional RESTful APIs. Understand REST principles, HTTP methods, status codes, resource naming, versioning, pagination, filtering, sorting, authentication, documentation with OpenAPI/Swagger, and API testing. Create APIs that developers love to use.',
    category: 'backend',
    order: 7,
    difficulty: 'intermediate',
    estimatedHours: 10,
    isPublished: true,
    thumbnail: '/images/courses/rest-api.png'
  },
  
  // 24. Authentication with JWT
  {
    title: 'Authentication with JWT',
    slug: 'authentication-jwt',
    description: 'Secure your applications with JSON Web Tokens (JWT). Learn authentication vs authorization, password hashing with bcrypt, JWT structure and claims, access tokens and refresh tokens, token storage best practices, session management, OAuth 2.0 concepts, and implementing secure login systems.',
    category: 'backend',
    order: 8,
    difficulty: 'advanced',
    estimatedHours: 10,
    isPublished: true,
    thumbnail: '/images/courses/jwt.png'
  },
  
  // 25. Web Security Basics
  {
    title: 'Web Security Basics',
    slug: 'web-security-basics',
    description: 'Protect your applications from common vulnerabilities. Learn about OWASP Top 10, SQL injection prevention, XSS (Cross-Site Scripting), CSRF (Cross-Site Request Forgery), CORS configuration, security headers with Helmet, input validation, rate limiting, and secure coding practices.',
    category: 'backend',
    order: 9,
    difficulty: 'advanced',
    estimatedHours: 8,
    isPublished: true,
    thumbnail: '/images/courses/security.png'
  },
  
  // 26. Middleware Patterns
  {
    title: 'Middleware Patterns',
    slug: 'middleware-patterns',
    description: 'Master Express.js middleware for building modular applications. Learn built-in middleware, third-party middleware, custom middleware creation, error-handling middleware, authentication middleware, logging, rate limiting, request validation, and middleware composition patterns.',
    category: 'backend',
    order: 10,
    difficulty: 'intermediate',
    estimatedHours: 6,
    isPublished: true,
    thumbnail: '/images/courses/middleware.png'
  },
  
  // 27. Backend Deployment
  {
    title: 'Backend Deployment',
    slug: 'backend-deployment',
    description: 'Deploy your backend applications to production. Learn about hosting platforms (Railway, Render, Heroku, AWS), environment variables, production configuration, process managers (PM2), logging, monitoring, SSL certificates, domain setup, and continuous deployment pipelines.',
    category: 'backend',
    order: 11,
    difficulty: 'advanced',
    estimatedHours: 10,
    isPublished: true,
    thumbnail: '/images/courses/backend-deploy.png'
  },
  
  // 28. Docker for Developers
  {
    title: 'Docker for Developers',
    slug: 'docker-for-developers',
    description: 'Containerize your applications with Docker. Learn Docker concepts, Dockerfiles, building images, running containers, Docker Hub, volumes and networking, Docker Compose for multi-container applications, and container orchestration basics. Deploy consistent applications anywhere.',
    category: 'backend',
    order: 12,
    difficulty: 'advanced',
    estimatedHours: 12,
    isPublished: true,
    thumbnail: '/images/courses/docker.png'
  }
];

export default allCourses;
