import { createServer, Model, Response } from "miragejs";

export default function () {
  createServer({
    models: {
      users: Model,
      todos: Model,
    },

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
            user,
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

      this.get("/todos", (schema) => {
        return schema.todos.all();
      });

      // Add a new todo
      this.post("/todos", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const newTodo = {
          id: Date.now().toString(),
          ...attrs,
        };
        return schema.todos.create(newTodo);
      });

      // Update an existing todo
      this.put("/todos/:id", (schema, request) => {
        let todo = schema.todos.find(request.params.id);
        let attrs = JSON.parse(request.requestBody);
        todo.update({
          text: attrs.text,
          isCompleted: attrs.isCompleted,
        });
      });

      // Delete a todo
      this.delete("/todos/:id", (schema, request) => {
        let todo = schema.todos.find(request.params.id);
        todo.destroy();
      });

      // Get a single todo's details
      this.get("/todos/:id", (schema, request) => {
        const id = request.params.id;
        const todo = schema.todos.find((todo) => todo.id === id);

        if (!todo) {
          return new Response(404, {}, { message: "Todo not found" });
        }

        return todo;
      });
    },
  });
}
