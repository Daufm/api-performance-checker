# API Performance Checker

A command-line tool for testing API performance by sending multiple requests and measuring key metrics such as response times and concurrency handling.

[![npm version](https://img.shields.io/npm/v/api-performance-checker.svg)](https://www.npmjs.com/package/api-performance-checker)
[![downloads](https://img.shields.io/npm/dw/api-performance-checker.svg)](https://www.npmjs.com/package/api-performance-checker)

## Quick start

Install globally and run a quick test:

```sh
npm install -g api-performance-checker
apitest -u https://jsonplaceholder.typicode.com/posts -n 10 -c 2
```

Package on npm: https://www.npmjs.com/package/api-performance-checker

## Installation from npm

```sh
npm install -g api-performance-checker
```

## Usage

### 1. Command-Line Arguments

Run directly from the command line by specifying all options:

```sh
apitest -u <API_URL> -n <NUMBER_OF_REQUESTS> -c <CONCURRENCY_LEVEL> -t <TIMEOUT_MS> -m <METHOD> -H '{"Header":"Value"}' -o <OUTPUT_FILE>
```

**Example:**

```sh
apitest -u https://jsonplaceholder.typicode.com/posts -n 20 -c 5 -t 5000 -m GET -o results.json
```

### 2. Using a Config File

Create a `config.json` file with your options. This is useful for many or repeated arguments:

```json
{
  "url": "https://jsonplaceholder.typicode.com/posts",
  "requests": 20,
  "concurrency": 5,
  "timeout": 5000,
  "method": "GET",
  "headers": {
    "Header": "Value"
  },
  "output": "results.json"
}
```

Run with:

```sh
apitest --config config.json
```

> The path to the config file can be relative (e.g., `./config.json`) or absolute (e.g., `C:/Users/YourName/config.json`).

#### Config File Options & Types

- `url` (string, required): API URL to test
- `requests` (integer, optional): Number of requests(default 10)
- `concurrency` (integer, optional): Concurrent requests(default 5)
- `timeout` (integer, optional): Request timeout in ms(default 5000)
- `method` (string, optional): HTTP method (GET, default.)
- `headers` (object, optional): Custom headers
- `output` (string, optional): Output results(default results.json )

## Output

If you specify the `-o` ,`--output` option or include `output` in your config file, results will be saved as a JSON file with all key metrics.

## Notes

- You can use either command line options or a config file.
- The config file must be valid JSON.
