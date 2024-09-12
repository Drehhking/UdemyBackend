// services/flutterwaveService.js
const axios = require('axios');

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;

const verifyTransaction = async (tx_ref) => {
  try {
    const response = await axios.get(`https://api.flutterwave.com/v3/transactions/${tx_ref}/verify`, {
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error verifying transaction:', error);
    throw new Error('Could not verify transaction');
  }
};

module.exports = { verifyTransaction };
