const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .option('-i, --input <path>', 'шлях до файлу для читання')  // Зробимо його необов'язковим
  .option('-o, --output <path>', 'шлях до файлу для запису результату')
  .option('-d, --display', 'вивести результат у консоль');

program.parse(process.argv);

const options = program.opts();

// Кастомна перевірка наявності обов'язкового параметра
if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}
  
// Перевірка наявності вхідного файлу
const filePath = path.resolve(options.input);
if (!fs.existsSync(filePath)) {
  console.error('Cannot find input file');
  process.exit(1);
}

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

// Виведення даних у консоль, якщо задано параметр -d (display)
if (options.display) {
  console.log('Data:', parsedData);
}

// Запис результату у файл, якщо задано параметр -o (output)
if (options.output) {
  const outputPath = path.resolve(options.output);
  try {
    fs.writeFileSync(outputPath, JSON.stringify(parsedData, null, 2));
    console.log(`Result written to ${options.output}`);
  } catch (error) {
    console.error('Error writing output file:', error.message);
  }
}

// Завершення програми, якщо не задано ані -o, ані -d
if (!options.output && !options.display) {
  process.exit(0);
}
