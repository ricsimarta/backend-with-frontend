console.log("loaded");

const drinkCard = (drinkData) => `
  <div class="drink">
    <h2>${drinkData.name}</h2>
    <p class="drink-abv">${drinkData.abv}%</p>
    <p class="drink-desc">${drinkData.desc}</p>
    <p class="drink-price">${drinkData.price} HUF</p>
  </div>
`;

const newDrinkElement = () => `
  <form>
    <h2>add new drink</h2>

    <input type="text" name="drink-name" placeholder="drink name" required />
    <input type="text" name="drink-abv" placeholder="drink abv %" required />
    <input type="text" name="drink-desc" placeholder="drink description" required />
    <input type="number" name="drink-price" placeholder="drink price" required />

    <button>add drink</button>
  </form>
`;

const getInputValue = (name) => document.querySelector(`input[name="drink-${name}"]`).value

fetch("/data")
  .then(res => res.json())
  .then(data => {
    console.log(data);
    
    let drinksHtml = "";

    data.forEach(drinkData => drinksHtml += drinkCard(drinkData));

    const rootElement = document.querySelector("#root");
    rootElement.insertAdjacentHTML("beforeend", `<div class="drinks">${drinksHtml}</div>`);

    rootElement.insertAdjacentHTML("beforeend", newDrinkElement());
    const formElement = document.querySelector("form");
    formElement.addEventListener("submit", (event) => {
      event.preventDefault();

      console.log("event trigger");

      const newDrinkData = {
        name: getInputValue("name"),
        desc: getInputValue("desc"),
        abv: Number(getInputValue("abv")),
        price: Number(getInputValue("price"))
      }

      console.log(newDrinkData);

      fetch('/data/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDrinkData)
      })
        .then(res => res.json())
        .then(resJson => {
          if (resJson === "success") {
            drinksHtml += drinkCard(newDrinkData);
            const drinksContainerElement = document.querySelector("div.drinks");
            drinksContainerElement.innerHTML = drinksHtml;
          }
        })
    })
})