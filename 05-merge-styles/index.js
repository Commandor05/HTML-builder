const fs = require('fs');
const path = require('path');
const readdir = fs.readdir;

const sourceDir = 'styles';
const destinationDir = 'project-dist';
const sourcePath = path.join(__dirname, sourceDir);
const destinationPath = path.join(__dirname, destinationDir);
const destinationFileName = 'bundle.css';

function buid() {
  const fileDestinationPath = path.join(destinationPath, destinationFileName); 
  let writeStream = fs.createWriteStream(fileDestinationPath);

  writeStream.on('error', function (error) {
    console.error(error.message);
  });

  readdir(sourcePath,
    { withFileTypes: true },
    (error, files) => {
      if (error) return console.log(error.message);
      files.forEach(file => {
        if (!file.isDirectory()) {
          const extension = path.extname(file.name);
          if (extension === '.css') {
             const fileSourcePath = path.join(sourcePath, file.name);  
             const readStream = fs.createReadStream(fileSourcePath, 'utf-8');
             readStream.pipe(writeStream);
          }  
        }
      });
  });
}

buid();