const mysql = require("mysql2/promise");

export default function dbConnection() {
      return mysql.createPool({
            host: process.env.NEXT_PUBLIC_DB_HOST,
            user: process.env.NEXT_PUBLIC_DB_USER,
            password: process.env.NEXT_PUBLIC_DB_PASSWORD,
            database: process.env.NEXT_PUBLIC_DB_DATABASE_NAME,
            port: Number(process.env.NEXT_PUBLIC_DB_DATABASE_PORT),
      });
}

export async function getDataFromDatabase(id: string): Promise<any> {
      try {
            const pool = dbConnection();
            const ID = Number(id);

            const [rows] = await pool.query("SELECT * FROM Item WHERE id = ?", [ID]);

            console.log("fetching data from database");
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

export async function saveDataToDatabase(item: ItemBody): Promise<DBStatus> {
      try {
            const pool = dbConnection();

            const isIDAvailable = await isItemIDInUse(Number(item.id));

            if (!isIDAvailable) {
                  return { status: "item does not exist" };
            }

            if (item.id) {
                  await pool.query("UPDATE Item SET title = ?, location = ?, description = ?, inStock = ? WHERE id = ?", [item.title, item.location, item.description, item.inStock ? 1 : 0, item.id]);
            } else {
                  await createEntityInDatabase(item.id);
            }

            return { status: "item saved to database" };
      } catch (error) {
            console.error("Error saving data to database:", error);
            throw error;
      }
}

export async function createEntityInDatabase(id: string): Promise<any> {
      try {
            const pool = dbConnection();

            if (!id) {
                  return { status: "no id provided" };
            }

            const isIDAvailable = await isItemIDInUse(Number(id));

            if (isIDAvailable) {
                  const ID = Number(id);
                  await pool.query("INSERT INTO Item (id, title, location, description, inStock) VALUES (?, ?, ?, ?, ?)", [ID, "Titel", "MTF - A1.1", "", 1]);
            } else {
                  return { status: "id already in use" };
            }

            return await getDataFromDatabase(id);
      } catch (error) {
            console.error("Error saving data to database:", error);
            throw error;
      }
}

export async function isItemIDInUse(ID: number): Promise<boolean> {
      const pool = dbConnection();
      try {
            const [rows] = await pool.query("SELECT * FROM Item WHERE id = ?", [ID]);

            if (rows.lengt == 0) return false;

            return true;
      } catch (error) {
            return false;
      }
}

export async function searchItem(title: string) {
      const pool = dbConnection();
      try {
            const [rows] = await pool.query("SELECT * FROM Item WHERE LOWER(title) LIKE LOWER(CONCAT('%', ?, '%')) OR LOWER(description) LIKE LOWER(CONCAT('%', ?, '%'))", [title, title]);

            if (rows.lengt == 0) return false;

            return rows;
      } catch (error) {
            return false;
      }
}

export async function searchLocation(title: string) {
      const pool = dbConnection();

      const searchText = title.toLowerCase();

      try {
            const [rows] = await pool.query("SELECT * FROM Item WHERE LOWER(title) LIKE LOWER(CONCAT('%', ?, '%')) OR LOWER(description) LIKE LOWER(CONCAT('%', ?, '%'))", [searchText, searchText]);

            if (rows.lengt == 0) return false;

            return rows;
      } catch (error) {
            return false;
      }
}

type ItemBody = {
      title: string;
      id: string;
      location: string;
      description: string;
      inStock: boolean;
};

type DBStatus = {
      status: string;
};
