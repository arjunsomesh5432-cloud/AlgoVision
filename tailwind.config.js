/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                // Existing project colors
                'turquoise-dark': '#2B7A70',
                'carbon': '#2E2E2E',
                'carbon-light': '#393939',
                'white-light': '#ecf0f1',
                'glass': 'rgba(255,255,255,0.05)',
                // shadcn CSS variable tokens (override the old 'primary', 'accent' etc.)
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                // Keep legacy aliases for existing app components
                'accent2': '#00d4ff',
                'surface': '#1a1a2e',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
        },
    },
    safelist: [
        // Algorithm complexity badge backgrounds (dynamically applied via JS)
        "bg-green-800", "bg-yellow-600", "bg-orange-700", "bg-red-800", "bg-lime-700", "bg-emerald-500",
        // Backdrop blur — safelist as production insurance (used in .glass and shader background)
        "backdrop-blur-sm", "backdrop-blur-md", "backdrop-blur-lg", "backdrop-blur-xl",
    ],
    plugins: [],
};
