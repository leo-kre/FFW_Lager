// db.js
const mysql = require("mysql2/promise");

export default function dbConnection() {
      return mysql.createPool({
            host: "130.61.125.137",
            user: "webAccess",
            password: "webAccess_001",
            database: "FFW_Lager",
            port: 4000,
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

            console.log("Data saved to database:", item);
      } catch (error) {
            console.error("Error saving data to database:", error);
            throw error;
      }
}

export type ItemBody = {
      title: string;
      id: string;
      location: string;
      description: string;
      inStock: boolean;
};
