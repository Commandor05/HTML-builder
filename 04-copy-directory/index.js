const path = require('path');
const { mkdir, readdir, copyFile } = require('fs');
const { rm } = require('fs/promises');

const sourceDir = 'files';
const destinationDir = 'files-copy';
const sourcePath = path.join(__dirname, sourceDir);
const destinationPath = path.join(__dirname, destinationDir);

async function clearDestinationDir() {
  await rm(destinationPath, { recursive: true, force: true });
}

async function copyDir() {
  await clearDestinationDir();
  mkdir(destinationPath,
    { recursive: true },
    (error) => {
      if (error) return console.error(error.message);
      console.log('Directory created');

      readdir(sourcePath,
        { withFileTypes: true },
        (error, files) => {
          if (error) return console.log(error.message);
          files.forEach(file => {
            const fileSourcePath = path.join(sourcePath, file.name);  
            const fileDestinationPath = path.join(destinationPath, file.name);  
    
            copyFile(fileSourcePath, fileDestinationPath, (error) => {
              if (error) return console.log(error.message);            
              console.log(`${file.name} - copied`);
            });
          });
      });
    }
  );
}

copyDir();