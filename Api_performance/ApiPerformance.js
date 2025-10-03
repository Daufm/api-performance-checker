#!/usr/bin/env node

import { program } from "commander";
import axios from "axios";
import chalk from "chalk";
import ora from "ora";




program
  .name("apitest")
  .description("CLI tool to test API performance ")
  .version("1.0.1")
  .requiredOption("-u, --url <url>", "API URL to test")
  .option("-n, --requests <number>", "Number of requests", "10")
  .option("-c, --concurrency <number>", "Concurrent requests", "5")
  .option("-t, --timeout <number>", "Request timeout in ms", "5000")
  .option("-H, --headers <headers>", "Custom headers as JSON string")
  .option("-m, --method <method>", "HTTP method to use", "GET")
  .option("-o, --output <file>", "Output results to a file")
  .option("-config, --config <path>", "Path to config file");


program.parse(process.argv);

if (program.opts().config) {
  const fs = require("fs");
  const configPath = program.opts().config;
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  program.opts().url = config.url || program.opts().url;
  program.opts().requests = config.requests || program.opts().requests;
  program.opts().concurrency = config.concurrency || program.opts().concurrency;
  program.opts().timeout = config.timeout || program.opts().timeout;
  program.opts().headers = config.headers || program.opts().headers;
  program.opts().method = config.method || program.opts().method;
  program.opts().output = config.output || program.opts().output;

}

const { url, requests, concurrency, timeout , headers ,method, output } = program.opts();
const totalRequests = parseInt(requests, 10);
const maxConcurrent = parseInt(concurrency, 10);
const requestTimeout = parseInt(timeout, 10);
const customHeaders = headers ? (typeof headers === "string" ? JSON.parse(headers) : headers) : {};
const resultsFile = output;
const customMethod = method ? method.toUpperCase() : 'GET';



const spinner = ora(`Testing ${url} with ${totalRequests} requests...`).start();


async function sendRequest() {
  const start = performance.now();
  
  try {

    await axios({
    
      url,
      headers: customHeaders || {},
      timeout: requestTimeout
    });

    return performance.now() - start;
  } catch {
    return null; // failed request
  }
}

async function runLoadTest() {
  let completed = 0;
  const times = [];

  while (completed < totalRequests) {
    const batch = [];
    for (let i = 0; i < maxConcurrent && completed < totalRequests; i++) {
      batch.push(sendRequest());
      completed++;
    }

    const results = await Promise.all(batch);
    results.forEach(time => time !== null && times.push(time));
  }

  spinner.succeed("Test completed");

  if (times.length === 0) {
    console.log(chalk.red("All requests failed ❌"));
    return;
  }

  const min = Math.min(...times).toFixed(2);
  const max = Math.max(...times).toFixed(2);
  const avg = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2);
  const rps = (times.length / (times.reduce((a, b) => a + b, 0) / 1000)).toFixed(2);
  const failed = totalRequests - times.length;
  const success = times.length;

  console.log(chalk.green("\n📊 Results:"));
  console.log(chalk.blue(`  Total requests: ${times.length}`));
  console.log(chalk.blue(`  Min time: ${min} ms`));
  console.log(chalk.blue(`  Max time: ${max} ms`));
  console.log(chalk.blue(`  Avg time: ${avg} ms`));
  console.log(chalk.blue(`  Requests/sec: ${rps}`));
  console.log(chalk.red(`  Failed requests: ${failed}`));
  console.log(chalk.green(`  Successful requests: ${success}`));
}

runLoadTest();

// To run this script, use the command:
//node testapi -u <API_URL> -n <NUMBER_OF_REQUESTS> -c <CONCURRENCY_LEVEL>