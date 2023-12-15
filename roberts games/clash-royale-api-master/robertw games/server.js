const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const config = require('./src/config/config');

const app = require('./src/app')(mongoose);
const port = config.PORT;

app.listen(port, () => {
  console.log(`Magic happens on port ${port}`); // eslint-disable-line no-console
});
