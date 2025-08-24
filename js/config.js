// Configuration management
const CONFIG = {
  // Environment detection
  IS_DEVELOPMENT:
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.protocol === "file:",

  // API Configuration
  API: {
    BASE_URL:
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
        ? "http://localhost:1337/api/" // Development
        : "https://enderyazici-githubio-be-production.up.railway.app/api/", // Production

    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
  },

  // Security Configuration
  SECURITY: {
    ALLOWED_DOMAINS: [
      "enderyazici.com.tr",
      "www.enderyazici.com.tr",
      "enderyazici.github.io",
      "enderyazici-githubio-be-production.up.railway.app",
      "localhost",
      "127.0.0.1",
    ],

    // XSS Koruması için izin verilen HTML etiketleri
    ALLOWED_HTML_TAGS: {
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
      p: [],
      br: [],
      strong: [],
      b: [],
      em: [],
      i: [],
      u: [],
      ul: [],
      ol: [],
      li: [],
      blockquote: [],
      code: [],
      pre: ["class"],
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      hr: [],
    },
  },

  // Cache Configuration
  CACHE: {
    TTL: 300000, // 5 minutes in milliseconds
    MAX_SIZE: 50, // Maximum number of cached items
  },
};

// URL validation function
function isValidURL(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Railway domain'i için özel kontrol
    if (hostname === "enderyazici-githubio-be-production.up.railway.app") {
      return true;
    }

    const isValid = CONFIG.SECURITY.ALLOWED_DOMAINS.some((domain) => {
      return hostname === domain || hostname.endsWith("." + domain);
    });

    return isValid;
  } catch (error) {
    console.error("URL validation error:", error);
    return false;
  }
}

// Export configuration
window.CONFIG = CONFIG;
window.isValidURL = isValidURL;
