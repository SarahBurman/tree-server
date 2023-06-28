const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);


const port = 3000;

let jsonData;
let directory;


app.get('/files', (req, res) => {
  if(directory) {
    const query = req.query.q;
    if (!query) {
      res.json(directory);
    }
    else {
      res.json( getMatchingDirectories(directory, query))
    }

  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  readJSON();

});

// function readJSON() {
//   fs.readFile('./tree.json', 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error reading data');
//       return;
//     }

//     jsonData = JSON.parse(data);
//     directory = convertToDirectory(jsonData[0]);

//   });
// }

async function readJSON() {
  try {
    const data = await readFile('./tree.json', 'utf8');
    const jsonData = JSON.parse(data);
    const directory = convertToDirectory(jsonData[0]);

    return directory;
  } catch (err) {
    console.error(err);
    throw new Error('Error reading data');
  }
}

function convertToDirectory(data) {
  const directory = {
    name: data.name,
    files: data.files,
    directories: data.directories ? data.directories.map(subDirectory => convertToDirectory(subDirectory)) : []
  };

  return directory;
}

// function convertToDirectory(data) {
//   const directory = { 
//     name:data.name,
//     files: data.files,
//     directories: []
//   }
 
//   if (data.directories && data.directories.length > 0) {
//     directory.directories = data.directories.flatMap(subDirectories =>
//       subDirectories.map(subDirectory => convertToDirectory(subDirectory))
//     );
//   }

//   return directory
// }

function getMatchingDirectories(dir, prefix, matchingDirectories = []) {
  if (dir.name.startsWith(prefix)) {
    matchingDirectories.push(dir);
  }

  dir.directories.forEach(subDirectory => {
    getMatchingDirectories(subDirectory, prefix, matchingDirectories);
  });

  return matchingDirectories;
}
