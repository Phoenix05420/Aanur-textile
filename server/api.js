import { app } from './app.js';

export { app };

// Adapter to forward raw (req, res) to Express app if called directly
export async function handleApiRequest(req, res) {
  return new Promise((resolve) => {
    app(req, res, () => {
      resolve();
    });
  });
}
