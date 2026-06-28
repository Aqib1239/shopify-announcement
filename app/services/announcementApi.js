const API = 'https://shopify-announcement-backend.onrender.com/api/announcement';

export async function createAnnouncement(text) {
    const res = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({text}),
    });

    return res.json();
}

export async function getAnnouncements() {
    const res = await fetch(API);

    return res.json();
}