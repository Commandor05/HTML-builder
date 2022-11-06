const { stdin: input, stdout: output } = require("process");
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');
const readLine = readline.createInterface({ input, output });

function init() {
  fs.writeFile(filePath, '', (error) => {
    if (error) return console.error(error.message);
  });
}

init();
output.write("Hello!\n\n");
output.write("Start typing. Any typed line will be written to file 'text.txt'.\n");
output.write("For exit press 'ctrl + c' or just type 'exit'.\n");

readLine.on('line', (input) => {
  if (input.trim() === 'exit') {
    process.exit();
  }

  fs.appendFile(filePath, `${input}\n`, (error) => {
    if (error) return console.error(error.message);
  });

});

process.on('exit', () => output.write(`\nSee you.Buy!\n`));