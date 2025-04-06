const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync('./proto/order.proto');
const orderProto = grpc.loadPackageDefinition(packageDef).order;

const server = new grpc.Server();

server.addService(orderProto.OrderService.service, {
  CreateOrder: (call, callback) => {
    console.log("Order created");
    callback(null, { status: 'SUCCESS' });
  },
  CancelOrder: (call, callback) => {
    console.log("Order canceled");
    callback(null, { status: 'CANCELED' });
  }
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log("Order Service running on 50051");
  server.start();
});
