const mongoose = require('mongoose');

const raffleSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Raffle name is required."] },
    ticketPrice: { 
      type: Number, 
      required: [true, "Ticket price is required."], 
      min: [0, "Ticket price must be a positive number."] 
    },
    prizePool: { 
      type: Number, 
      required: [true, "Prize pool is required."], 
      min: [0, "Prize pool must be a positive number."] 
    },
    startDate: { 
      type: Date, 
      required: [true, "Start date is required."],
      validate: {
        validator: function (value) {
          return value < this.endDate;
        },
        message: "Start date must be before the end date.",
      },
    },
    endDate: { type: Date, required: [true, "End date is required."] },
    description: { type: String, required: [true, "Description is required."] },
    image: { 
      type: String, 
      default: "/images/default-placeholder.png" // Default placeholder
    },
    tokenType: { 
      type: String, 
      enum: ["RON", "AXS", "SLP"], 
      // required: [true, "Token type is required."] 
    },
    participantsCount: { 
      type: Number, 
      default: 0
    },
    participantLimit: { 
      type: Number, 
      default: 0
    },
    participants: [{ wallet: String, buyTime: Date }], // List of participants
    isEnded: { type: Boolean, default: false }, // Indicates if the raffle has ended
    winner: { type: String, default: null }, // Wallet address of the winner
    isActive: { type: Boolean, default: true }, // For soft deletion
  },
  { timestamps: true }
);

// Middleware to ensure prizePool is saved with 2 decimal places
raffleSchema.pre('save', function (next) {
  if (this.prizePool !== undefined) {
    this.prizePool = parseFloat(this.prizePool.toFixed(2));
  }
  next();
});

raffleSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  console.log(update);
  next();
});

// Indexes
raffleSchema.index({ name: 1 });
raffleSchema.index({ startDate: 1 });
raffleSchema.index({ endDate: 1 });

module.exports = mongoose.model("Raffle", raffleSchema);
