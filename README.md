# API Performance Checker

A command-line tool for testing API performance by sending multiple requests and measuring key metrics such as response times and concurrency handling.

## 📦 Installation from npm

```sh
npm install -g api-performance-checker
```

## 🚀 Usage

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

```json
{
  "url": "https://jsonplaceholder.typicode.com/posts",
  "method": "GET",
  "requests": "20 total requests",
  "concurrency": "5 concurrent requests",
  "timeout": "5000 ms",
  "minTime": "28.30 ms",
  "maxTime": "175.72 ms",
  "avgTime": "56.04 ms",
  "requestsPerSec": "17.84 requests/second(r/s)",
  "failedRequests": 0,
  "successRate": "100.00",
  "timestamp": "2025-10-03T20:25:10.435Z"
}
```

## Notes

- You can use either command line options or a config file.
- The config file must be valid JSON.

## Contribute

Contributions are welcome! To contribute:

- Fork the repository on GitHub
- Create a new branch for your feature or fix
- Make your changes and commit them
- Open a pull request describing your changes

Feel free to open issues for bugs, feature requests, or questions.
