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
            '@constants': resolve(__dirname, './src/constants'),
            '@store': resolve(__dirname, './src/store'),
            '@address': resolve(__dirname, './address.json')
        }
    },
    base: './',
    server: {
        port: 5175,
    }
});
