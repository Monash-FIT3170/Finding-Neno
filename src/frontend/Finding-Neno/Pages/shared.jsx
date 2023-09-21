
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

export function formatDateTimeDisplay(datetime) {
    const now = new Date();
    const diffTime = Math.abs(now - datetime);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const hours = datetime.getHours().toString().padStart(2, '0');
    const minutes = datetime.getMinutes().toString().padStart(2, '0');
    const day = datetime.getDate().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;

    if (diffDays === 0) {
        return `Today ${time}`;
    }
    else if (diffDays === 1) {
        return `Yesterday ${time}`;
    } else if (diffDays < 4) {
        return `${diffDays} days ago ${time}`;
    } else {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', "Oct", "Nov", "Dec"];

        const monthIndex = datetime.getMonth();
        const year = datetime.getFullYear().toString();

        return `${day} ${months[monthIndex]} ${year} ${time}`;
    }
}
