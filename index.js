const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const questions = require('./routes/technicalqq');
const users = require('./routes/users');
const cors = require('cors');
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

var options = {
  explorer: true
};

mongoose.connect(config.get('mongodbURL'), {useNewUrlParser:true,useUnifiedTopology:true})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(helmet());
app.use(cors()) // Use this after the variable declaration
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
app.use('/api/questions', questions);
app.use('/api/users', users);
if(app.get('env') === 'development'){
  app.use(morgan('tiny'));
  console.log('Morgan Enabled......');
}

//Configuration
console.log("Application Name : "+ config.get('name'));
console.log("Mail Server : "+ config.get('mail.host'));
//console.log("Mail Password : "+ config.get('mail.password'));
console.log("mongodbURL : "+ config.get('mongodbURL'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));