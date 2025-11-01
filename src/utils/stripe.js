const config = require("../config/config");
const stripe = require("stripe")(config.stripe.private_key);
const createSub = async (product) => {
  const stripeInit = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: product.title },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: product.quantity,
      },
    ],
    mode: "payment",
    success_url: `${config.base_url}/api/v1/transaction/payment/success`,
    cancel_url: `${config.base_url}/api/v1/transaction/payment/failure`,
    // metadata: { serviceId },
  });

  return stripeInit;
};

module.exports = {
  createSub,
};
