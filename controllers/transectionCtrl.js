const transectionModel = require("../models/transectionModel");
const moment = require("moment");
const getAllTransection = async (req, res) => {
  try {
    const { frequency, selectedDate, type } = req.body;
    const transections = await transectionModel.find({
      ...(frequency !== "custom"
        ? {
            date: {
              $gt: moment().subtract(Number(frequency), "d").toDate(),
            },
          }
        : {
            date: {
              $gte: selectedDate[0],
              $lte: selectedDate[1],
            },
          }),
      userid: req.body.userid,
      ...(type !== "all" && { type }),
    });
    res.status(200).json(transections);
  } catch (error) {
    console.log(error);
    res.status(500).json(erorr);
  }
};

const deleteTransection = async (req, res) => {
  try {
    await transectionModel.findOneAndDelete({ _id: req.body.transacationId });
    res.status(200).send("Transaction Deleted!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const editTransection = async (req, res) => {
  try {
    await transectionModel.findOneAndUpdate(
      { _id: req.body.transacationId },
      req.body.payload
    );
    res.status(200).send("Edit SUccessfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const addTransection = async (req, res) => {
  try {
    // Clean the amount field
    const cleanedAmount = req.body.amount.replace(/,/g, '');

    // Convert the cleaned amount to a number
    const amount = parseFloat(cleanedAmount);

    // Create a new transaction with the cleaned and converted amount
    const newTransection = new transectionModel({
      ...req.body,
      amount: amount,
    });

    // Save the new transaction
    await newTransection.save();

    // Send a success response
    res.status(201).send("Transaction Created");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};


module.exports = {
  getAllTransection,
  addTransection,
  editTransection,
  deleteTransection,
};
