const createError = require("http-errors");

const User = require("../models/user");
const { destroyIdentity, destroyResidence } = require("../utils/uploader");

const userList = (req, res, next) => {
  try {
    // add query result to response
    res.query = User.find().sort("-createdAt");
    next();
  } catch (err) {
    next(err);
  }
};

const userCreate = async (req, res, next) => {
  try {
    // validated request body
    const result = req.body;

    // check if user already exists
    const doesExist = await User.findOne({ email: result.email });
    if (doesExist) throw createError.Conflict("Email already registered");

    // create new user with already verified email
    const user = new User({ ...result, meta: { isEmailVerified: true } });
    const savedUser = await user.save();

    res.json(savedUser);
  } catch (err) {
    next(err);
  }
};

const userDetail = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id).populate(
      "referrer",
      "email firstName lastName"
    );
    if (!user) return next(createError.NotFound("User not found"));

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const userUpdate = async (req, res, next) => {
  try {
    const id = req.params.id;

    // validated request body
    const result = req.body;

    // update user
    const updatedUser = await User.findByIdAndUpdate(id, result, {
      new: true,
    });
    if (!updatedUser) throw createError.NotFound("User not found");

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

const userDelete = async (req, res, next) => {
  try {
    const id = req.params.id;

    // delete user
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return next(createError.NotFound("User not found"));

    res.json({ message: "User successfully deleted" });
  } catch (err) {
    next(err);
  }
};

const userClearUnverified = async (req, res, next) => {
  try {
    // delete unverified users
    const { deletedCount } = await User.deleteMany({
      "meta.isEmailVerified": false,
    });

    res.json({ message: `${deletedCount} users successfully deleted` });
  } catch (err) {
    next(err);
  }
};

const userWalletCreate = async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = req.body;

    const user = await User.findById(id);
    if (!user) return next(createError.NotFound("User not found"));

    const exists = user.wallets.find(
      (wallet) => wallet.symbol === result.symbol
    );
    if (exists) throw createError.Conflict("Wallet already added");

    user.wallets.unshift(result);
    await user.save();

    const wallet = user.wallets[0];

    res.json(wallet);
  } catch (err) {
    next(err);
  }
};

const userWalletList = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);
    if (!user) return next(createError.NotFound("User not found"));

    const wallets = user.wallets;

    res.json(wallets);
  } catch (err) {
    next(err);
  }
};

const userWalletDetail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const symbol = req.params.symbol.toUpperCase();

    const user = await User.findById(id);
    if (!user) return next(createError.NotFound("User not found"));

    const wallet = user.wallets.find((wallet) => wallet.symbol === symbol);
    if (!wallet) throw createError.NotFound("Wallet not found");

    res.json(wallet);
  } catch (err) {
    next(err);
  }
};

const userWalletDelete = async (req, res, next) => {
  try {
    const id = req.params.id;
    const symbol = req.params.symbol.toUpperCase();

    const user = await User.findById(id);
    if (!user) return next(createError.NotFound("User not found"));

    const deletedWallet = user.wallets.find(
      (wallet) => wallet.symbol === symbol
    );
    if (!deletedWallet)
      return next(createError.NotFound("User Wallet not found"));

    const updatedWallets = user.wallets.filter(
      (wallet) => wallet.symbol !== symbol
    );
    user.wallets = updatedWallets;
    await user.save();

    res.json({ message: "User Wallet successfully deleted" });
  } catch (err) {
    next(err);
  }
};

const userCardDelete = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const id = req.params.cardId;

    const user = await User.findById(userId);
    if (!user) return next(createError.NotFound("User not found"));

    const deletedCard = user.cards.find((card) => card.id === id);
    if (!deletedCard) return next(createError.NotFound("User Card not found"));

    const updatedCards = user.cards.filter((card) => card.id !== id);
    user.cards = updatedCards;
    await user.save();

    res.json({ message: "User Card successfully deleted" });
  } catch (err) {
    next(err);
  }
};

const userBankDelete = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const id = req.params.bankId;

    const user = await User.findById(userId);
    if (!user) return next(createError.NotFound("User not found"));

    const deletedBank = user.banks.find((bank) => bank.id === id);
    if (!deletedBank) return next(createError.NotFound("User Bank not found"));

    const updatedBanks = user.banks.filter((bank) => bank.id !== id);
    user.banks = updatedBanks;
    await user.save();

    res.json({ message: "User Bank successfully deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  userList,
  userCreate,
  userDetail,
  userUpdate,
  userDelete,
  userClearUnverified,
  userWalletCreate,
  userWalletList,
  userWalletDetail,
  userWalletDelete,
  userCardDelete,
  userBankDelete,
};
