const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const config = require('./config.json');

const app = express();


// // Postgresql + Sequelize Configuration
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('graphql', 'juliuskarl', 'Juliuskarl24031997', {
//     host: 'graphql.ct5iksibomdv.us-east-1.rds.amazonaws.com',
//     dialect: 'postgres',
//     port: 5432
// });

// try {
//     sequelize.authenticate(()=> {
//         console.log('Connection has been established successfully.');
//     });
//     } catch (error) {
//     console.error('Unable to connect to the database:', error);
//     }

// MongoDB + Mongoose Configuration
mongoose.connect(`mongodb+srv://${config.username}:${config.password}@cluster0.vozei.mongodb.net/${config.dbname}?retryWrites=true&w=majority`, { 
    useUnifiedTopology: true 
});

mongoose.connection.once('open', () => {
    console.log('Connected to DB');
});
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('Listening on port 4000');
});