const path = require('path');
const { mkdir, readdir, copyFile, unlink } = require('fs');

const sourceDir = 'files';
const destinationDir = 'files-copy';
const sourcePath = path.join(__dirname, sourceDir);
const destinationPath = path.join(__dirname, destinationDir);

function clearDestinationDir() {
  readdir(destinationPath,
    { withFileTypes: true },
    (error, files) => {
      if (error) return console.log(error.message);
      files.forEach(file => {
        const filePath = path.join(destinationPath, file.name);  
        unlink(filePath, (error) => {
          if (error) return console.log(error.message);
        });         
      });
  });
}

function copyDir() {
  mkdir(destinationPath,
    { recursive: true },
    (error) => {
      if (error) return console.error(error.message);
      console.log('Directory created');
      clearDestinationDir();

      readdir(sourcePath,
        { withFileTypes: true },
        (error, files) => {
          if (error) return console.log(error.message);
          files.forEach(file => {
            const fileSourcePath = path.join(sourcePath, file.name);  
            const fileDestinationPath = path.join(destinationPath, file.name);  
    
            copyFile(fileSourcePath, fileDestinationPath, (err) => {
              if (err) return console.log(error.message);            
              console.log(`${file.name} - copied`);
            });
          });
      });
    }
  );
}

copyDir();