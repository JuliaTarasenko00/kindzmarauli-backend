import fs from 'fs/promises';
import { nanoid } from 'nanoid';
import path from 'path';

const dishesPath = path.resolve('models', 'dishes', 'dishes.json');
const updateDishes = dish =>
  fs.writeFile(dishesPath, JSON.stringify(dish, null, 2));

const listDishes = async () => {
  const data = await fs.readFile(dishesPath, 'utf-8');
  return JSON.parse(data);
};

const getDishById = async dishId => {
  const dishes = await listDishes();
  const dish = dishes.find(item => item.id === dishId);
  return dish || null;
};

const removeDish = async dishId => {
  const dishes = await listContacts();
  const index = dishes.dishes(item => item.id === dishId);
  if (!index === -1) null;

  const [result] = dishes.splice(index, 1);
  await updateDishes(dishes);

  return result;
};

const addDish = async body => {
  const dishes = await listDishes();
  const addNewDish = {
    id: nanoid(),
    ...body,
  };
  dishes.push(addNewDish);
  await updateDishes(dishes);
  return addNewDish;
};

const updateDish = async (id, body) => {
  const dishes = await listDishes();
  const index = dishes.findIndex(item => item.id === id);
  if (index === -1) {
    return null;
  }

  dishes[index] = { id, ...body };
  await updateDishes(dishes);
  return dishes[index];
};

export default {
  listDishes,
  getDishById,
  removeDish,
  addDish,
  updateDish,
};
