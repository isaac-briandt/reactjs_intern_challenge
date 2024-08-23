import { createServer, Response } from "miragejs";

export default function () {
  createServer({
    routes() {
      this.namespace = "api"; // Prefix all routes with /api

      // Dummy user credentials
      const users = [
        {
          id: "1",
          name: "Chiefman Bernard",
          email: "chiefmanbernard@dasgehirn.com",
          password: "force",
        },
      ];
      // Login Route
      this.post("/user/login", (schema, request) => {
        const { email, password } = JSON.parse(request.requestBody);

        const user = users.find(
          (user) => user.email === email && user.password === password
        );

        if (user) {
          // Simulate a successful login
          return {
            token: "dummy-jwt-token",
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          };
        } else {
          // Simulate failed login
          return new Response(401, {}, { message: "Invalid credentials" });
        }
      });

      // Account Route
      this.get("/user/account", (schema, request) => {
        const token = request.requestHeaders.Authorization;

        // Verify if token is correct (In real scenarios, you'd verify the token)
        if (token === "Bearer dummy-jwt-token") {
          // Send account details
          return {
            id: "1",
            name: "Bernard Arhia",
            email: "chiefmanbernard@dasgehirn.com",
          };
        } else {
          return new Response(401, {}, { message: "Unauthorized" });
        }
      });

      // Example users endpoint
      this.get("/users", () => [
        { id: "1", name: "Luke" },
        { id: "2", name: "Leia" },
        { id: "3", name: "Anakin" },
      ]);
    },
  });
}
