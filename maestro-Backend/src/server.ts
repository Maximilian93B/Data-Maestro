
import dotenv from 'dotenv'; 
import { typeDefs, resolvers } from './graphql/schema';
import  express  from 'express';
import { ApolloServer } from 'apollo-server-express';
import connectDB from './db/connectDB';

dotenv.config();


const app = express();


// Create the apollo instance 

const apolloServer = new ApolloServer ({ typeDefs, resolvers }); 


const startMaestroServer = async () => {
        try {
            // Wait for the database connection to be established
            await connectDB();
        
            // Start Apollo Server
            await apolloServer.start();
        
            // Apply Apollo middleware to Express
            apolloServer.applyMiddleware({ app });
        
            // Start Express server
            const PORT = process.env.PORT || 3000;
            app.listen(PORT, () => {
              console.log(`Server is running on http://localhost:${PORT}${apolloServer.graphqlPath}`);
            });
          } catch (err) {
            console.error(err);
            process.exit(1);
          }
        };

startMaestroServer();
