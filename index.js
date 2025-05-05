const express = require('express');
const app = express();
const apiRoutes = require('./routes/api');
const pagesRoutes = require('./routes/pages');
const path = require('path');
const PORT = 3630;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use('/api/', apiRoutes);
app.use('/', pagesRoutes);



app.listen(PORT, () => {
    console.log(`Le serveur est accessible à http://localhost:${PORT}`);
});