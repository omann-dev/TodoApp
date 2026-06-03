
import * as SQLite from "expo-sqlite";

let database: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (database !== null) {
        return database;
    }

    database = await SQLite.openDatabaseAsync("dopado.db");
    return database;
}