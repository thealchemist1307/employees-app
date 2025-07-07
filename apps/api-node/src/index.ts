import dotenv from "dotenv";
import path from "path";

dotenv.config();

import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers, Context } from "./graphql";
import { verifyToken, JWTPayload } from "./utils/jwt";

async function start() {
  const app = express();
  app.use(cors({
    origin: [
      'https://employeesapp.shauqtechnology.in',
      'http://192.168.1.12'
    ],
    credentials: true
  }));
  app.get("/health", (_, res) => res.json({ ok: true }));

  const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    context: ({ req }): Context => {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {};
      }

      try {
        const token = authHeader.substring(7);
        const user = verifyToken(token);
        return { user };
      } catch (error) {
        return {};
      }
    },
  });
  
  await server.start();
  server.applyMiddleware({ app: app as any, path: "/graphql" });

  app.use(express.static(path.join(__dirname, "../public")));

  // For SPA: serve index.html for any unknown route (after API routes)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.listen(4700, () =>
    console.log("🚀  API ready at http://localhost:4700/graphql")
  );
}
start(); 