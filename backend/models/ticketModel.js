const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    raffleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Raffle', required: true },
    wallet: { type: String, required: true },
    buyTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ticketSchema.index({ raffleId: 1, wallet: 1 }, { unique: true }); // Prevent duplicate purchases for the same raffle and wallet

module.exports = mongoose.model('Ticket', ticketSchema);
