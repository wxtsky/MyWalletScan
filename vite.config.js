import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@components': resolve(__dirname, './components'),
            '@': resolve(__dirname, './src'),
            '@routes': resolve(__dirname, './src/routes'),
            '@pages': resolve(__dirname, './src/pages'),
            '@utils': resolve(__dirname, './src/utils'),
            '@store': resolve(__dirname, './src/store'),
        }
    },
    base: './',
    server: {
        port: 5175,
    }
});
