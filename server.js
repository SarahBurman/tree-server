const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const treeData = require('./temptree');

const port = 3000;

let directories = [];


app.get('/files', (req, res) => {
  if(directories) {
    const query = req.query.q;
    if (!query) {
      res.json(directories);
    }
    else {
      res.json(getMatchingDirectories(query))
    }

  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  readJSON();
});

function readJSON() {
  treeData.forEach(directory => directories.push(convertToDirectory(directory)));
}

function convertToDirectory(data) {
  const directory = { 
    name:data.name,
    files: data.files,
    directories: []
  }
 
  if (data.directories && data.directories.length > 0) {
    directory.directories = data.directories.flatMap(subDirectories =>
      subDirectories.map(subDirectory => convertToDirectory(subDirectory))
    );
  }

  return directory
}

function getMatchingDirectories(prefix) {
  matchingDirectories = [];
  directories.forEach(directory => {
      getMatchingInnerDirectories(directory, prefix, matchingDirectories);
    }
  );
  return matchingDirectories;
}

function getMatchingInnerDirectories(dir, prefix, matchingDirectories) {
  if (dir.name.toLowerCase().startsWith(prefix.toLowerCase())) {
    matchingDirectories.push(dir);
  }
  if(dir.files.some(file => file.toLowerCase().startsWith(prefix.toLowerCase()))){
    const matchedDir = {
      name: dir.name,
      files: dir.files.filter(file=> file.toLowerCase().startsWith(prefix.toLowerCase())),
      directories: []
    };
      matchingDirectories.push(matchedDir);
  }
  if (dir.directories && dir.directories.length > 0) {
    dir.directories.forEach(subDirectory => {
      getMatchingInnerDirectories(subDirectory, prefix, matchingDirectories);
    });
  }
}