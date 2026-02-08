import sequelize from './Config/database.js';
import { User, Course, Lesson, Question } from './Model/index.js';
import bcrypt from 'bcryptjs';

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
      const adminPassword = await bcrypt.hash('admin123', 10);
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
      // Frontend Learning Path
      {
        title: 'HTML Fundamentals',
        slug: 'html-fundamentals',
        description: 'Learn the building blocks of the web. HTML (HyperText Markup Language) is the foundation of every website.',
        category: 'frontend',
        order: 1,
        difficulty: 'beginner',
        estimatedHours: 8,
        isPublished: true
      },
      {
        title: 'CSS Styling',
        slug: 'css-styling',
        description: 'Make your websites beautiful with CSS. Learn layouts, colors, animations, and responsive design.',
        category: 'frontend',
        order: 2,
        difficulty: 'beginner',
        estimatedHours: 12,
        isPublished: true
      },
      {
        title: 'JavaScript Essentials',
        slug: 'javascript-essentials',
        description: 'Add interactivity to your websites. Learn programming concepts, DOM manipulation, and modern ES6+ features.',
        category: 'frontend',
        order: 3,
        difficulty: 'intermediate',
        estimatedHours: 20,
        isPublished: true
      },
      {
        title: 'Git and Version Control',
        slug: 'git-version-control',
        description: 'Track your code changes and collaborate with others using Git and GitHub.',
        category: 'frontend',
        order: 4,
        difficulty: 'beginner',
        estimatedHours: 6,
        isPublished: true
      },
      {
        title: 'Frontend Deployment',
        slug: 'frontend-deployment',
        description: 'Deploy your frontend projects to the web using Netlify, Vercel, and GitHub Pages.',
        category: 'frontend',
        order: 5,
        difficulty: 'intermediate',
        estimatedHours: 4,
        isPublished: true
      },
      // Backend Learning Path
      {
        title: 'Node.js Fundamentals',
        slug: 'nodejs-fundamentals',
        description: 'Learn server-side JavaScript with Node.js. Build command-line tools and understand the runtime.',
        category: 'backend',
        order: 1,
        difficulty: 'intermediate',
        estimatedHours: 10,
        isPublished: true
      },
      {
        title: 'Databases (MySQL and MongoDB)',
        slug: 'databases',
        description: 'Store and retrieve data efficiently. Learn SQL with MySQL and NoSQL with MongoDB.',
        category: 'backend',
        order: 2,
        difficulty: 'intermediate',
        estimatedHours: 15,
        isPublished: true
      },
      {
        title: 'Express.js Framework',
        slug: 'expressjs-framework',
        description: 'Build RESTful APIs with Express.js. Learn routing, controllers, and API design.',
        category: 'backend',
        order: 3,
        difficulty: 'intermediate',
        estimatedHours: 12,
        isPublished: true
      },
      {
        title: 'Middleware and Authentication',
        slug: 'middleware-authentication',
        description: 'Secure your APIs with middleware, JWT authentication, and authorization.',
        category: 'backend',
        order: 4,
        difficulty: 'advanced',
        estimatedHours: 10,
        isPublished: true
      },
      {
        title: 'CORS and Security',
        slug: 'cors-security',
        description: 'Understand Cross-Origin Resource Sharing and implement security best practices.',
        category: 'backend',
        order: 5,
        difficulty: 'intermediate',
        estimatedHours: 6,
        isPublished: true
      },
      {
        title: 'Backend Deployment',
        slug: 'backend-deployment',
        description: 'Deploy your backend to production using Railway, Render, and AWS.',
        category: 'backend',
        order: 6,
        difficulty: 'advanced',
        estimatedHours: 8,
        isPublished: true
      }
    ];

    await safeBulkCreate(Course, allCourses, 'slug');
    console.log('');

    // ==================== SEED LESSONS ====================
    console.log('--- Seeding Lessons ---');
    
    const htmlCourse = await Course.findOne({ where: { slug: 'html-fundamentals' } });
    const cssCourse = await Course.findOne({ where: { slug: 'css-styling' } });
    const jsCourse = await Course.findOne({ where: { slug: 'javascript-essentials' } });
    
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
    
    const questions = [
      // ========== HTML Questions ==========
      {
        category: 'html',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'What does HTML stand for?',
        options: JSON.stringify(['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language']),
        correctAnswer: '0',
        explanation: 'HTML stands for HyperText Markup Language. It is the standard markup language for creating web pages.',
        points: 10,
        tags: JSON.stringify(['interview', 'beginner-friendly', 'fundamentals']),
        source: 'interview'
      },
      {
        category: 'html',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'Which HTML tag is used to define an internal style sheet?',
        options: JSON.stringify(['<css>', '<style>', '<script>', '<styles>']),
        correctAnswer: '1',
        explanation: 'The <style> tag is used to define internal CSS styles within an HTML document.',
        points: 10,
        tags: JSON.stringify(['interview', 'beginner-friendly']),
        source: 'interview'
      },
      {
        category: 'html',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'Which HTML attribute is used to define inline styles?',
        options: JSON.stringify(['class', 'styles', 'style', 'font']),
        correctAnswer: '2',
        explanation: 'The style attribute is used to add inline CSS styles directly to an HTML element.',
        points: 10,
        tags: JSON.stringify(['interview', 'beginner-friendly']),
        source: 'interview'
      },
      {
        category: 'html',
        difficulty: 'beginner',
        type: 'true_false',
        question: 'The <br> tag in HTML requires a closing tag.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: '1',
        explanation: '<br> is a self-closing tag (void element) and does not require a closing tag.',
        points: 10,
        tags: JSON.stringify(['beginner-friendly']),
        source: 'interview'
      },
      {
        category: 'html',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'Which tag is used for the largest heading in HTML?',
        options: JSON.stringify(['<h6>', '<heading>', '<h1>', '<head>']),
        correctAnswer: '2',
        explanation: '<h1> defines the largest heading, while <h6> defines the smallest.',
        points: 10,
        tags: JSON.stringify(['beginner-friendly', 'fundamentals']),
        source: 'interview'
      },
      {
        category: 'html',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is the purpose of the alt attribute in an <img> tag?',
        options: JSON.stringify(['To specify the image source', 'To provide alternative text for accessibility', 'To set the image dimensions', 'To add a tooltip']),
        correctAnswer: '1',
        explanation: 'The alt attribute provides alternative text that is displayed if the image cannot load and is read by screen readers for accessibility.',
        points: 15,
        tags: JSON.stringify(['interview', 'accessibility']),
        source: 'interview'
      },
      {
        category: 'html',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'Which HTML5 element is used for navigation links?',
        options: JSON.stringify(['<navigation>', '<nav>', '<navigate>', '<links>']),
        correctAnswer: '1',
        explanation: 'The <nav> element is a semantic HTML5 element used to define a set of navigation links.',
        points: 15,
        tags: JSON.stringify(['interview', 'semantic-html']),
        source: 'interview'
      },
      {
        category: 'html',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is the difference between <div> and <span>?',
        options: JSON.stringify(['div is inline, span is block', 'div is block-level, span is inline', 'They are the same', 'span is deprecated']),
        correctAnswer: '1',
        explanation: '<div> is a block-level element that starts on a new line, while <span> is an inline element that does not break the flow.',
        points: 15,
        tags: JSON.stringify(['interview', 'fundamentals']),
        source: 'interview'
      },
      {
        category: 'html',
        difficulty: 'advanced',
        type: 'multiple_choice',
        question: 'What is the purpose of the data-* attribute in HTML5?',
        options: JSON.stringify(['To store custom data for CSS', 'To store custom data private to the page or application', 'To validate form data', 'To create database connections']),
        correctAnswer: '1',
        explanation: 'data-* attributes allow you to store custom data on HTML elements that can be accessed via JavaScript.',
        points: 20,
        tags: JSON.stringify(['interview', 'advanced']),
        source: 'interview'
      },
      {
        category: 'html',
        difficulty: 'advanced',
        type: 'short_answer',
        question: 'Explain the difference between localStorage and sessionStorage.',
        options: null,
        correctAnswer: 'localStorage persists data with no expiration until explicitly cleared, while sessionStorage data is cleared when the browser tab is closed.',
        explanation: 'Both are Web Storage APIs. localStorage has no expiration, sessionStorage is cleared when the session ends.',
        points: 25,
        tags: JSON.stringify(['interview', 'web-storage']),
        source: 'interview'
      },

      // ========== CSS Questions ==========
      {
        category: 'css',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'What does CSS stand for?',
        options: JSON.stringify(['Colorful Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets']),
        correctAnswer: '1',
        explanation: 'CSS stands for Cascading Style Sheets, used to style and layout web pages.',
        points: 10,
        tags: JSON.stringify(['interview', 'beginner-friendly', 'fundamentals']),
        source: 'interview'
      },
      {
        category: 'css',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'Which property is used to change the background color?',
        options: JSON.stringify(['bgcolor', 'color', 'background-color', 'background']),
        correctAnswer: '2',
        explanation: 'background-color is the CSS property specifically for setting background colors. background is a shorthand.',
        points: 10,
        tags: JSON.stringify(['beginner-friendly']),
        source: 'interview'
      },
      {
        category: 'css',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'Which CSS property controls the text size?',
        options: JSON.stringify(['text-size', 'font-size', 'text-style', 'font-style']),
        correctAnswer: '1',
        explanation: 'font-size is the CSS property used to control the size of text.',
        points: 10,
        tags: JSON.stringify(['beginner-friendly']),
        source: 'interview'
      },
      {
        category: 'css',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is the CSS Box Model order from inside to outside?',
        options: JSON.stringify(['margin, border, padding, content', 'content, padding, border, margin', 'padding, content, border, margin', 'content, margin, padding, border']),
        correctAnswer: '1',
        explanation: 'The CSS Box Model from inside out is: content, padding, border, margin.',
        points: 15,
        tags: JSON.stringify(['interview', 'fundamentals']),
        source: 'interview'
      },
      {
        category: 'css',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is the difference between display: none and visibility: hidden?',
        options: JSON.stringify(['They are the same', 'display:none removes from flow, visibility:hidden keeps space', 'visibility:hidden removes from flow', 'Neither affects layout']),
        correctAnswer: '1',
        explanation: 'display:none removes the element from the document flow entirely. visibility:hidden hides the element but it still takes up space.',
        points: 15,
        tags: JSON.stringify(['interview']),
        source: 'interview'
      },
      {
        category: 'css',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'Which CSS property is used to create flexible layouts?',
        options: JSON.stringify(['flex', 'display: flex', 'flexbox', 'flexible']),
        correctAnswer: '1',
        explanation: 'display: flex enables flexbox layout on a container, allowing flexible arrangement of child elements.',
        points: 15,
        tags: JSON.stringify(['interview', 'flexbox']),
        source: 'interview'
      },
      {
        category: 'css',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What does z-index control?',
        options: JSON.stringify(['Zoom level', 'Element stacking order', 'Element height', 'Animation speed']),
        correctAnswer: '1',
        explanation: 'z-index controls the stacking order of positioned elements. Higher values appear on top.',
        points: 15,
        tags: JSON.stringify(['interview']),
        source: 'interview'
      },
      {
        category: 'css',
        difficulty: 'advanced',
        type: 'multiple_choice',
        question: 'What is CSS specificity order (lowest to highest)?',
        options: JSON.stringify(['ID, Class, Element, Inline', 'Element, Class, ID, Inline', 'Inline, ID, Class, Element', 'Class, Element, ID, Inline']),
        correctAnswer: '1',
        explanation: 'CSS specificity from lowest to highest: Element selectors, Class selectors, ID selectors, Inline styles.',
        points: 20,
        tags: JSON.stringify(['interview', 'specificity']),
        source: 'interview'
      },
      {
        category: 'css',
        difficulty: 'advanced',
        type: 'multiple_choice',
        question: 'What is the purpose of CSS Grid?',
        options: JSON.stringify(['Creating animations', 'Two-dimensional layouts', 'One-dimensional layouts', 'Adding shadows']),
        correctAnswer: '1',
        explanation: 'CSS Grid is designed for two-dimensional layouts (rows AND columns), while Flexbox is primarily one-dimensional.',
        points: 20,
        tags: JSON.stringify(['interview', 'css-grid']),
        source: 'interview'
      },

      // ========== JavaScript Questions ==========
      {
        category: 'javascript',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'Which keyword is used to declare a constant in JavaScript?',
        options: JSON.stringify(['var', 'let', 'const', 'constant']),
        correctAnswer: '2',
        explanation: 'const is used to declare constants - variables that cannot be reassigned.',
        points: 10,
        tags: JSON.stringify(['interview', 'beginner-friendly', 'es6']),
        source: 'interview'
      },
      {
        category: 'javascript',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'What is the output of typeof null?',
        options: JSON.stringify(['null', 'undefined', 'object', 'string']),
        correctAnswer: '2',
        explanation: 'typeof null returns "object" - this is a known bug in JavaScript that has been kept for legacy reasons.',
        points: 10,
        tags: JSON.stringify(['interview', 'tricky']),
        source: 'interview'
      },
      {
        category: 'javascript',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'Which method adds an element to the end of an array?',
        options: JSON.stringify(['push()', 'pop()', 'shift()', 'unshift()']),
        correctAnswer: '0',
        explanation: 'push() adds elements to the end, pop() removes from end, shift() removes from start, unshift() adds to start.',
        points: 10,
        tags: JSON.stringify(['interview', 'beginner-friendly', 'arrays']),
        source: 'interview'
      },
      {
        category: 'javascript',
        difficulty: 'beginner',
        type: 'true_false',
        question: 'JavaScript is a statically typed language.',
        options: JSON.stringify(['True', 'False']),
        correctAnswer: '1',
        explanation: 'JavaScript is dynamically typed - variable types are determined at runtime, not compile time.',
        points: 10,
        tags: JSON.stringify(['beginner-friendly']),
        source: 'interview'
      },
      {
        category: 'javascript',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is the difference between == and ===?',
        options: JSON.stringify(['No difference', '== checks type, === does not', '=== checks type and value, == only value', '== is deprecated']),
        correctAnswer: '2',
        explanation: '=== (strict equality) checks both type and value, while == (loose equality) performs type coercion before comparison.',
        points: 15,
        tags: JSON.stringify(['interview', 'fundamentals']),
        source: 'interview'
      },
      {
        category: 'javascript',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is a closure in JavaScript?',
        options: JSON.stringify(['A way to close browser windows', 'A function with access to its outer scope', 'A method to end loops', 'A type of variable']),
        correctAnswer: '1',
        explanation: 'A closure is a function that has access to variables from its outer (enclosing) scope, even after the outer function has returned.',
        points: 15,
        tags: JSON.stringify(['interview', 'closures']),
        source: 'interview'
      },
      {
        category: 'javascript',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What does the spread operator (...) do?',
        options: JSON.stringify(['Multiplies numbers', 'Expands iterables into individual elements', 'Creates new variables', 'Defines rest parameters only']),
        correctAnswer: '1',
        explanation: 'The spread operator expands an iterable (array, string, etc.) into individual elements.',
        points: 15,
        tags: JSON.stringify(['interview', 'es6']),
        source: 'interview'
      },
      {
        category: 'javascript',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is the purpose of Promise in JavaScript?',
        options: JSON.stringify(['To make pinky promises', 'To handle asynchronous operations', 'To create constants', 'To define classes']),
        correctAnswer: '1',
        explanation: 'Promises represent the eventual completion (or failure) of an asynchronous operation and its resulting value.',
        points: 15,
        tags: JSON.stringify(['interview', 'async']),
        source: 'interview'
      },
      {
        category: 'javascript',
        difficulty: 'intermediate',
        type: 'code',
        question: 'What is the output of this code?\n\nconsole.log([1, 2, 3].map(x => x * 2));',
        options: JSON.stringify(['[1, 2, 3]', '[2, 4, 6]', '[1, 4, 9]', 'undefined']),
        correctAnswer: '1',
        explanation: 'The map() method creates a new array with the results of calling the provided function on every element. Here each element is multiplied by 2.',
        points: 15,
        tags: JSON.stringify(['interview', 'arrays']),
        source: 'leetcode-easy'
      },
      {
        category: 'javascript',
        difficulty: 'advanced',
        type: 'multiple_choice',
        question: 'What is event delegation?',
        options: JSON.stringify(['Delegating events to another developer', 'Attaching event listener to parent to handle child events', 'Creating custom events', 'Preventing event bubbling']),
        correctAnswer: '1',
        explanation: 'Event delegation is a pattern where you attach a single event listener to a parent element to handle events on its children, utilizing event bubbling.',
        points: 20,
        tags: JSON.stringify(['interview', 'dom', 'events']),
        source: 'interview'
      },
      {
        category: 'javascript',
        difficulty: 'advanced',
        type: 'multiple_choice',
        question: 'What is the event loop in JavaScript?',
        options: JSON.stringify(['A for loop for events', 'Mechanism for handling async operations', 'A type of event listener', 'Loop that runs forever']),
        correctAnswer: '1',
        explanation: 'The event loop is the mechanism that allows JavaScript to perform non-blocking operations by offloading operations to the system kernel when possible.',
        points: 20,
        tags: JSON.stringify(['interview', 'async', 'advanced']),
        source: 'interview'
      },
      {
        category: 'javascript',
        difficulty: 'advanced',
        type: 'code',
        question: 'Write a function to reverse a string without using the built-in reverse() method.',
        options: null,
        correctAnswer: 'function reverseString(str) { return str.split("").reverse().join(""); } // OR using a loop',
        explanation: 'Common approaches: 1) Split to array, reverse, join. 2) Loop from end to start. 3) Recursion.',
        codeTemplate: 'function reverseString(str) {\n  // Your code here\n}',
        expectedOutput: 'reverseString("hello") should return "olleh"',
        points: 25,
        tags: JSON.stringify(['leetcode', 'interview', 'strings']),
        source: 'leetcode-easy'
      },
      {
        category: 'javascript',
        difficulty: 'advanced',
        type: 'code',
        question: 'Write a function to check if a string is a palindrome.',
        options: null,
        correctAnswer: 'function isPalindrome(str) { const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, ""); return cleaned === cleaned.split("").reverse().join(""); }',
        explanation: 'Clean the string (remove non-alphanumeric, lowercase), then compare with its reverse.',
        codeTemplate: 'function isPalindrome(str) {\n  // Your code here\n}',
        expectedOutput: 'isPalindrome("A man a plan a canal Panama") should return true',
        points: 25,
        tags: JSON.stringify(['leetcode', 'interview', 'strings']),
        source: 'leetcode-easy'
      },
      {
        category: 'javascript',
        difficulty: 'advanced',
        type: 'code',
        question: 'Write a function to find the first non-repeating character in a string.',
        options: null,
        correctAnswer: 'function firstNonRepeating(str) { for (let char of str) { if (str.indexOf(char) === str.lastIndexOf(char)) return char; } return null; }',
        explanation: 'Use indexOf and lastIndexOf - if they are equal, the character appears only once.',
        codeTemplate: 'function firstNonRepeating(str) {\n  // Your code here\n}',
        expectedOutput: 'firstNonRepeating("aabbcdd") should return "c"',
        points: 25,
        tags: JSON.stringify(['leetcode', 'interview', 'strings']),
        source: 'leetcode-easy'
      },
      {
        category: 'javascript',
        difficulty: 'advanced',
        type: 'code',
        question: 'Implement a function to flatten a nested array.',
        options: null,
        correctAnswer: 'function flatten(arr) { return arr.reduce((flat, item) => flat.concat(Array.isArray(item) ? flatten(item) : item), []); }',
        explanation: 'Use recursion with reduce and concat, or use arr.flat(Infinity) in modern JS.',
        codeTemplate: 'function flatten(arr) {\n  // Your code here\n}',
        expectedOutput: 'flatten([1, [2, [3, [4]]]]) should return [1, 2, 3, 4]',
        points: 30,
        tags: JSON.stringify(['leetcode', 'interview', 'arrays', 'recursion']),
        source: 'leetcode-medium'
      },
      {
        category: 'javascript',
        difficulty: 'advanced',
        type: 'code',
        question: 'Implement debounce function.',
        options: null,
        correctAnswer: 'function debounce(fn, delay) { let timeoutId; return function(...args) { clearTimeout(timeoutId); timeoutId = setTimeout(() => fn.apply(this, args), delay); }; }',
        explanation: 'Debounce delays execution until after a specified time has passed since the last call.',
        codeTemplate: 'function debounce(fn, delay) {\n  // Your code here\n}',
        expectedOutput: 'Returns a debounced version of the function',
        points: 30,
        tags: JSON.stringify(['interview', 'advanced', 'performance']),
        source: 'interview'
      },
      {
        category: 'javascript',
        difficulty: 'intermediate',
        type: 'code',
        question: 'Write a function to find the maximum element in an array without using Math.max.',
        options: null,
        correctAnswer: 'function findMax(arr) { let max = arr[0]; for (let i = 1; i < arr.length; i++) { if (arr[i] > max) max = arr[i]; } return max; }',
        explanation: 'Iterate through the array, keeping track of the largest value found.',
        codeTemplate: 'function findMax(arr) {\n  // Your code here\n}',
        expectedOutput: 'findMax([3, 1, 4, 1, 5, 9, 2, 6]) should return 9',
        points: 15,
        tags: JSON.stringify(['leetcode', 'beginner-friendly', 'arrays']),
        source: 'leetcode-easy'
      },
      {
        category: 'javascript',
        difficulty: 'intermediate',
        type: 'code',
        question: 'Write a function to remove duplicates from an array.',
        options: null,
        correctAnswer: 'function removeDuplicates(arr) { return [...new Set(arr)]; }',
        explanation: 'Using Set is the most concise way. Alternatively, use filter with indexOf.',
        codeTemplate: 'function removeDuplicates(arr) {\n  // Your code here\n}',
        expectedOutput: 'removeDuplicates([1, 2, 2, 3, 3, 3]) should return [1, 2, 3]',
        points: 15,
        tags: JSON.stringify(['leetcode', 'interview', 'arrays']),
        source: 'leetcode-easy'
      },
      {
        category: 'javascript',
        difficulty: 'advanced',
        type: 'code',
        question: 'Write a function to check if two strings are anagrams.',
        options: null,
        correctAnswer: 'function isAnagram(str1, str2) { const normalize = s => s.toLowerCase().replace(/[^a-z]/g, "").split("").sort().join(""); return normalize(str1) === normalize(str2); }',
        explanation: 'Sort both strings alphabetically and compare, or use character frequency maps.',
        codeTemplate: 'function isAnagram(str1, str2) {\n  // Your code here\n}',
        expectedOutput: 'isAnagram("listen", "silent") should return true',
        points: 25,
        tags: JSON.stringify(['leetcode', 'interview', 'strings']),
        source: 'leetcode-easy'
      },
      {
        category: 'javascript',
        difficulty: 'advanced',
        type: 'code',
        question: 'Implement a function to find the missing number in an array of 1 to n.',
        options: null,
        correctAnswer: 'function findMissing(arr) { const n = arr.length + 1; const expectedSum = (n * (n + 1)) / 2; const actualSum = arr.reduce((a, b) => a + b, 0); return expectedSum - actualSum; }',
        explanation: 'Use the formula for sum of 1 to n: n*(n+1)/2, then subtract actual sum.',
        codeTemplate: 'function findMissing(arr) {\n  // Your code here\n}',
        expectedOutput: 'findMissing([1, 2, 4, 5, 6]) should return 3',
        points: 25,
        tags: JSON.stringify(['leetcode', 'interview', 'math']),
        source: 'leetcode-easy'
      },

      // ========== Git Questions ==========
      {
        category: 'git',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'What command creates a new Git repository?',
        options: JSON.stringify(['git start', 'git create', 'git init', 'git new']),
        correctAnswer: '2',
        explanation: 'git init initializes a new Git repository in the current directory.',
        points: 10,
        tags: JSON.stringify(['interview', 'beginner-friendly']),
        source: 'interview'
      },
      {
        category: 'git',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'Which command stages all changes for commit?',
        options: JSON.stringify(['git commit -a', 'git add .', 'git stage all', 'git push']),
        correctAnswer: '1',
        explanation: 'git add . stages all changes in the current directory and subdirectories.',
        points: 10,
        tags: JSON.stringify(['beginner-friendly']),
        source: 'interview'
      },
      {
        category: 'git',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'What does git clone do?',
        options: JSON.stringify(['Creates a backup', 'Copies a remote repository to local machine', 'Merges branches', 'Deletes a repository']),
        correctAnswer: '1',
        explanation: 'git clone creates a local copy of a remote repository.',
        points: 10,
        tags: JSON.stringify(['beginner-friendly']),
        source: 'interview'
      },
      {
        category: 'git',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is the difference between git merge and git rebase?',
        options: JSON.stringify(['No difference', 'Merge creates a merge commit, rebase rewrites history', 'Rebase is faster', 'Merge is deprecated']),
        correctAnswer: '1',
        explanation: 'Merge creates a merge commit preserving history. Rebase moves/replays commits on top of another branch, creating linear history.',
        points: 15,
        tags: JSON.stringify(['interview']),
        source: 'interview'
      },
      {
        category: 'git',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'How do you undo the last commit but keep the changes?',
        options: JSON.stringify(['git revert HEAD', 'git reset --soft HEAD~1', 'git undo', 'git checkout HEAD~1']),
        correctAnswer: '1',
        explanation: 'git reset --soft HEAD~1 undoes the last commit but keeps changes staged. --mixed keeps them unstaged, --hard discards them.',
        points: 15,
        tags: JSON.stringify(['interview']),
        source: 'interview'
      },
      {
        category: 'git',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is a git branch?',
        options: JSON.stringify(['A copy of the repository', 'An independent line of development', 'A commit message', 'A merge conflict']),
        correctAnswer: '1',
        explanation: 'A branch is an independent line of development that allows you to work on features without affecting the main codebase.',
        points: 15,
        tags: JSON.stringify(['interview']),
        source: 'interview'
      },
      {
        category: 'git',
        difficulty: 'advanced',
        type: 'multiple_choice',
        question: 'What is git stash used for?',
        options: JSON.stringify(['Permanently deleting changes', 'Temporarily storing uncommitted changes', 'Creating a new branch', 'Pushing to remote']),
        correctAnswer: '1',
        explanation: 'git stash temporarily stores uncommitted changes so you can work on something else, then reapply them later.',
        points: 20,
        tags: JSON.stringify(['interview']),
        source: 'interview'
      },

      // ========== Node.js Questions ==========
      {
        category: 'nodejs',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'What is Node.js?',
        options: JSON.stringify(['A web browser', 'A JavaScript runtime built on Chrome V8', 'A programming language', 'A database']),
        correctAnswer: '1',
        explanation: 'Node.js is a JavaScript runtime built on Chrome V8 engine that allows running JavaScript on the server.',
        points: 10,
        tags: JSON.stringify(['interview', 'beginner-friendly']),
        source: 'interview'
      },
      {
        category: 'nodejs',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'Which file contains the metadata and dependencies for a Node.js project?',
        options: JSON.stringify(['node.json', 'package.json', 'config.json', 'dependencies.json']),
        correctAnswer: '1',
        explanation: 'package.json contains project metadata, scripts, and dependency information.',
        points: 10,
        tags: JSON.stringify(['beginner-friendly']),
        source: 'interview'
      },
      {
        category: 'nodejs',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'What command is used to install dependencies from package.json?',
        options: JSON.stringify(['node install', 'npm install', 'npm get', 'node dependencies']),
        correctAnswer: '1',
        explanation: 'npm install (or npm i) installs all dependencies listed in package.json.',
        points: 10,
        tags: JSON.stringify(['beginner-friendly']),
        source: 'interview'
      },
      {
        category: 'nodejs',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is the purpose of the event loop in Node.js?',
        options: JSON.stringify(['To create loops', 'To handle asynchronous operations', 'To manage memory', 'To compile code']),
        correctAnswer: '1',
        explanation: 'The event loop allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded.',
        points: 15,
        tags: JSON.stringify(['interview']),
        source: 'interview'
      },
      {
        category: 'nodejs',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is the difference between require() and import?',
        options: JSON.stringify(['No difference', 'require is CommonJS, import is ES Modules', 'import is deprecated', 'require is newer']),
        correctAnswer: '1',
        explanation: 'require() is CommonJS (default in Node.js), import is ES Modules syntax (need "type": "module" in package.json).',
        points: 15,
        tags: JSON.stringify(['interview', 'modules']),
        source: 'interview'
      },
      {
        category: 'nodejs',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is npm?',
        options: JSON.stringify(['Node Package Manager', 'New Programming Method', 'Node Process Manager', 'Network Protocol Manager']),
        correctAnswer: '0',
        explanation: 'npm stands for Node Package Manager, used to install, share, and manage JavaScript packages.',
        points: 15,
        tags: JSON.stringify(['interview']),
        source: 'interview'
      },
      {
        category: 'nodejs',
        difficulty: 'advanced',
        type: 'multiple_choice',
        question: 'What are streams in Node.js?',
        options: JSON.stringify(['Video streaming', 'Objects for handling reading/writing data in chunks', 'Network connections', 'Database queries']),
        correctAnswer: '1',
        explanation: 'Streams are objects that let you read data from a source or write data to a destination in continuous fashion, useful for handling large data.',
        points: 20,
        tags: JSON.stringify(['interview', 'advanced']),
        source: 'interview'
      },

      // ========== Database Questions ==========
      {
        category: 'databases',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'What does SQL stand for?',
        options: JSON.stringify(['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'System Query Language']),
        correctAnswer: '0',
        explanation: 'SQL stands for Structured Query Language, used for managing relational databases.',
        points: 10,
        tags: JSON.stringify(['interview', 'beginner-friendly']),
        source: 'interview'
      },
      {
        category: 'databases',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'Which SQL command is used to retrieve data?',
        options: JSON.stringify(['GET', 'RETRIEVE', 'SELECT', 'FETCH']),
        correctAnswer: '2',
        explanation: 'SELECT is used to retrieve data from a database table.',
        points: 10,
        tags: JSON.stringify(['beginner-friendly', 'sql']),
        source: 'interview'
      },
      {
        category: 'databases',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'Which SQL command is used to add new data?',
        options: JSON.stringify(['ADD', 'INSERT', 'CREATE', 'NEW']),
        correctAnswer: '1',
        explanation: 'INSERT INTO is used to add new records to a database table.',
        points: 10,
        tags: JSON.stringify(['beginner-friendly', 'sql']),
        source: 'interview'
      },
      {
        category: 'databases',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is the difference between SQL and NoSQL databases?',
        options: JSON.stringify(['No difference', 'SQL is relational with fixed schema, NoSQL is non-relational with flexible schema', 'NoSQL is older', 'SQL is only for large data']),
        correctAnswer: '1',
        explanation: 'SQL databases are relational with predefined schemas. NoSQL databases are non-relational with flexible schemas.',
        points: 15,
        tags: JSON.stringify(['interview']),
        source: 'interview'
      },
      {
        category: 'databases',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is a foreign key?',
        options: JSON.stringify(['A key from another country', 'A unique identifier', 'A field that links to primary key in another table', 'An encrypted key']),
        correctAnswer: '2',
        explanation: 'A foreign key is a field in one table that refers to the primary key in another table, establishing a relationship.',
        points: 15,
        tags: JSON.stringify(['interview', 'sql']),
        source: 'interview'
      },
      {
        category: 'databases',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is a JOIN in SQL?',
        options: JSON.stringify(['Combining two databases', 'Combining rows from two or more tables', 'Adding a new column', 'Deleting duplicate rows']),
        correctAnswer: '1',
        explanation: 'JOIN is used to combine rows from two or more tables based on a related column between them.',
        points: 15,
        tags: JSON.stringify(['interview', 'sql']),
        source: 'interview'
      },
      {
        category: 'databases',
        difficulty: 'advanced',
        type: 'multiple_choice',
        question: 'What is database indexing and why is it important?',
        options: JSON.stringify(['Organizing files alphabetically', 'Data structure to speed up queries', 'Backing up data', 'Encrypting data']),
        correctAnswer: '1',
        explanation: 'Indexing creates a data structure that improves the speed of data retrieval operations at the cost of additional storage and slower writes.',
        points: 20,
        tags: JSON.stringify(['interview', 'performance']),
        source: 'interview'
      },
      {
        category: 'databases',
        difficulty: 'advanced',
        type: 'multiple_choice',
        question: 'What is ACID in databases?',
        options: JSON.stringify(['A type of query', 'Atomicity, Consistency, Isolation, Durability', 'A database engine', 'A backup method']),
        correctAnswer: '1',
        explanation: 'ACID properties ensure reliable database transactions: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions), Durability (permanent changes).',
        points: 20,
        tags: JSON.stringify(['interview', 'advanced']),
        source: 'interview'
      },

      // ========== Express.js Questions ==========
      {
        category: 'expressjs',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'What is Express.js?',
        options: JSON.stringify(['A database', 'A web framework for Node.js', 'A programming language', 'A testing tool']),
        correctAnswer: '1',
        explanation: 'Express.js is a minimal and flexible Node.js web application framework.',
        points: 10,
        tags: JSON.stringify(['interview', 'beginner-friendly']),
        source: 'interview'
      },
      {
        category: 'expressjs',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'Which method is used to handle GET requests in Express?',
        options: JSON.stringify(['app.get()', 'app.fetch()', 'app.retrieve()', 'app.read()']),
        correctAnswer: '0',
        explanation: 'app.get() is used to define routes that respond to HTTP GET requests.',
        points: 10,
        tags: JSON.stringify(['beginner-friendly']),
        source: 'interview'
      },
      {
        category: 'expressjs',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'How do you send a JSON response in Express?',
        options: JSON.stringify(['res.send()', 'res.json()', 'res.write()', 'res.return()']),
        correctAnswer: '1',
        explanation: 'res.json() sends a JSON response. It also sets the Content-Type header to application/json.',
        points: 10,
        tags: JSON.stringify(['beginner-friendly']),
        source: 'interview'
      },
      {
        category: 'expressjs',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is the purpose of app.use() in Express?',
        options: JSON.stringify(['To use a database', 'To mount middleware functions', 'To create routes', 'To start the server']),
        correctAnswer: '1',
        explanation: 'app.use() mounts middleware functions at a specified path. Middleware can modify req/res or end the request-response cycle.',
        points: 15,
        tags: JSON.stringify(['interview', 'middleware']),
        source: 'interview'
      },
      {
        category: 'expressjs',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'How do you access URL parameters in Express?',
        options: JSON.stringify(['req.params', 'req.query', 'req.body', 'req.url']),
        correctAnswer: '0',
        explanation: 'req.params contains route parameters (e.g., /users/:id). req.query is for query strings, req.body is for POST data.',
        points: 15,
        tags: JSON.stringify(['interview']),
        source: 'interview'
      },
      {
        category: 'expressjs',
        difficulty: 'advanced',
        type: 'multiple_choice',
        question: 'What is the difference between app.route() and express.Router()?',
        options: JSON.stringify(['No difference', 'app.route() chains methods, Router() creates modular route handlers', 'Router() is deprecated', 'app.route() is for static files']),
        correctAnswer: '1',
        explanation: 'app.route() is for chaining HTTP methods on a single route. express.Router() creates modular, mountable route handlers.',
        points: 20,
        tags: JSON.stringify(['interview', 'advanced']),
        source: 'interview'
      },

      // ========== Middleware Questions ==========
      {
        category: 'middleware',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'What is middleware in web development?',
        options: JSON.stringify(['Software in the middle of the stack', 'Functions that have access to request and response objects', 'A type of database', 'Frontend code']),
        correctAnswer: '1',
        explanation: 'Middleware functions have access to request and response objects and can execute code, modify them, or end the cycle.',
        points: 10,
        tags: JSON.stringify(['interview', 'beginner-friendly']),
        source: 'interview'
      },
      {
        category: 'middleware',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'Which of these is a common Express middleware?',
        options: JSON.stringify(['body-parser', 'react', 'mongodb', 'webpack']),
        correctAnswer: '0',
        explanation: 'body-parser is middleware that parses incoming request bodies. Note: Express 4.16+ has built-in express.json() and express.urlencoded().',
        points: 10,
        tags: JSON.stringify(['beginner-friendly']),
        source: 'interview'
      },
      {
        category: 'middleware',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What does the next() function do in Express middleware?',
        options: JSON.stringify(['Sends a response', 'Passes control to the next middleware', 'Ends the request', 'Logs information']),
        correctAnswer: '1',
        explanation: 'next() passes control to the next middleware function. Without calling next(), the request will hang.',
        points: 15,
        tags: JSON.stringify(['interview']),
        source: 'interview'
      },
      {
        category: 'middleware',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What are the three arguments to an Express middleware function?',
        options: JSON.stringify(['req, res, next', 'request, response, callback', 'input, output, error', 'data, result, done']),
        correctAnswer: '0',
        explanation: 'Express middleware receives req (request), res (response), and next (function to pass control). Error-handling middleware has 4 args: err, req, res, next.',
        points: 15,
        tags: JSON.stringify(['interview']),
        source: 'interview'
      },
      {
        category: 'middleware',
        difficulty: 'advanced',
        type: 'multiple_choice',
        question: 'What is the order of middleware execution in Express?',
        options: JSON.stringify(['Random', 'Alphabetical', 'In the order they are defined', 'Parallel execution']),
        correctAnswer: '2',
        explanation: 'Middleware functions are executed in the order they are defined using app.use() or route methods.',
        points: 20,
        tags: JSON.stringify(['interview']),
        source: 'interview'
      },
      {
        category: 'middleware',
        difficulty: 'advanced',
        type: 'multiple_choice',
        question: 'How do you create error-handling middleware in Express?',
        options: JSON.stringify(['Use try-catch', 'Define middleware with 4 parameters (err, req, res, next)', 'Use app.error()', 'Use throw statement']),
        correctAnswer: '1',
        explanation: 'Error-handling middleware is defined with 4 parameters. Express recognizes it by the 4-parameter signature.',
        points: 20,
        tags: JSON.stringify(['interview', 'error-handling']),
        source: 'interview'
      },

      // ========== CORS Questions ==========
      {
        category: 'cors',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'What does CORS stand for?',
        options: JSON.stringify(['Cross-Origin Resource Sharing', 'Cross-Origin Request Security', 'Client-Origin Resource System', 'Common Origin Resource Sharing']),
        correctAnswer: '0',
        explanation: 'CORS stands for Cross-Origin Resource Sharing, a security feature that restricts cross-origin HTTP requests.',
        points: 10,
        tags: JSON.stringify(['interview', 'beginner-friendly', 'security']),
        source: 'interview'
      },
      {
        category: 'cors',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'What is the same-origin policy?',
        options: JSON.stringify(['A naming convention', 'Security measure restricting how documents from one origin interact with another', 'A CSS property', 'A JavaScript function']),
        correctAnswer: '1',
        explanation: 'Same-origin policy is a security measure that restricts how a document or script from one origin can interact with resources from another origin.',
        points: 10,
        tags: JSON.stringify(['beginner-friendly', 'security']),
        source: 'interview'
      },
      {
        category: 'cors',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is a preflight request?',
        options: JSON.stringify(['Request before takeoff', 'OPTIONS request sent before actual request to check permissions', 'First request of the day', 'Request to test connection']),
        correctAnswer: '1',
        explanation: 'A preflight request is an OPTIONS request automatically sent by browsers to check if the actual request is safe to send.',
        points: 15,
        tags: JSON.stringify(['interview', 'security']),
        source: 'interview'
      },
      {
        category: 'cors',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'Which header specifies allowed origins in CORS?',
        options: JSON.stringify(['Access-Control-Allow-Methods', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'Origin-Allowed']),
        correctAnswer: '1',
        explanation: 'Access-Control-Allow-Origin header specifies which origins can access the resource.',
        points: 15,
        tags: JSON.stringify(['interview', 'security']),
        source: 'interview'
      },
      {
        category: 'cors',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What value allows all origins in CORS?',
        options: JSON.stringify(['*', 'all', 'any', 'true']),
        correctAnswer: '0',
        explanation: 'The asterisk (*) wildcard allows requests from any origin. However, it cannot be used with credentials.',
        points: 15,
        tags: JSON.stringify(['interview', 'security']),
        source: 'interview'
      },
      {
        category: 'cors',
        difficulty: 'advanced',
        type: 'multiple_choice',
        question: 'Why cant you use Access-Control-Allow-Origin: * with credentials?',
        options: JSON.stringify(['Its a browser bug', 'Security risk - credentials would be sent to any origin', 'Technical limitation', 'It is allowed']),
        correctAnswer: '1',
        explanation: 'When credentials (cookies, auth headers) are involved, the server must specify exact origin for security. Wildcard (*) is not allowed.',
        points: 20,
        tags: JSON.stringify(['interview', 'security', 'advanced']),
        source: 'interview'
      },

      // ========== Deployment Questions ==========
      {
        category: 'deployment',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'What is CI/CD?',
        options: JSON.stringify(['Code Integration/Code Deployment', 'Continuous Integration/Continuous Deployment', 'Computer Integration/Computer Deployment', 'Client Integration/Client Deployment']),
        correctAnswer: '1',
        explanation: 'CI/CD stands for Continuous Integration and Continuous Deployment/Delivery - practices for automating the build, test, and deployment process.',
        points: 10,
        tags: JSON.stringify(['interview', 'devops']),
        source: 'interview'
      },
      {
        category: 'deployment',
        difficulty: 'beginner',
        type: 'multiple_choice',
        question: 'What is a production environment?',
        options: JSON.stringify(['Where code is written', 'Where the live application runs for end users', 'A testing server', 'A local development setup']),
        correctAnswer: '1',
        explanation: 'Production is the live environment where the application runs for real users, as opposed to development or staging environments.',
        points: 10,
        tags: JSON.stringify(['beginner-friendly']),
        source: 'interview'
      },
      {
        category: 'deployment',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is the purpose of environment variables in deployment?',
        options: JSON.stringify(['To make code run faster', 'To store configuration without hardcoding sensitive data', 'To create new environments', 'To test code']),
        correctAnswer: '1',
        explanation: 'Environment variables store configuration (API keys, database URLs) outside the codebase for security and flexibility across environments.',
        points: 15,
        tags: JSON.stringify(['interview', 'security', 'best-practices']),
        source: 'interview'
      },
      {
        category: 'deployment',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is Docker used for?',
        options: JSON.stringify(['Writing code', 'Containerizing applications for consistent deployment', 'Version control', 'Database management']),
        correctAnswer: '1',
        explanation: 'Docker packages applications and dependencies into containers that can run consistently across different environments.',
        points: 15,
        tags: JSON.stringify(['interview', 'devops']),
        source: 'interview'
      },
      {
        category: 'deployment',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        question: 'What is the difference between horizontal and vertical scaling?',
        options: JSON.stringify(['No difference', 'Horizontal adds more machines, vertical adds more power to existing machine', 'Vertical adds more machines', 'Horizontal is cheaper always']),
        correctAnswer: '1',
        explanation: 'Horizontal scaling (scale out) adds more machines. Vertical scaling (scale up) adds more resources (CPU, RAM) to existing machine.',
        points: 15,
        tags: JSON.stringify(['interview', 'devops']),
        source: 'interview'
      },
      {
        category: 'deployment',
        difficulty: 'advanced',
        type: 'multiple_choice',
        question: 'What is a reverse proxy?',
        options: JSON.stringify(['A proxy that goes backwards', 'Server that forwards client requests to backend servers', 'A security vulnerability', 'A type of VPN']),
        correctAnswer: '1',
        explanation: 'A reverse proxy sits in front of backend servers, forwarding client requests. It can handle load balancing, SSL termination, caching, etc.',
        points: 20,
        tags: JSON.stringify(['interview', 'devops', 'advanced']),
        source: 'interview'
      },
      {
        category: 'deployment',
        difficulty: 'advanced',
        type: 'multiple_choice',
        question: 'What is a load balancer?',
        options: JSON.stringify(['A weight measurement tool', 'Distributes traffic across multiple servers', 'A database optimization', 'A caching mechanism']),
        correctAnswer: '1',
        explanation: 'A load balancer distributes incoming network traffic across multiple servers to ensure no single server is overwhelmed.',
        points: 20,
        tags: JSON.stringify(['interview', 'devops', 'advanced']),
        source: 'interview'
      }
    ];

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

    console.log('=========================================');
    console.log('         SEEDING COMPLETE!              ');
    console.log('=========================================');
    console.log('');
    console.log('  Admin Login:');
    console.log('    Email:    admin@edifix.com');
    console.log('    Password: admin123');
    console.log('');
    console.log('  Database Summary:');
    console.log(`    - ${userCount} Users`);
    console.log(`    - ${courseCount} Courses`);
    console.log(`    - ${lessonCount} Lessons`);
    console.log(`    - ${questionCount} Questions`);
    console.log('');
    console.log('=========================================');

    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
