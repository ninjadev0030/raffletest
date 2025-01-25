const express = require('express');
const { createRaffle } = require('../controllers/raffleController');
const Raffle = require('../models/raffleModel');
const Ticket = require('../models/ticketModel');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/', upload.single('image'), createRaffle);
router.get('/', async (req, res) => {
  try {
    const raffles = await Raffle.find({ isActive: true });
    res.status(200).json(raffles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching raffles', error });
  }
});

router.get('/all', async (req, res) => {
  try {
    const raffles = await Raffle.find();
    res.status(200).json(raffles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching raffles', error });
  }
});

router.get("/:raffleId/winner", async (req, res) => {
  const { raffleId } = req.params;

  try {
    // Find the raffle by its ID
    const raffle = await Raffle.findById(raffleId);

    if (!raffle) {
      return res.status(404).json({ error: "Raffle not found" });
    }

    if (!raffle.winnerId) {
      return res.status(400).json({ error: "Winner not determined yet" });
    }

    // Respond with the winner details
    res.status(200).json({
      winnerId: raffle.winnerId,
      prize: parseFloat(raffle.prizePool * 0.9).toFixed(2),
    });
  } catch (error) {
    console.error("Error fetching winner details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


  
module.exports = router;
