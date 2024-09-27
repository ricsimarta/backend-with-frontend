export const addNewDrink = (newDrinkData) => fetch('/data/new', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newDrinkData) }).then(res => res.json());