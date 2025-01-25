const express = require('express');
const { createRaffle } = require('../controllers/raffleController');
const Raffle = require('../models/raffleModel');
const Ticket = require('../models/ticketModel');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/', upload.single('image'), createRaffle);
router.get('/', async (req, res) => {
    try {
      const raffles = await Raffle.find();
      res.status(200).json(raffles);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching raffles', error });
    }
  });

  
module.exports = router;
