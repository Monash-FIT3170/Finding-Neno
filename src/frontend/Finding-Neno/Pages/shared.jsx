
export const petTypeOptions = [
    { label: "Dog", value: "dog" },
    { label: "Cat", value: "cat" },
    { label: "Rabbit", value: "rabbit" },
    { label: "Mouse", value: "mouse" },
    { label: "Snake", value: "snake" },
    { label: "Bird", value: "bird" },
    { label: "Other", value: "other" },
];


export function formatDatetime(datetime) {
    const hours = datetime.getHours().toString().padStart(2, '0');
    const minutes = datetime.getMinutes().toString().padStart(2, '0');
    const day = datetime.getDate().toString().padStart(2, '0');
    const month = (datetime.getMonth() + 1).toString().padStart(2, '0');
    const year = datetime.getFullYear().toString();

    return `${hours}:${minutes} ${day}/${month}/${year}`
}


export async function fetchReports(filters, IP, PORT, USER_ID, ACCESS_TOKEN) {
    var missing_reports = [];

    try {
        const url = `${IP}:${PORT}/filter_missing_reports`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'User-ID': USER_ID,
            },
            body: JSON.stringify(filters),
        });

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }

        const data = await response.json();
        missing_reports = data[0];

    } catch (error) {
        console.error(error);
    }

    return missing_reports;
};