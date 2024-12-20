import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
    entry: './src/index.js', 
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'), 
    },
// Make this section active if you want to use webpack to handle CSS
    /*
    module: {
        rules: [
            {
                test: /\.css$/i, 
                use: ['style-loader', 'css-loader'], 
            },
        ],
    },
    */
};

export default config;