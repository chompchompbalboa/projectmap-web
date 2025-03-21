import { defineConfig } from 'vite'

import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        laravel({
            input: [
                // CSS
                'resources/css/index.css',
                // Laravel Breeze
                'resources/js/breeze/app.tsx',
                // Map
                'resources/js/components/App.tsx'
            ],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
});
