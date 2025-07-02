// src/utils/timeAgo.js
export const timeAgo = (date) => {
    if (!date) return "Never";

    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    // Handle future dates (should not happen normally)
    if (diffInSeconds < 0) return "Just now";

    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
        }
    }

    return "Just now";
};

// Versi yang lebih detail dengan format yang lebih baik
export const timeAgoDetailed = (date) => {
    if (!date) return "Never";

    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 0) return "Just now";

    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
            if (count === 1) {
                // Singular forms
                switch (interval.label) {
                    case "year":
                        return "1 year ago";
                    case "month":
                        return "1 month ago";
                    case "week":
                        return "1 week ago";
                    case "day":
                        return "1 day ago";
                    case "hour":
                        return "1 hour ago";
                    case "minute":
                        return "1 minute ago";
                }
            } else {
                // Plural forms
                return `${count} ${interval.label}s ago`;
            }
        }
    }

    return diffInSeconds < 30 ? "Just now" : "Less than a minute ago";
};

// Format untuk tooltip (menampilkan tanggal lengkap)
export const formatDateTime = (date) => {
    if (!date) return "Never";

    const dateObj = new Date(date);
    return dateObj.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};
