// db.js
const mysql = require("mysql2/promise");

export default function dbConnection() {
      console.log(process.env.NEXT_PUBLIC_DB_HOST);

      return mysql.createPool({
            host: process.env.NEXT_PUBLIC_DB_HOST,
            user: process.env.NEXT_PUBLIC_DB_USER,
            password: process.env.NEXT_PUBLIC_DB_PASSWORD,
            database: process.env.NEXT_PUBLIC_DB_DATABASE_NAME,
            port: Number(process.env.NEXT_PUBLIC_DB_DATABASE_PORT),
      });
}

export async function getDataFromDatabase(id: string) {
      try {
            const pool = dbConnection();
            const ID = Number(id);

            const [rows] = await pool.query("SELECT * FROM Item WHERE id = ?", [ID]);

            if (rows.length == 0) {
                  return null;
            }

            const data: ItemBody = rows[0];

            return data;
      } catch (error) {
            console.error("Error fetching data from database:", error);
            throw error;
      }
}

export async function saveDataToDatabase(item: ItemBody): Promise<void> {
      try {
            const pool = dbConnection();

            if (item.id) {
                  await pool.query("UPDATE Item SET title = ?, location = ?, description = ?, inStock = ? WHERE id = ?", [item.title, item.location, item.description, item.inStock ? 1 : 0, item.id]);
            } else {
                  await pool.query("INSERT INTO Item (title, location, description, inStock) VALUES (?, ?, ?, ?)", [item.title, item.location, item.description, item.inStock ? 1 : 0]);
            }
      } catch (error) {
            console.error("Error saving data to database:", error);
            throw error;
      }
}

type ItemBody = {
      title: string;
      id: string;
      location: string;
      description: string;
      inStock: boolean;
};
