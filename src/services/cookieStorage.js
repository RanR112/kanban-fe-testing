class CookieStorage {
    constructor() {
        this.defaultOptions = {
            path: "/",
            sameSite: "strict",
            secure: window.location.protocol === "https:",
        };
    }

    // Set cookie (for non-HTTP-only cookies)
    setCookie(name, value, options = {}) {
        const opts = { ...this.defaultOptions, ...options };

        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
            value
        )}`;

        if (opts.maxAge) {
            cookieString += `; Max-Age=${opts.maxAge}`;
        } else if (opts.expires) {
            cookieString += `; Expires=${opts.expires.toUTCString()}`;
        }

        if (opts.path) {
            cookieString += `; Path=${opts.path}`;
        }

        if (opts.domain) {
            cookieString += `; Domain=${opts.domain}`;
        }

        if (opts.secure) {
            cookieString += `; Secure`;
        }

        if (opts.sameSite) {
            cookieString += `; SameSite=${opts.sameSite}`;
        }

        if (opts.httpOnly) {
            console.warn("HttpOnly cookies cannot be set from JavaScript");
            return false;
        }

        document.cookie = cookieString;
        return true;
    }

    // Get cookie value
    getCookie(name) {
        const nameEQ = encodeURIComponent(name) + "=";
        const cookies = document.cookie.split(";");

        for (let cookie of cookies) {
            let c = cookie.trim();
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length));
            }
        }
        return null;
    }

    // Remove cookie
    removeCookie(name, options = {}) {
        const opts = { ...this.defaultOptions, ...options };

        // Set expiry date to past untuk delete cookie
        this.setCookie(name, "", {
            ...opts,
            expires: new Date(0),
            maxAge: 0,
        });
    }

    // Check if cookie exists
    hasCookie(name) {
        return this.getCookie(name) !== null;
    }

    // Get all cookies as object
    getAllCookies() {
        const cookies = {};
        const cookieArray = document.cookie.split(";");

        for (let cookie of cookieArray) {
            const [name, value] = cookie.trim().split("=");
            if (name && value) {
                cookies[decodeURIComponent(name)] = decodeURIComponent(value);
            }
        }

        return cookies;
    }

    // Clear all cookies (yang bisa diakses via JavaScript)
    clearAllCookies() {
        const cookies = this.getAllCookies();

        for (let cookieName in cookies) {
            this.removeCookie(cookieName);

            // Try to remove dengan different path options
            this.removeCookie(cookieName, { path: "/" });
            this.removeCookie(cookieName, {
                path: "/",
                domain: window.location.hostname,
            });
            this.removeCookie(cookieName, {
                path: "/",
                domain: `.${window.location.hostname}`,
            });
        }
    }

    // Token-specific methods
    setToken(key, value, options = {}) {
        const tokenOptions = {
            ...options,
            maxAge: options.maxAge || 60 * 60 * 24, // 1 day default
            secure: window.location.protocol === "https:",
            sameSite: "strict",
        };

        return this.setCookie(key, value, tokenOptions);
    }

    getToken(key) {
        return this.getCookie(key);
    }

    removeToken(key) {
        this.removeCookie(key);
        // Try multiple path combinations untuk ensure removal
        this.removeCookie(key, { path: "/" });
        this.removeCookie(key, { path: "/", domain: window.location.hostname });
    }

    // Check if HTTP-only cookies are available
    // Note: Kita tidak bisa detect HTTP-only cookies dari JavaScript
    // Ini hanya placeholder untuk consistency
    hasHttpOnlyCookies() {
        // HTTP-only cookies tidak bisa dideteksi dari JavaScript
        // Return true jika backend mendukung
        return true; // Assume backend supports it
    }

    // Store token dengan expiry based on token type
    storeAccessToken(token) {
        return this.setToken("access_token_client", token, {
            maxAge: 30 * 60, // 30 minutes
            secure: true,
            sameSite: "strict",
        });
    }

    storeRefreshToken(token) {
        return this.setToken("refresh_token_client", token, {
            maxAge: 7 * 24 * 60 * 60, // 7 days
            secure: true,
            sameSite: "strict",
        });
    }

    getAccessToken() {
        return this.getToken("access_token_client");
    }

    getRefreshToken() {
        return this.getToken("refresh_token_client");
    }

    clearTokens() {
        this.removeToken("access_token_client");
        this.removeToken("refresh_token_client");

        // Clear any other auth-related cookies
        const allCookies = this.getAllCookies();
        Object.keys(allCookies).forEach((key) => {
            if (
                key.includes("token") ||
                key.includes("auth") ||
                key.includes("session")
            ) {
                this.removeCookie(key);
            }
        });
    }

    // Get cookie info untuk debugging
    getCookieInfo() {
        const allCookies = this.getAllCookies();
        const tokenCookies = {};

        Object.keys(allCookies).forEach((key) => {
            if (key.includes("token") || key.includes("auth")) {
                tokenCookies[key] = allCookies[key];
            }
        });

        return {
            totalCookies: Object.keys(allCookies).length,
            tokenCookies: tokenCookies,
            hasAccessToken: this.hasCookie("access_token_client"),
            hasRefreshToken: this.hasCookie("refresh_token_client"),
            supportsSecure: window.location.protocol === "https:",
            domain: window.location.hostname,
        };
    }

    // Parse cookie expiry
    parseCookieExpiry(cookieString) {
        const expiryMatch = cookieString.match(/expires=([^;]+)/i);
        if (expiryMatch) {
            return new Date(expiryMatch[1]);
        }

        const maxAgeMatch = cookieString.match(/max-age=(\d+)/i);
        if (maxAgeMatch) {
            const maxAge = parseInt(maxAgeMatch[1]);
            return new Date(Date.now() + maxAge * 1000);
        }

        return null;
    }

    // Check if cookies are enabled
    areCookiesEnabled() {
        const testName = "cookie_test";
        const testValue = "test";

        this.setCookie(testName, testValue);
        const isEnabled = this.getCookie(testName) === testValue;
        this.removeCookie(testName);

        return isEnabled;
    }

    // Get storage type info
    getStorageInfo() {
        return {
            type: "cookies",
            enabled: this.areCookiesEnabled(),
            secure: window.location.protocol === "https:",
            httpOnly: false, // Client-side cookies are not HTTP-only
            sameSite: "strict",
            domain: window.location.hostname,
            cookieCount: Object.keys(this.getAllCookies()).length,
        };
    }
}

// Export singleton instance
export default new CookieStorage();
