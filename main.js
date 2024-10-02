const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .option('-i, --input <path>', 'шлях до файлу для читання')
  .option('-o, --output <path>', 'шлях до файлу для запису результату')
  .option('-d, --display', 'вивести результат у консоль');

program.parse(process.argv);

const options = program.opts();

if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

const filePath = path.resolve(options.input);
let data;

try {
  data = fs.readFileSync(filePath, 'utf-8');
} catch (error) {
  console.error('Error reading input file:', error.message);
  process.exit(1);
}

let parsedData;
try {
  parsedData = JSON.parse(data);
} catch (error) {
  console.error('Error parsing JSON:', error.message);
  process.exit(1);
}

// Створення результатів у форматі "StockCode-ValCode-Attraction"
const results = parsedData.map(item => `${item.StockCode}-${item.ValCode}-${item.Attraction}`);

// Якщо потрібен вивід у консоль
if (options.display) {
  results.forEach(result => console.log(result));
}

// Якщо потрібен запис у файл
if (options.output) {
  const outputPath = path.resolve(options.output);
  try {
    fs.writeFileSync(outputPath, results.join('\n'));
    console.log(`Result written to ${options.output}`);
  } catch (error) {
    console.error('Error writing output file:', error.message);
  }
}

if (!options.output && !options.display) {
  process.exit(0);
}
