import 'dotenv/config';

import app from './app.js';

app.listen(3000, () => {
  console.log('Database connection successful');
});
