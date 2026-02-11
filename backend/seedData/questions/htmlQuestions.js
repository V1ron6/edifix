// HTML Questions - 100 questions covering all HTML topics
// Difficulty: beginner, intermediate, advanced
// Types: multiple_choice, true_false, code, fill_blank, short_answer

const htmlQuestions = [
  // ===== BEGINNER - Multiple Choice =====
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'What does HTML stand for?',
    options: JSON.stringify(['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language']),
    correctAnswer: '0',
    explanation: 'HTML stands for HyperText Markup Language. It is the standard markup language for creating web pages.',
    points: 10, tags: JSON.stringify(['interview', 'beginner-friendly', 'fundamentals']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'Which HTML tag is used to define an internal style sheet?',
    options: JSON.stringify(['<css>', '<style>', '<script>', '<styles>']),
    correctAnswer: '1',
    explanation: 'The <style> tag is used to define internal CSS styles within an HTML document, placed inside the <head> section.',
    points: 10, tags: JSON.stringify(['interview', 'beginner-friendly']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'Which HTML attribute is used to define inline styles?',
    options: JSON.stringify(['class', 'styles', 'style', 'font']),
    correctAnswer: '2',
    explanation: 'The style attribute is used to add inline CSS styles directly to an HTML element.',
    points: 10, tags: JSON.stringify(['interview', 'beginner-friendly']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'Which tag is used for the largest heading in HTML?',
    options: JSON.stringify(['<h6>', '<heading>', '<h1>', '<head>']),
    correctAnswer: '2',
    explanation: '<h1> defines the largest heading, while <h6> defines the smallest. There are six levels of headings.',
    points: 10, tags: JSON.stringify(['beginner-friendly', 'fundamentals']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'Which HTML element is used to define a paragraph?',
    options: JSON.stringify(['<paragraph>', '<p>', '<para>', '<text>']),
    correctAnswer: '1',
    explanation: 'The <p> element defines a paragraph. Browsers automatically add margin before and after a <p> element.',
    points: 10, tags: JSON.stringify(['beginner-friendly']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'Which tag creates a line break in HTML?',
    options: JSON.stringify(['<break>', '<lb>', '<br>', '<newline>']),
    correctAnswer: '2',
    explanation: 'The <br> tag inserts a single line break. It is a void element and does not need a closing tag.',
    points: 10, tags: JSON.stringify(['beginner-friendly']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'Which tag is used to create a hyperlink?',
    options: JSON.stringify(['<link>', '<href>', '<a>', '<url>']),
    correctAnswer: '2',
    explanation: 'The <a> (anchor) tag is used to create hyperlinks. The href attribute specifies the URL of the page the link goes to.',
    points: 10, tags: JSON.stringify(['beginner-friendly', 'fundamentals']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'Which attribute specifies the URL for a link?',
    options: JSON.stringify(['src', 'link', 'href', 'url']),
    correctAnswer: '2',
    explanation: 'The href (Hypertext Reference) attribute specifies the URL that the hyperlink points to.',
    points: 10, tags: JSON.stringify(['beginner-friendly']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'Which HTML tag is used to display an image?',
    options: JSON.stringify(['<image>', '<img>', '<picture>', '<src>']),
    correctAnswer: '1',
    explanation: 'The <img> tag is used to embed an image. It requires src and alt attributes.',
    points: 10, tags: JSON.stringify(['beginner-friendly']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'Which tag creates an unordered (bulleted) list?',
    options: JSON.stringify(['<ol>', '<list>', '<ul>', '<dl>']),
    correctAnswer: '2',
    explanation: 'The <ul> tag defines an unordered list, which is displayed with bullet points by default.',
    points: 10, tags: JSON.stringify(['beginner-friendly']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'Which tag creates an ordered (numbered) list?',
    options: JSON.stringify(['<ul>', '<ol>', '<li>', '<nl>']),
    correctAnswer: '1',
    explanation: 'The <ol> tag defines an ordered list, which is displayed with numbers by default.',
    points: 10, tags: JSON.stringify(['beginner-friendly']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'Which element is used for each item in an HTML list?',
    options: JSON.stringify(['<item>', '<li>', '<list>', '<entry>']),
    correctAnswer: '1',
    explanation: 'The <li> (list item) element is used inside <ul> or <ol> to define each item in the list.',
    points: 10, tags: JSON.stringify(['beginner-friendly']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'What does the <title> tag define?',
    options: JSON.stringify(['A heading on the page', 'The document title shown in the browser tab', 'A tooltip', 'Bold text']),
    correctAnswer: '1',
    explanation: 'The <title> tag defines the document title shown in the browser tab and is used by search engines.',
    points: 10, tags: JSON.stringify(['beginner-friendly']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'Where should the <title> tag be placed?',
    options: JSON.stringify(['In the <body>', 'In the <head>', 'In the <footer>', 'Anywhere in the document']),
    correctAnswer: '1',
    explanation: 'The <title> element must be placed inside the <head> section of the HTML document.',
    points: 10, tags: JSON.stringify(['beginner-friendly']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'Which tag makes text bold?',
    options: JSON.stringify(['<bold>', '<b>', '<strong>', 'Both <b> and <strong>']),
    correctAnswer: '3',
    explanation: 'Both <b> and <strong> make text bold. <strong> also indicates semantic importance.',
    points: 10, tags: JSON.stringify(['beginner-friendly']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'Which tag makes text italic?',
    options: JSON.stringify(['<italic>', '<i>', '<em>', 'Both <i> and <em>']),
    correctAnswer: '3',
    explanation: 'Both <i> and <em> italicize text. <em> also adds semantic emphasis.',
    points: 10, tags: JSON.stringify(['beginner-friendly']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'What is the correct HTML for creating a text input field?',
    options: JSON.stringify(['<input type="text">', '<textfield>', '<input type="textfield">', '<text>']),
    correctAnswer: '0',
    explanation: '<input type="text"> creates a single-line text input field.',
    points: 10, tags: JSON.stringify(['beginner-friendly', 'forms']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'Which HTML element defines a table row?',
    options: JSON.stringify(['<td>', '<tr>', '<th>', '<table>']),
    correctAnswer: '1',
    explanation: 'The <tr> element defines a table row. <td> defines table data cells and <th> defines header cells.',
    points: 10, tags: JSON.stringify(['beginner-friendly', 'tables']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'Which attribute is used to provide alternative text for an image?',
    options: JSON.stringify(['title', 'alt', 'description', 'text']),
    correctAnswer: '1',
    explanation: 'The alt attribute provides alternative text when an image cannot be displayed and is crucial for accessibility.',
    points: 10, tags: JSON.stringify(['beginner-friendly', 'accessibility']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'multiple_choice',
    question: 'Which tag is used to define a division or section in HTML?',
    options: JSON.stringify(['<div>', '<section>', '<span>', '<block>']),
    correctAnswer: '0',
    explanation: 'The <div> tag is a generic container for flow content. It is used as a building block for layout.',
    points: 10, tags: JSON.stringify(['beginner-friendly']), source: 'interview'
  },

  // ===== BEGINNER - True/False =====
  {
    category: 'html', difficulty: 'beginner', type: 'true_false',
    question: 'The <br> tag in HTML requires a closing tag.',
    options: JSON.stringify(['True', 'False']),
    correctAnswer: '1',
    explanation: '<br> is a void element (self-closing) and does not require a closing tag.',
    points: 10, tags: JSON.stringify(['beginner-friendly']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'true_false',
    question: 'HTML tags are case-sensitive.',
    options: JSON.stringify(['True', 'False']),
    correctAnswer: '1',
    explanation: 'HTML tags are not case-sensitive. <P> and <p> are the same, but lowercase is recommended.',
    points: 10, tags: JSON.stringify(['beginner-friendly']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'true_false',
    question: 'The <head> element contains content visible to the user.',
    options: JSON.stringify(['True', 'False']),
    correctAnswer: '1',
    explanation: 'The <head> element contains metadata, title, links to stylesheets, etc. Visible content goes in <body>.',
    points: 10, tags: JSON.stringify(['beginner-friendly']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'true_false',
    question: 'Every HTML document must have a <!DOCTYPE html> declaration.',
    options: JSON.stringify(['True', 'False']),
    correctAnswer: '0',
    explanation: 'The DOCTYPE declaration tells the browser which version of HTML the page is written in. It should always be included.',
    points: 10, tags: JSON.stringify(['beginner-friendly']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'true_false',
    question: 'The <img> tag always requires a closing tag.',
    options: JSON.stringify(['True', 'False']),
    correctAnswer: '1',
    explanation: 'The <img> tag is a void element and does not need a closing tag.',
    points: 10, tags: JSON.stringify(['beginner-friendly']), source: 'interview'
  },

  // ===== INTERMEDIATE - Multiple Choice =====
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'What is the purpose of the alt attribute in an <img> tag?',
    options: JSON.stringify(['To specify the image source', 'To provide alternative text for accessibility', 'To set the image dimensions', 'To add a tooltip']),
    correctAnswer: '1',
    explanation: 'The alt attribute provides alternative text displayed if the image cannot load and is read by screen readers.',
    points: 15, tags: JSON.stringify(['interview', 'accessibility']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'Which HTML5 element is used for navigation links?',
    options: JSON.stringify(['<navigation>', '<nav>', '<navigate>', '<links>']),
    correctAnswer: '1',
    explanation: 'The <nav> element is a semantic HTML5 element used to define a set of navigation links.',
    points: 15, tags: JSON.stringify(['interview', 'semantic-html']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'What is the difference between <div> and <span>?',
    options: JSON.stringify(['div is inline, span is block', 'div is block-level, span is inline', 'They are the same', 'span is deprecated']),
    correctAnswer: '1',
    explanation: '<div> is a block-level element that starts on a new line, while <span> is inline and does not break the flow.',
    points: 15, tags: JSON.stringify(['interview', 'fundamentals']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'Which HTML element is used to define important text?',
    options: JSON.stringify(['<important>', '<strong>', '<b>', '<em>']),
    correctAnswer: '1',
    explanation: '<strong> defines text with strong importance. Browsers typically render it in bold, and screen readers emphasize it.',
    points: 15, tags: JSON.stringify(['interview', 'semantic-html']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'What is the correct HTML for creating a checkbox?',
    options: JSON.stringify(['<input type="check">', '<input type="checkbox">', '<checkbox>', '<check>']),
    correctAnswer: '1',
    explanation: '<input type="checkbox"> creates a checkbox input. Use the checked attribute to pre-select it.',
    points: 15, tags: JSON.stringify(['interview', 'forms']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'Which attribute opens a link in a new browser tab?',
    options: JSON.stringify(['target="_new"', 'target="_blank"', 'new="true"', 'open="new"']),
    correctAnswer: '1',
    explanation: 'target="_blank" opens the linked document in a new browser tab or window.',
    points: 15, tags: JSON.stringify(['interview']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'Which HTML element is used for the main content of a document?',
    options: JSON.stringify(['<body>', '<main>', '<content>', '<article>']),
    correctAnswer: '1',
    explanation: 'The <main> element contains the dominant content of the <body>. There should be only one <main> per page.',
    points: 15, tags: JSON.stringify(['interview', 'semantic-html']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'What is the purpose of the <meta charset="UTF-8"> tag?',
    options: JSON.stringify(['Sets the page language', 'Specifies character encoding for the document', 'Defines the viewport', 'Links an external stylesheet']),
    correctAnswer: '1',
    explanation: 'The charset meta tag specifies the character encoding. UTF-8 covers almost all characters and symbols in the world.',
    points: 15, tags: JSON.stringify(['interview']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'What does the viewport meta tag do?',
    options: JSON.stringify(['Sets the page title', 'Controls layout on mobile devices', 'Adds a favicon', 'Enables JavaScript']),
    correctAnswer: '1',
    explanation: 'The viewport meta tag controls the dimensions and scaling of the page on mobile devices.',
    points: 15, tags: JSON.stringify(['interview', 'responsive']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'Which element is used to group related form elements?',
    options: JSON.stringify(['<group>', '<fieldset>', '<formgroup>', '<set>']),
    correctAnswer: '1',
    explanation: 'The <fieldset> element groups related form elements and draws a box around them. Use <legend> for a caption.',
    points: 15, tags: JSON.stringify(['interview', 'forms']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'What does the required attribute do on form inputs?',
    options: JSON.stringify(['Makes the field read-only', 'Prevents form submission if the field is empty', 'Sets a default value', 'Enables autocomplete']),
    correctAnswer: '1',
    explanation: 'The required attribute specifies that the input field must be filled out before submitting the form.',
    points: 15, tags: JSON.stringify(['interview', 'forms']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'Which element represents self-contained content like a blog post?',
    options: JSON.stringify(['<section>', '<div>', '<article>', '<aside>']),
    correctAnswer: '2',
    explanation: 'The <article> element represents a self-contained composition that could be independently distributable.',
    points: 15, tags: JSON.stringify(['interview', 'semantic-html']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'What is the difference between <section> and <div>?',
    options: JSON.stringify(['No difference', '<section> is semantic and represents a thematic grouping', '<div> is semantic', '<section> is deprecated']),
    correctAnswer: '1',
    explanation: '<section> is a semantic element for thematic grouping of content. <div> is a generic non-semantic container.',
    points: 15, tags: JSON.stringify(['interview', 'semantic-html']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'Which input type is used for selecting a date?',
    options: JSON.stringify(['<input type="datetime">', '<input type="date">', '<input type="calendar">', '<input type="day">']),
    correctAnswer: '1',
    explanation: '<input type="date"> provides a date picker control in supporting browsers.',
    points: 15, tags: JSON.stringify(['forms']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'What does the placeholder attribute do?',
    options: JSON.stringify(['Sets the input value', 'Shows hint text that disappears when typing', 'Makes the field required', 'Disables the input']),
    correctAnswer: '1',
    explanation: 'The placeholder attribute provides a hint to the user about what to enter. It disappears when the user starts typing.',
    points: 15, tags: JSON.stringify(['forms']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'Which tag is used to embed a video in HTML5?',
    options: JSON.stringify(['<media>', '<movie>', '<video>', '<embed>']),
    correctAnswer: '2',
    explanation: 'The <video> tag embeds video content. Use controls attribute to show play, pause, and volume controls.',
    points: 15, tags: JSON.stringify(['multimedia']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'Which tag is used to embed audio in HTML5?',
    options: JSON.stringify(['<sound>', '<music>', '<audio>', '<mp3>']),
    correctAnswer: '2',
    explanation: 'The <audio> tag embeds sound content. Common formats include MP3, WAV, and OGG.',
    points: 15, tags: JSON.stringify(['multimedia']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'What does the <aside> element represent?',
    options: JSON.stringify(['The main content', 'Content indirectly related to main content', 'A footer section', 'A navigation area']),
    correctAnswer: '1',
    explanation: 'The <aside> element represents content tangentially related to the main content, like sidebars or callout boxes.',
    points: 15, tags: JSON.stringify(['semantic-html']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'What is the correct way to comment in HTML?',
    options: JSON.stringify(['// comment', '/* comment */', '<!-- comment -->', '# comment']),
    correctAnswer: '2',
    explanation: 'HTML comments use the syntax <!-- comment -->. They are not displayed in the browser.',
    points: 15, tags: JSON.stringify(['fundamentals']), source: 'interview'
  },

  // ===== INTERMEDIATE - True/False =====
  {
    category: 'html', difficulty: 'intermediate', type: 'true_false',
    question: 'An HTML page can have more than one <h1> element.',
    options: JSON.stringify(['True', 'False']),
    correctAnswer: '0',
    explanation: 'While valid HTML, it is recommended to use only one <h1> per page for SEO and accessibility best practices.',
    points: 15, tags: JSON.stringify(['seo', 'best-practices']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'true_false',
    question: 'The <canvas> element is used for drawing graphics with JavaScript.',
    options: JSON.stringify(['True', 'False']),
    correctAnswer: '0',
    explanation: 'The <canvas> element provides a drawing surface for JavaScript. It is used for graphs, games, and animations.',
    points: 15, tags: JSON.stringify(['html5', 'graphics']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'true_false',
    question: 'SVG images lose quality when scaled up.',
    options: JSON.stringify(['True', 'False']),
    correctAnswer: '1',
    explanation: 'SVG (Scalable Vector Graphics) are resolution-independent and do not lose quality at any scale.',
    points: 15, tags: JSON.stringify(['html5', 'graphics']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'true_false',
    question: 'The <label> element improves form accessibility.',
    options: JSON.stringify(['True', 'False']),
    correctAnswer: '0',
    explanation: 'Labels associate text with form controls, helping screen readers and making click targets larger.',
    points: 15, tags: JSON.stringify(['forms', 'accessibility']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'true_false',
    question: 'The <iframe> element can embed another HTML page within the current page.',
    options: JSON.stringify(['True', 'False']),
    correctAnswer: '0',
    explanation: 'The <iframe> (inline frame) element embeds another document within the current HTML document.',
    points: 15, tags: JSON.stringify(['fundamentals']), source: 'interview'
  },

  // ===== ADVANCED - Multiple Choice =====
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'What is the purpose of the data-* attribute in HTML5?',
    options: JSON.stringify(['To store custom data for CSS', 'To store custom data private to the page or application', 'To validate form data', 'To create database connections']),
    correctAnswer: '1',
    explanation: 'data-* attributes store custom data on HTML elements accessible via JavaScript (element.dataset).',
    points: 20, tags: JSON.stringify(['interview', 'advanced']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'What is the Shadow DOM?',
    options: JSON.stringify(['A hidden HTML element', 'Encapsulated DOM tree attached to an element', 'A JavaScript library', 'A browser extension API']),
    correctAnswer: '1',
    explanation: 'Shadow DOM provides encapsulation for web components, keeping styles and markup separate from the main document.',
    points: 20, tags: JSON.stringify(['interview', 'web-components']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'What is the purpose of the <template> element?',
    options: JSON.stringify(['To define a page template', 'To hold HTML content not rendered until activated by JavaScript', 'To create email templates', 'To define CSS templates']),
    correctAnswer: '1',
    explanation: 'The <template> element holds content that is not rendered when the page loads but can be instantiated later using JavaScript.',
    points: 20, tags: JSON.stringify(['interview', 'web-components']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'What is ARIA in web development?',
    options: JSON.stringify(['A JavaScript framework', 'Accessible Rich Internet Applications - accessibility attributes', 'A CSS methodology', 'A build tool']),
    correctAnswer: '1',
    explanation: 'ARIA (Accessible Rich Internet Applications) defines attributes to make web content more accessible to people with disabilities.',
    points: 20, tags: JSON.stringify(['interview', 'accessibility']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'What is the contenteditable attribute used for?',
    options: JSON.stringify(['Making elements draggable', 'Making element content editable by the user', 'Adding edit buttons', 'Enabling form editing']),
    correctAnswer: '1',
    explanation: 'Setting contenteditable="true" on an element allows users to directly edit its content in the browser.',
    points: 20, tags: JSON.stringify(['interview', 'advanced']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'Which HTML5 API allows offline web applications?',
    options: JSON.stringify(['Web Storage API', 'Service Workers / Cache API', 'Geolocation API', 'Drag and Drop API']),
    correctAnswer: '1',
    explanation: 'Service Workers intercept network requests and can serve cached content, enabling offline functionality.',
    points: 20, tags: JSON.stringify(['interview', 'html5-apis']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'What is the purpose of the <picture> element?',
    options: JSON.stringify(['To display photos', 'To provide multiple image sources for responsive images', 'To create image galleries', 'To add filters to images']),
    correctAnswer: '1',
    explanation: 'The <picture> element contains <source> elements and one <img> element for art direction and responsive images.',
    points: 20, tags: JSON.stringify(['interview', 'responsive']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'What is the difference between localStorage and sessionStorage?',
    options: JSON.stringify(['No difference', 'localStorage persists, sessionStorage clears on tab close', 'sessionStorage is larger', 'localStorage is deprecated']),
    correctAnswer: '1',
    explanation: 'localStorage persists until explicitly cleared. sessionStorage is cleared when the browser tab is closed.',
    points: 20, tags: JSON.stringify(['interview', 'web-storage']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'What are Custom Elements in HTML?',
    options: JSON.stringify(['Elements with custom CSS', 'Developer-defined HTML elements using Web Components API', 'Modified built-in elements', 'Elements with event listeners']),
    correctAnswer: '1',
    explanation: 'Custom Elements allow developers to define new HTML tags with custom behavior using the Web Components specification.',
    points: 20, tags: JSON.stringify(['interview', 'web-components']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'What HTTP method does a form use by default?',
    options: JSON.stringify(['POST', 'PUT', 'GET', 'PATCH']),
    correctAnswer: '2',
    explanation: 'Forms use GET by default when no method attribute is specified. GET appends data to the URL as query parameters.',
    points: 20, tags: JSON.stringify(['interview', 'forms']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'What is the purpose of the <output> element?',
    options: JSON.stringify(['To display server output', 'To represent the result of a calculation or user action', 'To show console output', 'To define output ports']),
    correctAnswer: '1',
    explanation: 'The <output> element represents the result of a calculation or user action, often used with forms and JavaScript.',
    points: 20, tags: JSON.stringify(['advanced', 'forms']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'What is the defer attribute on <script> tags?',
    options: JSON.stringify(['Delays script download', 'Downloads script in parallel and executes after HTML parsing', 'Prevents script execution', 'Makes script optional']),
    correctAnswer: '1',
    explanation: 'The defer attribute downloads the script in parallel with HTML parsing and executes it after the document is fully parsed.',
    points: 20, tags: JSON.stringify(['interview', 'performance']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'What is the difference between defer and async on script tags?',
    options: JSON.stringify(['No difference', 'defer executes after parsing in order, async executes immediately when downloaded', 'async is slower', 'defer is deprecated']),
    correctAnswer: '1',
    explanation: 'defer: executes after HTML parsing, maintains order. async: executes as soon as downloaded, no guaranteed order.',
    points: 20, tags: JSON.stringify(['interview', 'performance']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'What is the Geolocation API used for?',
    options: JSON.stringify(['Finding HTML elements', 'Getting the geographical position of a user', 'Mapping CSS properties', 'Locating server addresses']),
    correctAnswer: '1',
    explanation: 'The Geolocation API returns the latitude and longitude of the user position, with user permission.',
    points: 20, tags: JSON.stringify(['html5-apis']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'What is the purpose of the <datalist> element?',
    options: JSON.stringify(['To create a database', 'To provide autocomplete suggestions for an input', 'To list data items', 'To define a data table']),
    correctAnswer: '1',
    explanation: 'The <datalist> element provides a list of pre-defined options for an <input> element, creating an autocomplete dropdown.',
    points: 20, tags: JSON.stringify(['forms', 'advanced']), source: 'interview'
  },

  // ===== ADVANCED - Short Answer =====
  {
    category: 'html', difficulty: 'advanced', type: 'short_answer',
    question: 'Explain the difference between block-level and inline elements. Give two examples of each.',
    options: null,
    correctAnswer: 'Block-level elements start on a new line and take full width (div, p, h1). Inline elements flow within text without breaking (span, a, strong).',
    explanation: 'Block-level: start on new line, take full available width. Examples: div, p, h1-h6, section. Inline: flow within content. Examples: span, a, strong, em, img.',
    points: 25, tags: JSON.stringify(['interview', 'fundamentals']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'short_answer',
    question: 'What are semantic HTML elements and why are they important?',
    options: null,
    correctAnswer: 'Semantic elements clearly describe their meaning (header, nav, main, article, section, footer). They improve accessibility, SEO, and code readability.',
    explanation: 'Semantic HTML uses elements that convey meaning about the content structure, improving accessibility for screen readers, SEO for search engines, and readability for developers.',
    points: 25, tags: JSON.stringify(['interview', 'semantic-html']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'short_answer',
    question: 'What is the DOM and how does it relate to HTML?',
    options: null,
    correctAnswer: 'The DOM (Document Object Model) is a programming interface that represents the HTML document as a tree of nodes. JavaScript uses the DOM to access and manipulate HTML content.',
    explanation: 'The DOM is the browser representation of the HTML document as an object tree. Each HTML element becomes a node that JavaScript can interact with.',
    points: 25, tags: JSON.stringify(['interview', 'dom']), source: 'interview'
  },

  // ===== Code Questions =====
  {
    category: 'html', difficulty: 'intermediate', type: 'code',
    question: 'Write HTML to create a form with an email input, password input, and a submit button.',
    options: null,
    correctAnswer: '<form>\n  <label for="email">Email:</label>\n  <input type="email" id="email" name="email" required>\n  <label for="password">Password:</label>\n  <input type="password" id="password" name="password" required>\n  <button type="submit">Submit</button>\n</form>',
    explanation: 'Use proper input types (email, password) with labels for accessibility and the required attribute for validation.',
    codeTemplate: '<!-- Create a login form here -->',
    expectedOutput: 'A form with email input, password input, and submit button',
    points: 15, tags: JSON.stringify(['forms', 'practice']), source: 'custom'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'code',
    question: 'Write HTML for a navigation bar with three links: Home, About, and Contact.',
    options: null,
    correctAnswer: '<nav>\n  <ul>\n    <li><a href="/">Home</a></li>\n    <li><a href="/about">About</a></li>\n    <li><a href="/contact">Contact</a></li>\n  </ul>\n</nav>',
    explanation: 'Use semantic <nav> element with an unordered list for navigation links.',
    codeTemplate: '<!-- Create a navigation bar here -->',
    expectedOutput: 'A semantic navigation bar with three links',
    points: 15, tags: JSON.stringify(['semantic-html', 'practice']), source: 'custom'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'code',
    question: 'Write HTML for a responsive image that shows different sizes based on viewport width.',
    options: null,
    correctAnswer: '<picture>\n  <source media="(min-width: 800px)" srcset="large.jpg">\n  <source media="(min-width: 400px)" srcset="medium.jpg">\n  <img src="small.jpg" alt="Responsive image">\n</picture>',
    explanation: 'The <picture> element with <source> tags provides art direction for responsive images.',
    codeTemplate: '<!-- Create a responsive image here -->',
    expectedOutput: 'A picture element with multiple source elements for different viewport widths',
    points: 20, tags: JSON.stringify(['responsive', 'practice']), source: 'custom'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'code',
    question: 'Write HTML for a table with a header row containing Name, Age, City and two data rows.',
    options: null,
    correctAnswer: '<table>\n  <thead>\n    <tr>\n      <th>Name</th>\n      <th>Age</th>\n      <th>City</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Alice</td>\n      <td>25</td>\n      <td>New York</td>\n    </tr>\n    <tr>\n      <td>Bob</td>\n      <td>30</td>\n      <td>London</td>\n    </tr>\n  </tbody>\n</table>',
    explanation: 'Use <thead> for header rows with <th> cells and <tbody> for data rows with <td> cells.',
    codeTemplate: '<!-- Create a table here -->',
    expectedOutput: 'A properly structured HTML table with header and data rows',
    points: 20, tags: JSON.stringify(['tables', 'practice']), source: 'custom'
  },

  // More beginner fill-in-the-blank
  {
    category: 'html', difficulty: 'beginner', type: 'fill_blank',
    question: 'The HTML element used to create a clickable hyperlink is the _____ tag.',
    options: null,
    correctAnswer: 'a',
    explanation: 'The <a> (anchor) tag creates hyperlinks with the href attribute specifying the destination URL.',
    points: 10, tags: JSON.stringify(['beginner-friendly', 'fundamentals']), source: 'custom'
  },
  {
    category: 'html', difficulty: 'beginner', type: 'fill_blank',
    question: 'To include an image in HTML, use the _____ tag with the src attribute.',
    options: null,
    correctAnswer: 'img',
    explanation: 'The <img> tag displays images. The src attribute specifies the path and the alt attribute provides alternative text.',
    points: 10, tags: JSON.stringify(['beginner-friendly']), source: 'custom'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'fill_blank',
    question: 'The HTML5 element _____ is used to define a self-contained article or blog post.',
    options: null,
    correctAnswer: 'article',
    explanation: 'The <article> element specifies independent, self-contained content like blog posts, news articles, or forum posts.',
    points: 15, tags: JSON.stringify(['semantic-html']), source: 'custom'
  },

  // Additional intermediate questions
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'What is the purpose of the <figure> and <figcaption> elements?',
    options: JSON.stringify(['To create charts', 'To group media with a caption', 'To add figure numbers', 'To create photo frames']),
    correctAnswer: '1',
    explanation: '<figure> wraps self-contained media content and <figcaption> provides a caption for it.',
    points: 15, tags: JSON.stringify(['semantic-html']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'Which attribute makes a form input read-only?',
    options: JSON.stringify(['disabled', 'readonly', 'locked', 'static']),
    correctAnswer: '1',
    explanation: 'The readonly attribute makes an input non-editable but still submittable. disabled prevents both editing and submission.',
    points: 15, tags: JSON.stringify(['forms']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'What is the difference between the disabled and readonly attributes?',
    options: JSON.stringify(['No difference', 'disabled prevents submission, readonly still submits', 'readonly prevents submission', 'disabled is deprecated']),
    correctAnswer: '1',
    explanation: 'disabled: field cannot be edited and its value is NOT submitted. readonly: field cannot be edited but its value IS submitted.',
    points: 15, tags: JSON.stringify(['forms', 'interview']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'Which tag is used to group options in a dropdown list?',
    options: JSON.stringify(['<group>', '<optgroup>', '<selectgroup>', '<options>']),
    correctAnswer: '1',
    explanation: '<optgroup> groups related options in a <select> dropdown, using the label attribute for the group name.',
    points: 15, tags: JSON.stringify(['forms']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'intermediate', type: 'multiple_choice',
    question: 'What does the <details> element do?',
    options: JSON.stringify(['Displays details about an element', 'Creates a collapsible disclosure widget', 'Shows metadata', 'Defines a definition list']),
    correctAnswer: '1',
    explanation: 'The <details> element creates a disclosure widget that the user can toggle open and closed. Use <summary> for the heading.',
    points: 15, tags: JSON.stringify(['html5']), source: 'interview'
  },

  // Additional advanced questions
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'What is the purpose of the Web Workers API?',
    options: JSON.stringify(['To manage web servers', 'To run JavaScript in background threads', 'To create service workers', 'To hire developers']),
    correctAnswer: '1',
    explanation: 'Web Workers allow JavaScript to run in background threads, keeping the main UI thread responsive.',
    points: 20, tags: JSON.stringify(['html5-apis', 'interview']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'What is the role attribute used for in HTML?',
    options: JSON.stringify(['CSS styling', 'Defining ARIA roles for accessibility', 'JavaScript events', 'Data storage']),
    correctAnswer: '1',
    explanation: 'The role attribute defines the purpose of an element for assistive technologies. Example: role="navigation", role="button".',
    points: 20, tags: JSON.stringify(['accessibility', 'interview']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'What is the difference between the <b> and <strong> tags?',
    options: JSON.stringify(['No difference', '<b> is visual only, <strong> has semantic importance', '<strong> is deprecated', '<b> is the newer version']),
    correctAnswer: '1',
    explanation: '<b> is purely visual (bold text). <strong> indicates strong importance and is emphasized by screen readers.',
    points: 20, tags: JSON.stringify(['semantic-html', 'accessibility']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'What does the autocomplete attribute do on forms?',
    options: JSON.stringify(['Automatically fills in code', 'Enables or disables browser autofill suggestions', 'Validates input automatically', 'Auto-submits the form']),
    correctAnswer: '1',
    explanation: 'The autocomplete attribute controls whether the browser should offer to fill in form values based on previous entries.',
    points: 20, tags: JSON.stringify(['forms', 'security']), source: 'interview'
  },
  {
    category: 'html', difficulty: 'advanced', type: 'multiple_choice',
    question: 'What is the purpose of rel="noopener noreferrer" on links?',
    options: JSON.stringify(['Improves page loading speed', 'Prevents the new page from accessing window.opener and hides referrer', 'Makes the link open faster', 'Validates the URL']),
    correctAnswer: '1',
    explanation: 'noopener prevents the new page from accessing window.opener (security). noreferrer prevents sending the Referer header.',
    points: 20, tags: JSON.stringify(['security', 'interview']), source: 'interview'
  }
];

export default htmlQuestions;
