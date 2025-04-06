const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync('./proto/shipping.proto');
const shippingProto = grpc.loadPackageDefinition(packageDef).shipping;

const shouldFail = false; // ubah ke true untuk testing kompensasi

const server = new grpc.Server();

server.addService(shippingProto.ShippingService.service, {
  StartShipping: (call, callback) => {
    if (shouldFail) {
      console.log("Shipping failed");
      callback(null, { status: 'FAILED' });
    } else {
      console.log("Shipping started");
      callback(null, { status: 'SUCCESS' });
    }
  },
  CancelShipping: (call, callback) => {
    console.log("Shipping canceled");
    callback(null, { status: 'CANCELED' });
  }
});

server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(), () => {
  console.log("Shipping Service running on 50053");
  server.start();
});
