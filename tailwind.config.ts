import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nile: { DEFAULT: "#0e7c7b", dark: "#0a5e5d", light: "#e6f4f3" },
        saffron: { DEFAULT: "#e8a317", light: "#fdf3d7" },
        sand: "#f7f3ec",
        ink: "#17202a",
      },
    },
  },
  plugins: [],
};
export default config;
