const fs = require('fs');
const util = require('util');
const fsAccess = util.promisify(fs.access);
const fsMkdir = util.promisify(fs.mkdir);
const fsClose = util.promisify(fs.close);
const fsOpen = util.promisify(fs.open);

const [, , dayNumber] = process.argv;

const run = async () => {
  const dirPath = `./day${dayNumber}`;
  const filesToCreate = [
    `${dirPath}/day${dayNumber}-part-1.js`,
    `${dirPath}/day${dayNumber}-part-1.test.js`,
    `${dirPath}/day${dayNumber}-part-2.js`,
    `${dirPath}/day${dayNumber}-part-2.test.js`,
    `${dirPath}/input`,
    `${dirPath}/test-input`
  ];

  await createDirectory(dirPath);
  await Promise.all(filesToCreate.map(createFile));

  console.log('Process finished');
};

const createDirectory = async (path) => {
  if (await dirExists(path)) {
    return console.log(`Directory "${path}" already exists. Skipping...`);
  }
  await fsMkdir(path);

  console.log(`${path} created successfully`);
};

const createFile = async (path) => {
  if (await dirExists(path)) {
    return console.log(`File "${path}" already exists. Skipping...`);
  }

  const file = await fsOpen(path, 'w');
  await fsClose(file);

  console.log(`${path} created successfully`);
};

const dirExists = async (path) => {
  try {
    await fsAccess(path);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }

    throw error;
  }

  return true;
};

run();
