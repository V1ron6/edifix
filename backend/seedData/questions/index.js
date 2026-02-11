import htmlQuestions from './htmlQuestions.js';
import cssQuestions from './cssQuestions.js';
import jsQuestions from './jsQuestions.js';
import gitQuestions from './gitQuestions.js';
import { nodejsQuestions, databaseQuestions, expressjsQuestions, middlewareQuestions, corsQuestions, deploymentQuestions, generalQuestions } from './backendQuestions.js';

const allQuestions = [
  ...htmlQuestions,
  ...cssQuestions,
  ...jsQuestions,
  ...gitQuestions,
  ...nodejsQuestions,
  ...databaseQuestions,
  ...expressjsQuestions,
  ...middlewareQuestions,
  ...corsQuestions,
  ...deploymentQuestions,
  ...generalQuestions
];

export {
  htmlQuestions,
  cssQuestions,
  jsQuestions,
  gitQuestions,
  nodejsQuestions,
  databaseQuestions,
  expressjsQuestions,
  middlewareQuestions,
  corsQuestions,
  deploymentQuestions,
  generalQuestions,
  allQuestions
};

export default allQuestions;
