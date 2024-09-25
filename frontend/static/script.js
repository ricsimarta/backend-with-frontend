const rootElement = document.querySelector("#root");

const drinkCard = ({ name, id, abv, desc, price }) => `
  <div class="drink">
    <h2>${name}</h2>
    <h3>${id}</h3>
    <p class="drink-abv">${abv}%</p>
    <p class="drink-desc">${desc}</p>
    <p class="drink-price">${price} HUF</p>
    <button class="delete">delete</button>
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

// takes "name" as argument, that is the value of the name HTML attribute of the input HTML element
// returns the value of the found input element
const getInputValue = (name) => document.querySelector(`input[name="drink-${name}"]`).value;

const getDrinksData = () => fetch('/data').then(res => res.json());

const addNewDrink = (newDrinkData) => fetch('/data/new', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newDrinkData) }).then(res => res.json());

const deleteDrink = (drinkId) => fetch(`/data/delete/${drinkId}`, { method: 'DELETE' }).then(res => res.json());

const addHtml = (element, html) => element.insertAdjacentHTML("beforeend", html);

const handleButtonClick = (button) => {
  const buttonContainer = button.parentElement;
  const searchId = buttonContainer.querySelector("h3").innerHTML;

  deleteDrink(searchId)
    .then(() => recreateDom(rootElement))
}

const createButtonClickEvents = (buttonList, handleButtonClick) => {
  buttonList.forEach(button => button.addEventListener("click", () => handleButtonClick(button)))
}

const createFormSubmitEvent = (form, handleSubmit) => form.addEventListener("submit", event => handleSubmit(event))

const handleSubmit = (event) => {
  event.preventDefault();

  const newDrinkData = {
    name: getInputValue("name"),
    desc: getInputValue("desc"),
    abv: Number(getInputValue("abv")),
    price: Number(getInputValue("price"))
  }

  addNewDrink(newDrinkData)
    .then(() => recreateDom(rootElement))
    .catch(err => {
      console.log("fetchData", err)
    })
}

const recreateDom = (rootElement) => {
  rootElement.innerHTML = "loading";
  
  getDrinksData()
    .then(drinks => {
      rootElement.innerHTML = "";
    
      const drinksHtml = drinks.map(drinkObj => drinkCard(drinkObj)).join("");

      addHtml(rootElement, `<div class="drinks">${drinksHtml}</div>`);
      addHtml(rootElement, newDrinkElement());

      const buttonElements = document.querySelectorAll('button.delete');
      createButtonClickEvents(buttonElements, handleButtonClick);

      const formElement = document.querySelector("form");
      createFormSubmitEvent(formElement, handleSubmit)
    })
}

const init = () => recreateDom(rootElement);

init();

// crate init fn