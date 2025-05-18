import defaultTheme from "tailwindcss/defaultTheme";
import animatePlugin from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
    darkMode: ["class"],
    content: ["./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
                mono: ["var(--font-geist-mono)", ...defaultTheme.fontFamily.mono],
                pixel: ["'Press Start 2P'", "monospace"],
            },
            colors: {
                // ITテーマ色
                terminal: {
                    green: "#0CFA00",
                    dark: "#001500",
                },
                screen: {
                    blue: "#0066ff",
                    dark: "#001133",
                },
                matrix: {
                    light: "#00FF41",
                    dark: "#0D0208",
                },
                cyber: {
                    purple: "#FF00FF",
                    blue: "#00FFFF",
                    yellow: "#FFFF00",
                    black: "#0A0A0A",
                },
                retro: {
                    primary: "#FF5555",
                    secondary: "#55FF55",
                    accent: "#5555FF",
                    dark: "#121212",
                },
                // 既存の色に加えて
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                // 他のshadcn/ui必須の色設定
            },
            keyframes: {
                blink: {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0 },
                },
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
                pixelate: {
                    '0%': { filter: 'pixelate(1px)' },
                    '50%': { filter: 'pixelate(4px)' },
                    '100%': { filter: 'pixelate(1px)' },
                },
                glitch: {
                    '0%': { transform: 'translate(0)' },
                    '2%': { transform: 'translate(3px, 0)' },
                    '4%': { transform: 'translate(-3px, 0)' },
                    '6%': { transform: 'translate(0, 0)' },
                    '8%': { transform: 'translate(0, -3px)' },
                    '10%': { transform: 'translate(0, 3px)' },
                    '12%': { transform: 'translate(0)' },
                },
                crt: {
                    '0%': { 
                        opacity: '0.9',
                        transform: 'scale(1.001, 1.001) translateY(0)'
                    },
                    '100%': { 
                        opacity: '1',
                        transform: 'scale(1, 1) translateY(0)'
                    },
                },
                pulse8bit: {
                    '0%, 100%': { 
                        boxShadow: '0 0 0 0 rgba(12, 250, 0, 0)' 
                    },
                    '50%': { 
                        boxShadow: '0 0 0 4px rgba(12, 250, 0, 0.5)' 
                    },
                },
            },
            animation: {
                blink: 'blink 1s step-end infinite',
                scanline: 'scanline 3s linear infinite',
                pixelate: 'pixelate 0.3s ease-in-out',
                glitch: 'glitch 1s ease-in-out infinite',
                crt: 'crt 0.1s infinite',
                pulse8bit: 'pulse8bit 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, rgba(12, 250, 0, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(12, 250, 0, 0.1) 1px, transparent 1px)",
                'noise': "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gQcCBIQLKdTIQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADC0lEQVRo3u2aPW7bQBCFn0hBoUu3AtK5UFG4dqVb3AVIXEnOkDK3CB3BRcpcwLchXKVx4c4uwS45gMvAhoNlKYn8ISVyZ4BFwAC75JvZtzNvRV6fr4mdjCQA5Pd/LPbP8vt41C/4nY+4URlUpsbuRm6jItTIbbTGhJkZnZtRMSGCDfs1cueMDOu1zvreGXm7uCCL9xudtaxWGH88APi5sOHl81nzdw/7PZ1a6wWS6vEwGrm9vTV/r9drEkLg2AghdMLsuy4wxvTGMPkQtm1bUko9MTdCKcX29rbZwKqqMMZgjOklMsYw9sW0bcuyrBBCdBi5urpCCMFsNmM+n/eYHfPqQSl86rMoCpbLJcC43xFjDEopF3XfQXzGCiF6SXtCiqIYzZ94jvRZ47mRuq5dRzzX8RlzCVRV5TLSsw8hBMYYp1ZM4hHfPrTWXhI8F4wxKKVIkgSllDsQk3ikKApCCE7FiqJw55EQwmyMVFXlJOPzcpqmdGutyypaa53QBXCSmc/nfanl11p4xlJKee70nJXSl1p+mkmShKqqvHgkhNAJW1Mw0jTNpB7RWnv2McbQNI2XWj7wJEnCZrOZ1CNJkjiFzHMP3zNJkrhcQCl7aG4cx5MxcnZ25jIymh9jMOL7b85ITuhOFef7nfFaa7Q9stlsTMHohO9WVRXGGKqqYrFYOCGcpqlTuW3bcjgcXMHQNA1pmnJ+fv6PzSF25lNQStE0jTt2v66qCq21k8xQUyil5vM5dV2jtXZlDcDLy4uL+JD7+WTGWi6XXF9fu+B7d3c3iZE4jkmShOVy6b7pMXJxcTGZENI0JY5jJ/lRbYx13JumqRNCf00ltkajwu12y+7ublcsjuOubvK/JKu1JssyDw+HITn4+Pg4WUr5hDBVSjVN0+XOaDtDSpnv7+9xcXHB/v7+KLdTSvH09NQdEUwdjKPWD3d3d+R5zvPzs3PsMhRCVVXRtu0oxT0fO9a6uroiz3OWyyVZlvH29vavE8DhcODh4YE8z/n6+vKOZf4ApXLHM3A3aLgAAAAASUVORK5CYII=')",
            },
        },
    },
    plugins: [animatePlugin],
};

export default config;
