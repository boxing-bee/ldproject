// // vite.config.js
// export default {
//     root: ".",
// };
import { defineConfig } from 'vite';

export default defineConfig({
    define: {
        'process.env.VITE_LAUNCHDARKLY_CLIENT_SIDE_ID': JSON.stringify(process.env.LAUNCHDARKLY_CLIENT_SIDE_ID),
    },
});