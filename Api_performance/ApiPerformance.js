#!/usr/bin/env node

import { program } from "commander";
import axios from "axios";
import chalk from "chalk";
import ora from "ora";



program
  .name("apitest")
  .description("CLI tool to test API performance")
  .version("1.0.0")
  .requiredOption("-u, --url <url>", "API URL to test")
  .option("-n, --requests <number>", "Number of requests", "10")
  .option("-c, --concurrency <number>", "Concurrent requests", "5");


program.parse(process.argv);

const { url, requests, concurrency } = program.opts();
const totalRequests = parseInt(requests, 10);
const maxConcurrent = parseInt(concurrency, 10);

const spinner = ora(`Testing ${url} with ${totalRequests} requests...`).start();


async function sendRequest() {
  const start = performance.now();
  try {
    await axios.get(url);
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

  console.log(chalk.green("\n📊 Results:"));
  console.log(chalk.bgBlue(`  Total requests: ${times.length}`));
  console.log(chalk.bgBlue(`  Min time: ${min} ms`));
  console.log(chalk.bgBlue(`  Max time: ${max} ms`));
  console.log(chalk.bgBlue(`  Avg time: ${avg} ms`));
  console.log(chalk.bgBlue(`  Requests/sec: ${rps}`));
}

runLoadTest();

// To run this script, use the command:
//node testapi -u <API_URL> -n <NUMBER_OF_REQUESTS> -c <CONCURRENCY_LEVEL>