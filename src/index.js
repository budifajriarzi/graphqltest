const { GraphQLServer, PubSub } = require('graphql-yoga')

// -------------------------------------
// dummy data
let dummyPersons = [
	{
		id: 1, 
		firstName: 'Michael',
		lastName: 'Suyama',
		email: 'suyama@wp.co',
		likedPosts: [1, 2]
	},
	{
		id: 2, 
		firstName: 'Nancy',
		lastName: 'DaVolio',
		email: 'davolio@wp.co',
		likedPosts: [1]
	},
	{
		id: 3, 
		firstName: 'David',
		lastName: 'Buchanan',
		email: 'buchanan@wp.co',
		likedPosts: [2, 3]
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
const CHANNEL = 'CHANNEL'

const resolvers = {
	Query: {
		hello: () => `Hello World!`,
		people: () => dummyPersons,
		person: (parent, args, context) => { console.log(args.id); return dummyPersons[args.id-1] },
		posts: (parent, args, context) => {
			var filteredDummyPosts = dummyPosts.filter((dummyPost) => { 
				return dummyPost.description.indexOf(args.filter) != -1
			})
			
			return filteredDummyPosts
		},
		post: (parent, args, context) => { console.log(args.id); return dummyPosts[args.id-1] },
	},
	Mutation: {
		createPost: (parent, args, { pubsub }) => { 
			var newPost = {
				id: dummyPosts[dummyPosts.length-1].id + 1, 
				description: args.description, 
				imageUrl: args.imageUrl
			}
		
			dummyPosts.push(newPost)
			pubsub.publish(CHANNEL, { newPost: newPost })
			return newPost
		},
		deletePost: (parent, args) => {
			dummyPosts.forEach((item, index) => {
				if(item.id == args.id){
					var deletedPost = dummyPosts[index]
					dummyPosts.splice(index, 1)
					return deletedPost
				}
			})
		}
	},
	Subscription: {
		newPost: {
			subscribe: (parent, args, { pubsub }) => {
				return pubsub.asyncIterator(CHANNEL)
			}
		}
	},
	Person: {
		id: (parent) => parent.id,
		firstName: (parent) => parent.firstName,
		lastName: (parent) => parent.lastName,
		fullName: (parent) => parent.firstName + ' ' + parent.lastName,
		email: (parent) => parent.email,
		likedPosts: (parent) => dummyPosts.filter((dummyPost) => {
			return parent.likedPosts.indexOf(dummyPost.id) != -1 
		})
	},
	Post: {
		id: (parent) => parent.id,
		description: (parent) => parent.description,
		imageUrl: (parent) => parent.imageUrl
	}
}

const pubsub = new PubSub()
const server = new GraphQLServer({
	typeDefs : './src/schema.graphql',
	resolvers : resolvers,
	context: { pubsub }
})
server.start(() => console.log(`Server is running on http://localhost:4000`))