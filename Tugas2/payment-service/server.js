const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync('./proto/payment.proto');
const paymentProto = grpc.loadPackageDefinition(packageDef).payment;

const server = new grpc.Server();

server.addService(paymentProto.PaymentService.service, {
  ProcessPayment: (call, callback) => {
    console.log("Payment processed");
    callback(null, { status: 'SUCCESS' });
  },
  RefundPayment: (call, callback) => {
    console.log("Payment refunded");
    callback(null, { status: 'REFUNDED' });
  }
});

server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
  console.log("Payment Service running on 50052");
  server.start();
});
