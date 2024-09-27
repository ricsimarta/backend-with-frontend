import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFile, writeFile } from 'fs';
import { readFile as readFilePromise } from 'fs/promises';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = 3000;
const DRINKS_URL = `${__dirname}/data/drinks.json`;

const generateId = () => {
  let newId = "";

  for (let i = 0; i < 10; i++) {
    newId += Math.floor(Math.random() * 10);
  }

  return newId;
}

const generateUniqueId = (idsArray, generate) => {
  let newId = generate();

  // while the generated id can be found in the existing ids, generate a new one
  while (idsArray.find(id => id === newId)) {
    newId = generate();
  }

  return newId;
}

async function readAndParseFile(fileUrl) {
  try {
    const data = await readFilePromise(fileUrl, 'utf8');
    const jsonData = JSON.parse(data);

    return jsonData;
  } catch (err) {
    console.error('Error reading or parsing the JSON file:', err);
  }
}

app.use(express.json());

app.get('/', (req, res) => res.sendFile(join(__dirname, '/../frontend/index.html')));

app.use('/public', express.static(join(__dirname, '/../frontend/static')));

app.get('/data', async (req, res) => {
  const fileData = await readAndParseFile(DRINKS_URL);
  res.json(fileData);
});

app.post('/data/new', async (req, res) => {
  const fileData = await readAndParseFile(DRINKS_URL);

  const ids = fileData.map(drinkObj => drinkObj.id);
  const newId = generateUniqueId(ids, generateId);

  // create a new object, from req.body and a new id key
  const newDrinkObj = { ...req.body, id: newId };

  fileData.push(newDrinkObj);

  try {
    writeFile(DRINKS_URL, JSON.stringify(fileData, null, 2), () => res.json(newDrinkObj.id));
  } catch (err) {
    console.log("error at writing file", err);
    res.status(500).json("error at writing file");
  }
});

app.delete('/data/delete/:id', async (req, res) => {
  const deleteId = req.params.id;

  const fileData = await readAndParseFile(DRINKS_URL);

  // if deleteId is in the fileData, delete the associated object
  if (fileData.find(obj => obj.id === deleteId)) {

    // filter all the objects from the fileData, that has the same id as deleteId (should be only one match)
    const filteredArray = fileData.filter(obj => obj.id !== deleteId);

    writeFile(DRINKS_URL, JSON.stringify(filteredArray, null, 2), () => res.json(deleteId));
  } else { // else return that deleteId is not found in the fileData
    res.status(404).json(`${deleteId} is not found`);
  }
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));