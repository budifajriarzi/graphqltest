const { GraphQLServer } = require('graphql-yoga')

// -------------------------------------
// dummy data
let dummyPersons = [
	{
		id: 1, 
		firstName: 'Michael',
		lastName: 'Suyama',
		fullName: 'Michael Suyama',
		email: 'suyama@wp.co',
		likedPosts: [
			{
				id: 1,
				description: 'Introduction to GraphQL',
				imageUrl: 'google.com'
			},
			{
				id: 2,
				description: 'Welcome to POC',
				imageUrl: 'microsoft.com'
			}
		]
	},
	{
		id: 2, 
		firstName: 'Nancy',
		lastName: 'DaVolio',
		fullName: 'Nancy DaVolio',
		email: 'davolio@wp.co',
		likedPosts: [
			{
				id: 1,
				description: 'Introduction to GraphQL',
				imageUrl: 'google.com'
			}
		]
	},
	{
		id: 3, 
		firstName: 'David',
		lastName: 'Buchanan',
		fullName: 'David Buchanan',
		email: 'buchanan@wp.co',
		likedPosts: [
			{
				id: 2,
				description: 'Welcome to POC',
				imageUrl: 'microsoft.com'
			},
			{
				id: 3,
				description: 'Advanced GraphQL',
				imageUrl: 'yahoo.com'
			}
		]
	}
]

let dummyPosts = [
	{
		id: 1,
		description: 'Introduction to GraphQL',
		imageUrl: 'google.com'
	},
	{
		id: 2,
		description: 'Welcome to POC',
		imageUrl: 'microsoft.com'
	},
	{
		id: 3,
		description: 'Advanced GraphQL',
		imageUrl: 'yahoo.com'
	},
]
// -------------------------------------

const typeDefs = `
	type Query {
		hello: String
		people: [Person]
		person(id: Int!): Person
		posts: [Post]
		post(id: Int!): Post
	}
	
	type Person {
		id: Int!
		firstName: String
		lastName: String
		fullName: String
		email: String
		likedPosts: [Post]
	}
	
	type Post {
		id: Int!
		description: String
		imageUrl: String
	}
`

const resolvers = {
	Query: {
		hello: () => `Hello World!`,
		people: () => dummyPersons,
		person: (parent, args, context) => { console.log(args.id); return dummyPersons[args.id-1] },
		posts: () => dummyPosts,
		post: (parent, args, context) => { console.log(args.id); return dummyPosts[args.id-1] },
	},
	Person: {
		id: (parent) => parent.id,
		firstName: (parent) => parent.firstName,
		lastName: (parent) => parent.lastName,
		fullName: (parent) => parent.fullName,
		email: (parent) => parent.email,
		likedPosts: (parent) => parent.likedPosts
	},
	Post: {
		id: (parent) => parent.id,
		description: (parent) => parent.description,
		imageUrl: (parent) => parent.imageUrl
	}
}

const server = new GraphQLServer({
	typeDefs,
	resolvers,
})
server.start(() => console.log(`Server is running on http://localhost:4000`))