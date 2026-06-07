const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const resultsDir = path.resolve(process.cwd(), 'allure-results');

if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

const baseUrl = process.env.BASE_URL || 'https://restful-booker.herokuapp.com';
const branchName =
  process.env.GITHUB_REF_NAME || getCommandOutput('git branch --show-current') || 'local';
const commitSha =
  process.env.GITHUB_SHA || getCommandOutput('git rev-parse --short HEAD') || 'local';
const runId = process.env.GITHUB_RUN_ID || 'local';
const runNumber = process.env.GITHUB_RUN_NUMBER || 'local';
const repository = process.env.GITHUB_REPOSITORY || 'trungtinle301099-meo/Booking_management-';

const environmentProperties = [
  'Project=Booking Management API Automation',
  `Base URL=${baseUrl}`,
  'Framework=Playwright',
  'Language=TypeScript',
  'Runtime=Node.js',
  'Test Type=API Automation',
  `Branch=${branchName}`,
  `Commit=${commitSha}`,
  `Repository=${repository}`,
].join('\n');

const executor = {
  name: process.env.GITHUB_ACTIONS ? 'GitHub Actions' : 'Local Machine',
  type: process.env.GITHUB_ACTIONS ? 'github' : 'local',
  url:
    process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${runId}`
      : '',
  buildOrder: runNumber,
  buildName: `Booking Management API Automation #${runNumber}`,
  buildUrl:
    process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${runId}`
      : '',
  reportName: 'Allure Report - Booking Management API Automation',
};

const categories = [
  {
    name: 'API Contract / Schema Defect',
    matchedStatuses: ['failed'],
    messageRegex: '.*(ZodError|schema|parse|Expected|toHaveProperty).*',
  },
  {
    name: 'Authentication / Authorization Defect',
    matchedStatuses: ['failed'],
    messageRegex: '.*(401|403|token|Unauthorized|Forbidden|Bad credentials).*',
  },
  {
    name: 'HTTP Status Code Defect',
    matchedStatuses: ['failed'],
    messageRegex: '.*(status|Status|response|expected).*',
  },
  {
    name: 'Timeout / Environment Issue',
    matchedStatuses: ['broken'],
    messageRegex: '.*(Timeout|ECONNRESET|ECONNREFUSED|ENOTFOUND|socket|network).*',
  },
  {
    name: 'Unknown Test Failure',
    matchedStatuses: ['failed', 'broken'],
  },
];

fs.writeFileSync(path.join(resultsDir, 'environment.properties'), `${environmentProperties}\n`);
fs.writeFileSync(path.join(resultsDir, 'executor.json'), `${JSON.stringify(executor, null, 2)}\n`);
fs.writeFileSync(
  path.join(resultsDir, 'categories.json'),
  `${JSON.stringify(categories, null, 2)}\n`,
);

console.log('✅ Allure metadata generated successfully.');

function getCommandOutput(command) {
  try {
    return childProcess
      .execSync(command, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
}
