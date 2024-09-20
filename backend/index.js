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

const isUnique = (arrayOfIds, newId) => {
  const result = arrayOfIds.find(id => id === newId);
  if (result === undefined) {
    return true;
  } else {
    return false;
  }
}

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

  //should check the incoming data for missing values

  fs.readFile(`${__dirname}/data/drinks.json`, (err, data) => {
    if (err) {
      console.log("error at reading file", err);
      res.status(500).json("error at reading file");
    } else {
      const jsonData = JSON.parse(data);
      const ids = jsonData.map(drinkObj => drinkObj.id)
      
      let newId = generateId();

      while (isUnique(ids, newId) === false) {
        newId = generateId();
      }

      //itt már tuti egyedi a newId

      const newDrinkObj = req.body;
      newDrinkObj.id = newId;

      jsonData.push(newDrinkObj);

      try {
        fs.writeFile(`${__dirname}/data/drinks.json`, JSON.stringify(jsonData, null, 2), () => {
          res.json(newDrinkObj.id);
        })
      } catch (err) {
        console.log("error at writing file", err);
        res.status(500).json("error at writing file");
      }
    }
  });
});

app.delete('/data/delete/:id', (req, res) => {
  console.log(req.params.id);
  const searchId = req.params.id;

  //check if params id is valid value

  fs.readFile(`${__dirname}/data/drinks.json`, (err, data) => {
    if (err) {
      console.log("error at reading file", err);
      res.status(500).json("error at reading file");
    } else {
      const jsonData = JSON.parse(data);

      const foundObj = jsonData.find(obj => obj.id === searchId);

      if (foundObj) {
        const filteredArray = jsonData.filter(obj => obj.id !== searchId);
        
        fs.writeFile(`${__dirname}/data/drinks.json`, JSON.stringify(filteredArray, null, 2), () => {
          res.status(200).json(searchId);
        })
      } else {
        res.status(404).json(`${searchId} is not found`)
      }
    }
  })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});