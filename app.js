const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(express.json());
app.use(cors());

const swaggerUI = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('fs');
const file = fs.readFileSync('./api-docs.yaml', 'utf-8');
const swaggerDocument = YAML.parse(file);

app.use('/v1/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

const v1Router = require('./routes/v1/index.js');
app.use('/v1', v1Router);

app.listen(port, () => {
    console.log('Server running on port', port);
});
