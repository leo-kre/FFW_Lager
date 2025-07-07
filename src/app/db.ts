import mysql, { RowDataPacket } from "mysql2/promise";

let pool: mysql.Pool;

function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.NEXT_PUBLIC_DB_HOST,
      user: process.env.NEXT_PUBLIC_DB_USER,
      password: process.env.NEXT_PUBLIC_DB_PASSWORD,
      database: process.env.NEXT_PUBLIC_DB_DATABASE_NAME,
      port: Number(process.env.NEXT_PUBLIC_DB_DATABASE_PORT),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function getDataFromDatabase(id: string): Promise<ItemBody | null> {
  try {
    const pool = getPool();
    const ID = Number(id);
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Item WHERE id = ?", [ID]
    );
    if (rows.length === 0) return null;
    return rows[0] as ItemBody;
  } catch (error) {
    console.error("Error fetching data from database:", error);
    throw error;
  }
}

export async function saveDataToDatabase(item: ItemBody): Promise<DBStatus> {
  try {
    const pool = getPool();
    const exists = await isItemIDInUse(Number(item.id));
    if (!exists) return { status: "item does not exist" };

    await pool.query(
      "UPDATE Item SET title = ?, location = ?, containedItems = ?, inStock = ? WHERE id = ?",
      [
        item.title,
        item.location,
        JSON.stringify(item.containedItems),
        item.inStock ? 1 : 0,
        item.id,
      ]
    );
    return { status: "item saved to database" };
  } catch (error) {
    console.error("Error saving data to database:", error);
    throw error;
  }
}

export async function createEntityInDatabase(id: string): Promise<ItemBody | DBStatus | null> {
  try {
    const pool = getPool();
    if (!id) return { status: "no id provided" };

    const ID = Number(id);
    const exists = await isItemIDInUse(ID);
    if (exists) return { status: "id already in use" };

    await pool.query(
      "INSERT INTO Item (id, title, location, containedItems, inStock) VALUES (?, ?, ?, ?, ?)",
      [ID, "Titel", "MTF - A1.1", JSON.stringify([]), 1]
    );

    return await getDataFromDatabase(id);
  } catch (error) {
    console.error("Error creating entity in database:", error);
    throw error;
  }
}

export async function isItemIDInUse(ID: number): Promise<boolean> {
  const pool = getPool();
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Item WHERE id = ?", [ID]
    );
    return rows.length !== 0;
  } catch (error) {
    console.error("Error checking if id is in use", error);
    throw error;
  }
}

export async function searchItems(title: string): Promise<Record<string, number>[] | false> {
  const pool = getPool();
  try {
    const [titleMatches] = await pool.query<RowDataPacket[]>(
      `SELECT id, title AS match FROM Item WHERE LOWER(title) LIKE LOWER(CONCAT(?, '%'))`,
      [title]
    );

    const indexList = Array.from({ length: 15 }, (_, i) => i);

    const containedItemQueries = await Promise.all(
      indexList.map((i) =>
        pool.query<RowDataPacket[]>(
          `SELECT id, JSON_UNQUOTE(JSON_EXTRACT(containedItems, '$[${i}]')) AS match
           FROM Item
           WHERE JSON_UNQUOTE(JSON_EXTRACT(containedItems, '$[${i}]')) IS NOT NULL
             AND LOWER(JSON_UNQUOTE(JSON_EXTRACT(containedItems, '$[${i}]'))) LIKE LOWER(CONCAT(?, '%'))`,
          [title]
        )
      )
    );

    const containedItemResults = containedItemQueries
      .flatMap((result) => result[0])
      .filter(
        (row, index, self) =>
          row.match &&
          self.findIndex((r) => r.match === row.match && r.id === row.id) === index
      );

    const combinedResults = [...titleMatches, ...containedItemResults]
      .slice(0, 5)
      .map(({ match, id }) => ({ [match]: id }));

    return combinedResults.length === 0 ? false : combinedResults;
  } catch (error) {
    console.error("Error in searchItems:", error);
    return false;
  }
}

export async function getAllItemsInStorage(): Promise<RowDataPacket[] | false> {
  const pool = getPool();
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `WITH RECURSIVE seq AS (
         SELECT 0 AS n
         UNION ALL
         SELECT n + 1 FROM seq 
         WHERE n + 1 < (SELECT MAX(JSON_LENGTH(containedItems)) FROM Item)
       )
       SELECT id, title FROM Item 
       WHERE title IS NOT NULL AND LOWER(title) != 'null'
       UNION ALL
       SELECT i.id, JSON_UNQUOTE(JSON_EXTRACT(i.containedItems, CONCAT('$[', seq.n, ']')))
       FROM Item i
       JOIN seq ON seq.n < JSON_LENGTH(i.containedItems)
       WHERE JSON_UNQUOTE(JSON_EXTRACT(i.containedItems, CONCAT('$[', seq.n, ']'))) IS NOT NULL
         AND LOWER(JSON_UNQUOTE(JSON_EXTRACT(i.containedItems, CONCAT('$[', seq.n, ']')))) != 'null'
       ORDER BY id`
    );
    return rows;
  } catch (error) {
    console.error("Error in getAllItemsInStorage:", error);
    return false;
  }
}

export async function searchLocation(title: string): Promise<RowDataPacket[] | false> {
  const pool = getPool();
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM Item 
       WHERE LOWER(title) LIKE LOWER(CONCAT('%', ?, '%')) 
          OR LOWER(description) LIKE LOWER(CONCAT('%', ?, '%'))`,
      [title, title]
    );
    return rows.length === 0 ? false : rows;
  } catch (error) {
    console.error("Error in searchLocation:", error);
    return false;
  }
}

type ItemBody = {
  title: string;
  id: string;
  location: string;
  containedItems: string[];
  inStock: boolean;
};

type DBStatus = {
  status: string;
};