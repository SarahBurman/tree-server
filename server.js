const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const fs = require('fs');

const port = 3000;

app.get('/files', (req, res) => {
    fs.readFile('tree.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error reading data');
          return;
        }
    
        // Parse the JSON data
        const jsonData = JSON.parse(data);
    
        // Send the JSON data to the client
        res.json(jsonData);
      });
    // res.send('Get files');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});