const Raffle = require('../models/raffleModel');

const createRaffle = async (req, res) => {
  try {
    const {
      name,
      ticketPrice,
      prizePool,
      startDate,
      endDate,
      description,
      tokenType,
      participantLimit, // Add participant limit
    } = req.body;

    // Validation
    if (!name || !ticketPrice || !prizePool || !startDate || !endDate || !description || !participantLimit) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (isNaN(participantLimit) || participantLimit < 0) {
      return res.status(400).json({ message: 'Participant limit must be a positive number.' });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'Start date must be before the end date.' });
    }

    // if (!["RON", "AXS", "SLP"].includes(tokenType)) {
    //   return res.status(400).json({ message: 'Invalid token type.' });
    // }

    // Create new raffle
    const raffle = new Raffle({
      name,
      ticketPrice,
      prizePool,
      startDate,
      endDate,
      description,
      image: req.file ? req.file.path : '/images/default-placeholder.png', // Default image
      tokenType,
      participantLimit, // Save participant limit
    });

    const savedRaffle = await raffle.save();
    res.status(201).json({
      message: 'Raffle created successfully.',
      data: savedRaffle,
    });
  } catch (error) {
    console.error('Error creating raffle:', error);
    res.status(500).json({ message: 'Error creating raffle.', error: error.message });
  }
};

module.exports = { createRaffle };
