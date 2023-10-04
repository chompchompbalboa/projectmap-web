import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                // Laravel Breeze
                'resources/js/breeze/app.tsx',
                // Map
                'resources/js/components/App.tsx'
            ],
            refresh: true,
        }),
        react(),
    ],
});
