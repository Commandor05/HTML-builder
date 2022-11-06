const path = require('path');
const { readdir, stat } = require('fs');

const TARGET_DIRECTORY = 'secret-folder';
const targetDir = path.join(__dirname, TARGET_DIRECTORY);

readdir(targetDir,
  { withFileTypes: true },
  (error, files) => {
    if (error) return console.log(error.message);
    files.forEach(file => {
     if (!file.isDirectory()) {
      const filePath = path.join(targetDir, file.name);  
      stat(filePath, (error, stats) => {
        if (error) return console.log(error.message);
        const fileSizeInKb = Math.ceil((stats.size / 1024));
        const extension = path.extname(file.name);   
        console.log(`${file.name.replace(extension, '')}-${extension.replace('.', '')}-${fileSizeInKb}kb`);
      });
     }
    });
});
