const graphql = require('graphql');
const _ = require('lodash');

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLID, 
    GraphQLInt,
    GraphQLList} 
= graphql;

// Dummy Data
var books = [
    {name: 'Name of the Wind', genre: 'Fantasy', id: '0', authorId: '0'},
    {name: 'The Final Empire', genre: 'Fantasy', id: '1', authorId: '1'},
    {name: 'The Long Earth', genre: 'Sci-Fi', id: '2', authorId: '2'},
];

var authors = [
    {name: 'Patrick Rothfuss', age: '44', id: '0', bookId: "0"},
    {name: 'Brandon Sanderson', age: '42', id: '1', bookId: "1"},
    {name: 'Terry Pratchett', age: '66', id: '2', bookId: "2"},
];

// Type Definitions
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: { type: AuthorType, resolve(parent, args) {
           return  _.find(authors, {id: parent.authorId});
        }}
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Authors',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {type: new GraphQLList(BookType), resolve(parent, args) {
            return _.filter(books, {authorId: parent.id})
        }}
    })
});

// Root Query and Resolvers
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        book: {
            type: BookType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                return _.find(books, { id: args.id });
            }
        },
        allBooks: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books;
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                return _.find(authors, { id: args.id });
            }
        },
        allAuthors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return authors;
            }
        },
    })
})

module.exports = new GraphQLSchema({
    query: RootQuery
})