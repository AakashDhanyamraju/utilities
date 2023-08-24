const fs = require("fs");

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
    const values = keys.map((key) => item[key]);
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

module.exports = {
  writeJSONFile,
  readCSVFile,
  readJSONFile,
  calculatePercentage,
  writeCSVfile,
  removeDuplicates,
};
