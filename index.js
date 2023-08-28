const fs = require("fs");
const cheerio = require("cheerio");

function writeJSONFile(filename, data) {
  try {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`Data written to ${filename}`);
  } catch (error) {
    console.error(`Error writing ${filename}: ${error}`);
  }
}

function readCSVFile(filename) {
  try {
    const results = [];
    fs.createReadStream(filename)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        console.log(`Read ${results.length} rows from ${filename}`);
        return results;
        // You can process the results array as needed
        // For example, return it or perform some other operations
      });
  } catch (error) {
    console.error(`Error reading ${filename}: ${error}`);
  }
}

function readJSONFile(filename) {
  try {
    const data = fs.readFileSync(filename);
    console.log("🚀 ~ file: readJSONFile ~ DataRead");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}: ${error}`);
    return null;
  }
}

function calculatePercentage(value, total) {
  if (typeof value !== "number" || typeof total !== "number" || total === 0) {
    throw new Error(
      "Invalid input. Both value and total should be numbers, and total should not be zero."
    );
  }

  const percentage = (value / total) * 100;
  return percentage;
}

function writeCSVfile(path, jsonData) {
  const data = typeof jsonData !== "object" ? JSON.parse(jsonData) : jsonData;
  const keys = Object.keys(data[0]);
  const csvArray = [keys.join(",")];

  for (const item of data) {
    const values = keys.map((key) => JSON.stringify(item[key]));
    csvArray.push(values.join(","));
  }

  fs.writeFile(path, csvArray.join("\n"), (err) => {
    if (err) {
      console.error("Error writing CSV file:", err);
    } else {
      console.log("CSV file has been created successfully.");
    }
  });
}

function removeDuplicates(arr) {
  return [...new Set(arr)];
}

function convertCsvToJson(csv_file_path, json_file_path) {
  const data = [];
  const csvData = fs.readFileSync(csv_file_path, "utf-8").split("\n");
  const headers = csvData[0].split(",");

  for (let i = 1; i < csvData.length; i++) {
    const rowData = csvData[i].split(",");
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = rowData[j];
    }
    data.push(row);
  }

  fs.writeFileSync(json_file_path, JSON.stringify(data, null, 4));
  console.log(`Data written to ${json_file_path}`);
}

function convertJsonToCsv(jsonFilePath, csvFilePath) {
  const jsonData = fs.readFileSync(jsonFilePath, "utf-8");
  const data = JSON.parse(jsonData);

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Invalid JSON data");
  }

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(",")];

  for (const row of data) {
    const values = headers.map((header) => row[header]);
    csvRows.push(values.join(","));
  }

  fs.writeFileSync(csvFilePath, csvRows.join("\n"));
}

async function fetchSubUrls(rootUrl) {
  try {
    const response = await fetch(rootUrl);
    const htmlText = await response.text();

    const $ = cheerio.load(htmlText);

    const subUrls = [];
    $("a").each((index, element) => {
      const href = $(element).attr("href");
      if (href && href.startsWith("/") && !href.startsWith("//")) {
        const subUrl = new URL(href, rootUrl).href;
        subUrls.push(subUrl);
      }
    });

    return subUrls;
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
}

function flattenArray(arr) {
  return arr.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flattenArray(item) : item);
  }, []);
}

function groupBy(arr, property) {
  return arr.reduce((groups, obj) => {
    const key = obj[property];
    if (!groups[key]) groups[key] = [];
    groups[key].push(obj);
    return groups;
  }, {});
}

function compose(...functions) {
  return function (input) {
    return functions.reduceRight((acc, func) => func(acc), input);
  };
}

async function fetchSubUrlsEachPage(rootUrl, pageCount) {
  const allSubUrls = [];

  for (let page = 0; page <= pageCount; page++) {
    const pageUrl = `${rootUrl}?page=${page}`;
    const response = await fetch(pageUrl);
    const htmlText = await response.text();

    const $ = cheerio.load(htmlText);
    $(".program-cards a").each((index, element) => {
      const subUrl = $(element).attr("href");
      allSubUrls.push(subUrl);
    });
  }

  return allSubUrls;
}

module.exports = {
  convertCsvToJson,
  convertJsonToCsv,
  writeJSONFile,
  readJSONFile,
  writeCSVfile,
  readCSVFile,
  removeDuplicates,
  calculatePercentage,
  fetchSubUrls,
  flattenArray,
  groupBy,
  compose,
  fetchSubUrlsEachPage,
};
