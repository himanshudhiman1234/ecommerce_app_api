const stripe = require('stripe')('');


const intiatedPayment = async(req,res)=>{

    stripe.products.create({
      name: 'Starter Subscription',
      description: '$12/Month subscription',
    }).then(product => {
      stripe.prices.create({
        unit_amount: 1200,
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        product: product.id,
      }).then(price => {
        console.log('Success! Here is your starter subscription product id: ' + product.id);
        console.log('Success! Here is your starter subscription price id: ' + price.id);
      });
    });
}



module.exports = { intiatedPayment};
