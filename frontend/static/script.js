console.log("loaded")

fetch("http://127.0.0.1:3000/data")
  .then(res => res.json())
  .then(data => console.log(data))

fetch("/data")
  .then(res => res.json())
  .then(data => console.log(data))