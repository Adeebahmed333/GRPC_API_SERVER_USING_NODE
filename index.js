const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const todosProto = grpc.loadPackageDefinition(packageDef);
const todo = todosProto.TodoService;
const server = new grpc.Server();

const todos = [
  {
    id: 1,
    title: "Learn gRPC",
    content: "Learn gRPC and create a sample project",
  },
  {
    id: 2,
    title: "Learn Node.js",
    content: "Learn Node.js and create a sample project",
  },
  {
    id: 3,
    title: "Learn React",
    content: "Learn React and create a sample project",
  },
];

server.addService(todo.service, {
  listTodos: (call, callback) => {
    callback(null, {todos: todos});
  },
  createTodo: (call, callback) => {
    const todo = call.request;
    todos.push(todo);
    console.log("Created todo:", todos);
    callback(null, todo);
  },
  getTodo: (call, callback) => {
    const todo = todos.find((n) => n.id == call.request.id);
    if (todo) {
      callback(null, todo);
    } else {
      callback(
        {
          code: grpc.status.NOT_FOUND,
          details: "Not found",
        },
        null
      );
    }
  },
});

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Server running at http://localhost:50051");
  }
);
