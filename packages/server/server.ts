// This file is the entry point for the app

import './config/env';
import app from './app';

const PORT = Number(process.env.EXPRESS_SERVER_PORT ?? 3000);

app.listen(PORT, '127.0.0.1', () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
