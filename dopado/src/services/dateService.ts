
export function getTodayDateKey(): string {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function getCurrentTimestamp(): string {
    return new Date().toISOString();
}

export function formatDisplayDate(dateKey: string): string {
    const [year, month, day] = dateKey.split("-").map(Number);
    const date = new Date(year, month -1, day);

    return date.toLocaleDateString("de-DE", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}
