const path = require('path');
const fs = require('fs');
const { readFile, copyFile, mkdir, readdir, rm } = require('fs/promises');

const assetsDir = 'assets';
const deployDir = 'project-dist';
const componentsDir = 'components';
const stylesDir = 'styles';
const templateName = 'template.html';
const entryPointName = 'index.html';
const stylesBundleName = 'style.css';
const assetsPath = path.join(__dirname, assetsDir);
const deployPath = path.join(__dirname, deployDir);
const componentsPath = path.join(__dirname, componentsDir);
const stylesPath = path.join(__dirname, stylesDir);
const componentContentByPlaceholderId = new Map();

async function initDeployDir() {
  try {
    await mkdir(deployPath, { recursive: true });
  } catch (err) {
    console.log(err);
  }
}

async function getComponentContentByPlaceholder(plaseholder) {
  const plaseholderRegExp = new RegExp('{|}', "g");
  const plaseholderId = plaseholder.replace(plaseholderRegExp, '').trim();

  if (componentContentByPlaceholderId.has(plaseholderId)) {
    return componentContentByPlaceholderId.get(plaseholderId);
  }

  try {
    const componentName = `${plaseholderId}.html`;
    const content = await readFile(path.join(componentsPath, componentName), { encoding: 'utf8' });
    componentContentByPlaceholderId.set(plaseholderId, content);
    return content;
  } catch (err) {
    return plaseholder;
  }
}

async function buildStylesBundle() {
  const fileDestinationPath = path.join(deployPath, stylesBundleName); 
  let writeStream = fs.createWriteStream(fileDestinationPath);
  try {
    const styleFiles = await readdir( stylesPath, { withFileTypes: true });
    for (let styleFile of styleFiles) {
      if (!styleFile.isDirectory()) {
        const extension = path.extname(styleFile.name);
        if (extension === '.css') {
            const fileSourcePath = path.join(stylesPath, styleFile.name);  
            const readStream = fs.createReadStream(fileSourcePath, 'utf-8');
            readStream.pipe(writeStream);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function getSubfolders(folderPath) {
  const subfolders = [];
  try {
    const directoryItems = await readdir( folderPath, { withFileTypes: true });
    for (let item of directoryItems) {
      if (item.isDirectory()) {
        subfolders.push(item.name);
      }
    }
  } catch (err) {
    console.log(err);
  }

  return subfolders;
}

async function copyAllFilesFromFolder(sourseFolder, destinationFolder) {
  try {
    const directoryItems = await readdir( sourseFolder, { withFileTypes: true });
    for (let directoryItem of directoryItems) {
      if (!directoryItem.isDirectory()) {
          const fileSourcePath = path.join(sourseFolder, directoryItem.name); 
          const fileDestinationPath = path.join(destinationFolder, directoryItem.name);   
          await copyFile( fileSourcePath, fileDestinationPath);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function copyAssets() {
  try {
    const targetDir = path.join(deployPath, assetsDir);
    const sourceDir = assetsPath;
    await rm(targetDir, { recursive: true, force: true });
    await mkdir(targetDir, { recursive: true });
    const assetsSubfolders = await getSubfolders(sourceDir);

    for (let subfolder of assetsSubfolders) {
      const subfolderTargetPath = path.join(targetDir, subfolder);
      const subfolderSourcePath = path.join(sourceDir, subfolder);
      await mkdir(subfolderTargetPath , { recursive: true });
      await copyAllFilesFromFolder(subfolderSourcePath, subfolderTargetPath)     
    }
  } catch (err) {
    console.log(err);
  }
}

function processTemplate() {
  const fileSourcePath = path.join(__dirname, templateName);  
  const readStream = fs.createReadStream(fileSourcePath, 'utf-8');

  const fileDestinationPath = path.join(deployPath, entryPointName); 
  let writeStream = fs.createWriteStream(fileDestinationPath);
  const regExp = /{{.*}}/g;

  readStream.on('data', async (chunk) => {
    let plaseholders = chunk.match(regExp);
    let output = chunk;
    for (let plaseholder of plaseholders) {
      const content = await getComponentContentByPlaceholder(plaseholder);
      output = output.replace(plaseholder, content)
    }
    writeStream.write(output);
  });
}

initDeployDir();
processTemplate();
buildStylesBundle();
copyAssets();