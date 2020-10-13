const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLID, 
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull} 
= graphql;

// Type Definitions
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: { type: AuthorType, resolve(parent, args) {
           return  Author.findById(parent.authorId);
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
            return Book.find({authorId: parent.id})
        }}
    })
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
                resolve(parent, args) {
                    let author = new Author({
                        name: args.name,
                        age: args.age
                    });
                    return author.save();
                }
        },
        updateAuthor: {
            type: AuthorType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
                resolve(parent, args) {
                    return Author.findByIdAndUpdate(args.id, {name: args.name, age: args.age});
                }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)},
                genre: { type: new GraphQLNonNull(GraphQLString) }
            },
                resolve(parent, args) {
                    let book = new Book({
                        name: args.name,
                        genre: args.genre
                    });
                    return book.save();
                }
        },
        updateBook: {
            type: BookType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                genre: { type: GraphQLString }
            },
                resolve(parent, args) {
                    return Book.findByIdAndUpdate(args.id, {name: args.name, genre: args.genre});
                }
        },
    }
});

// Root Query and Resolvers
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        book: {
            type: BookType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                return Book.findById(args.id);
            }
        },
        allBooks: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find();
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                return Author.findById(args.id);
            }
        },
        allAuthors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find();
            }
        },
    })
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})