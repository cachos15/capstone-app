import * as SQLite from 'expo-sqlite';

const dbPromise = SQLite.openDatabaseAsync('little_lemon.db');

export async function createTable() {
  const db = await dbPromise;
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS menuitems (
      price NUMBER PRIMARY KEY NOT NULL,
      name TEXT,
      description TEXT,
      image TEXT,
      category TEXT
    );
  `);
}

export async function getMenuItems() {
  const db = await dbPromise;
  return db.getAllAsync('SELECT * FROM menuitems');
}

export async function saveMenuItems(menuItems) {
  const db = await dbPromise;

  await db.withTransactionAsync(async () => {
    for (const item of menuItems) {
      await db.runAsync(
        `INSERT INTO menuitems (price, name, description, image, category)
         VALUES (?, ?, ?, ?, ?)`,
        item.price,
        item.name,
        item.description,
        item.image,
        item.category
      );
    }
  });
}

export async function filterByCategories(activeCategories) {
  if (activeCategories.length === 0) {
    return [];
  }

  const db = await dbPromise;
  const categoryPlaceholders = activeCategories.map((cat) => `'${cat.toLowerCase()}'`).join(', ');
  return db.getAllAsync(
    `SELECT * FROM menuitems
     WHERE category IN (${categoryPlaceholders})`
  );
}
