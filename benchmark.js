const fetch = require("node-fetch");
const fs = require("fs").promises;

// Helper function to delay execution
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to make the query and benchmark
async function benchmarkQuery(url, query, times) {
  let responseTimes = [];

  for (let i = 0; i < times; i++) {
    const startTime = Date.now();

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json(); // assuming the server responds with JSON
      const endTime = Date.now();
      responseTimes.push(endTime - startTime);
      console.log(`Query ${i + 1} successful`);
    } catch (error) {
      console.error(`Query ${i + 1} failed:`, error);
    }

    // Sleep to avoid rate-limiting
    if (i < times - 1) await sleep(5000);
  }

  return responseTimes;
}

async function main() {
  const GRAPH_URL =
    "https://api.studio.thegraph.com/query/72068/memecoinmonitor-launchpad/version/latest";
  const queries = [
    {
      name: "TOKENS_QUERY",
      query: `
                {
                    tokens(first: 10) {
                        id
                        creator
                        symbol
                    }
                }`,
    },
    {
      name: "PRICE_DATA_QUERY",
      query: `{
                priceDatas(first: 60, where: {token: "0x63bfb967f279599248a625560e88d8c86a4db3a5"}) {
                  su
                  o
                  j
                  l
                  c
                  v
                }
            }`,
    },
  ];

  let results = {};

  for (let query of queries) {
    const times = await benchmarkQuery(GRAPH_URL, query.query, 5);
    const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
    results[query.name] = { times, averageTime };
  }

  await fs.writeFile("benchmark.json", JSON.stringify(results, null, 2));
  console.log("Benchmark results saved to benchmark.json");
}

// Run the benchmark, exiting with 0 if successful, with 1 if error
main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
