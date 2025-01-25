const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticketModel');
const Raffle = require('../models/raffleModel');

router.post('/save-ticket', async (req, res) => {
  try {
    const { raffleId, wallet, buyTime } = req.body;
  
    if (!raffleId || !wallet) {
      return res.status(400).json({ message: 'Raffle ID and wallet address are required.' });
    }
  
    // Validate raffle existence
    const raffle = await Raffle.findById(raffleId);
    if (!raffle) {
      return res.status(404).json({ message: 'Raffle not found.' });
    }
  
    // Check if the raffle has ended
    if (new Date(raffle.endDate) <= new Date()) {
      return res.status(400).json({ message: 'The raffle has already ended. Tickets cannot be purchased.' });
    }

    const alreadyParticipated = raffle.participants.some((p) => p.wallet === wallet);
    if (alreadyParticipated) {
      return res.status(400).json({ message: 'You have already purchased a ticket for this raffle.' });
    }
  
    // Save ticket
    const ticket = new Ticket({
      raffleId,
      wallet,
      buyTime,
    });
  
    await ticket.save();
    const newPrizePool = parseFloat((raffle.prizePool + raffle.ticketPrice).toFixed(2));
    // Update raffle: increment participant count and prize pool
    await Raffle.findByIdAndUpdate(
      raffleId,
      {
        $inc: { participantsCount: 1 },
        $set: { prizePool: newPrizePool },
        $push: { participants: { wallet, buyTime } },
      },
      { new: true } // Return the updated raffle document
    );
  
    res.status(201).json({ message: 'Ticket saved successfully.', ticket });
  } catch (error) {
    console.error('Error saving ticket:', error);
  
    // Handle duplicate key error (already purchased)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already purchased a ticket for this raffle.' });
    }
  
    res.status(500).json({ message: 'Failed to save ticket.', error: error.message });
  }
});

router.get('/check-ticket', async (req, res) => {
  try {
    const { raffleId, wallet } = req.query;

    if (!raffleId || !wallet) {
      return res.status(400).json({ message: 'Raffle ID and wallet address are required.' });
    }

    const ticket = await Ticket.findOne({ raffleId, wallet });
    const hasBought = !!ticket;

    res.status(200).json({ hasBought });
  } catch (error) {
    console.error('Error checking ticket:', error);
    res.status(500).json({ message: 'Failed to check ticket.', error: error.message });
  }
});

router.get("/time", (req, res) => {
  const serverTime = new Date();
  res.json({ serverTime });
});


module.exports = router;
