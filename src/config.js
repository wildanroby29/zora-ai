const params = new URLSearchParams(window.location.search);
const mode = params.get("mode") || "demo";

export const APP_CONFIG = {
  demo: {
    name: "Zora AI",
    tagline: "Assistant virtual pelanggan 24/7 untuk meningkatkan peluang penjualan"
  },
  hotel: {
    name: "Zora Concierge AI",
    tagline: "Otomatisasi layanan tamu 24/7 tanpa beban front office"
  },
  restaurant: {
    name: "Zora Service AI",
    tagline: "Pelayanan & reservasi cepat tanpa antrean atau delay"
  }
};

export const APP_NAME = APP_CONFIG[mode]?.name;
export const APP_TAGLINE = APP_CONFIG[mode]?.tagline;
export const APP_MODE = mode;
