import Wallet from '../models/Wallet.js';

const getOrCreateWallet = async (userId) => {
  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    wallet = await Wallet.create({ user: userId, balance: 0, transactions: [] });
  }
  return wallet;
};

export const getWallet = async (req, res) => {
  try {
    const wallet = await getOrCreateWallet(req.user._id);
    res.json({ success: true, data: wallet });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const requestPayout = async (req, res) => {
  try {
    const { amount } = req.body;
    const wallet = await getOrCreateWallet(req.user._id);
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }
    if (wallet.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }
    wallet.balance -= amount;
    wallet.transactions.push({
      type: 'payout',
      amount,
      description: 'Payout request',
      status: 'pending',
    });
    await wallet.save();
    res.json({ success: true, message: 'Payout requested', data: wallet });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
