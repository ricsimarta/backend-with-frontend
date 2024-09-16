import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

const generateId = () => {
  let newId = "";

  for (let i = 0; i < 10; i++) {
    newId += Math.floor(Math.random() * 10);
  }

  return newId;
}

const checkIfUnique = (arrayOfIds, newId) => {
  const result = arrayOfIds.find(id => id === newId);
  if (result === undefined) {
    return true;
  } else {
    return false;
  }
}

const ids = [];

fs.readFile(`${__dirname}/data/drinks.json`, (err, data) => {
  if (err) {
    console.log("error at reading file");
  } else {
    const jsonData = JSON.parse(data);
    jsonData.forEach(drinkObj => {
      let newId = generateId(); // 6826736341

      while (checkIfUnique(ids, newId) === false) {
        newId = generateId(); 
      } // after "while" is finished, newId must be unique
      
      drinkObj.id = newId;
      ids.push(newId);
    })

    fs.writeFile(`${__dirname}/data/drinks.json`, JSON.stringify(jsonData, null, 2), err => {
      if (err) {
        console.log("error at writing file", err)
      } else {
        console.log("all objects id has been updated")
      }
    })
  }
})

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '/../frontend/index.html'));
});

app.use('/public', express.static(join(__dirname, '/../frontend/static')));

app.get('/data', (req, res) => {
  fs.readFile(`${__dirname}/data/drinks.json`, (err, data) => {
    if (err) {
      console.log("error at reading file");
      res.json("error at reading file");
    } else {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    }
  });
});

app.post('/data/new', (req, res) => {
  console.log(req.body);

  fs.readFile(`${__dirname}/data/drinks.json`, (err, data) => {
    if (err) {
      console.log("error at reading file", err);
      res.json("error at reading file");
    } else {
      const jsonData = JSON.parse(data);

      jsonData.push(req.body);

      fs.writeFile(`${__dirname}/data/drinks.json`, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          console.log("error at writing file", err);
          res.status(500).json("error at writing file");
        } else {
          res.json("success");
        }
      })
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});