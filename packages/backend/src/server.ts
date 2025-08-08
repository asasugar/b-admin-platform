import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import app from './app';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: path.resolve(__dirname, '../../.env') });

const PORT = Number(process.env.BACKEND_PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
