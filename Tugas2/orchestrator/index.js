const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const loadProto = (path) => {
  const packageDef = protoLoader.loadSync(path);
  return grpc.loadPackageDefinition(packageDef);
};

const orderProto = loadProto('./proto/order.proto').order;
const paymentProto = loadProto('./proto/payment.proto').payment;
const shippingProto = loadProto('./proto/shipping.proto').shipping;

const orderClient = new orderProto.OrderService('order-service:50051', grpc.credentials.createInsecure());
const paymentClient = new paymentProto.PaymentService('payment-service:50052', grpc.credentials.createInsecure());
const shippingClient = new shippingProto.ShippingService('shipping-service:50053', grpc.credentials.createInsecure());

function runSaga() {
  orderClient.CreateOrder({ product_id: 'A123', quantity: 1 }, (err, orderRes) => {
    if (err || orderRes.status !== 'SUCCESS') return console.error('Order failed');

    console.log('Order created');

    paymentClient.ProcessPayment({ order_id: 'ORD001', amount: 100 }, (err, payRes) => {
      if (err || payRes.status !== 'SUCCESS') {
        console.log('Payment failed. Cancelling order...');
        return orderClient.CancelOrder({ order_id: 'ORD001' }, () => {});
      }

      console.log('Payment success');

      shippingClient.StartShipping({ order_id: 'ORD001' }, (err, shipRes) => {
        if (err || shipRes.status !== 'SUCCESS') {
          console.log('Shipping failed. Compensating...');
          shippingClient.CancelShipping({ order_id: 'ORD001' }, () => {});
          paymentClient.RefundPayment({ order_id: 'ORD001' }, () => {});
          orderClient.CancelOrder({ order_id: 'ORD001' }, () => {});
        } else {
          console.log('Shipping success');
        }
      });
    });
  });
}

runSaga();
