import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = express()
const port = 3000
const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '/../frontend/index.html'))
})

app.use('/public', express.static(join(__dirname, '/../frontend/static')))

app.get('/data', (req, res) => {
  fs.readFile(`${__dirname}/data/drinks.json`, (err, data) => {
    if (err) {
      console.log("error at reading file")
      res.json("error at reading file")
    } else {
      const jsonData = JSON.parse(data)
      res.json(jsonData)
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})