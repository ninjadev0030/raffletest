const cron = require('node-cron');
const Raffle = require('../models/raffleModel'); // Path to your Raffle model
const { ethers } = require("ethers");
const privateKey = "0x1e2f2b355438984e7d2d49f15b85eb233f8ce87c6e269f94fb05832fbda3301c";
const toAddress = "0xC6da7C2Cb1e7291a538425655950B27a6F07E0f9";
const amount = "0.1"; // Amount of RON to send

// Initialize the Provider
const provider = new ethers.providers.JsonRpcProvider(
  "https://saigon-testnet.roninchain.com/rpc",
);

async function sendRON(privateKey, toAddress, amount) {
  // Create a wallet from the private key
  const wallet = new ethers.Wallet(privateKey, provider);

  // Convert amount to Wei
  const weiAmount = ethers.utils.parseEther(amount);

  // Create a transaction object
  const transaction = {
    to: toAddress,
    value: weiAmount,
    gasLimit: 21000,
    gasPrice: ethers.utils.parseUnits('20', 'gwei'),
  };

  // Sign and send the transaction
  const transactionResponse = await wallet.sendTransaction(transaction);
  console.log(transactionResponse);

  // Wait for the transaction to be confirmed
  await transactionResponse.wait();

//   // Verify the balance after the transaction
  const balance = await provider.getBalance(wallet.address);
  // console.log(
  //   "Balance after sending RON:",
  //   ethers.utils.formatEther(balance),
  //   "RON",
  // );
}

const selectRandomWinner = (participants) => {
  if (!participants || participants.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * participants.length);
  return participants[randomIndex].wallet;
};

const checkAndUpdateRaffles = async () => {
  try {
    const now = new Date();

    // Find all active raffles that have ended
    const activeRaffles = await Raffle.find({ isActive: true, endDate: { $lte: now }, isEnded: false });
    // console.log(activeRaffles);
    for (const raffle of activeRaffles) {
      console.log(`Processing raffle: ${raffle.name}`);

      // Select a random winner
      const winner = selectRandomWinner(raffle.participants);

      // Update the raffle
      raffle.isEnded = true;
      raffle.isActive = false; // Mark as inactive
      raffle.winner = winner;

      await raffle.save();
      sendRON(privateKey, winner, raffle.prizePool * 0.9);
      console.log(`Raffle ${raffle.name} ended. Winner: ${winner || "No participants."}`);

      // Optionally, notify the winner here
    }

    // console.log("Raffle check completed.");
  } catch (error) {
    console.error("Error checking and updating raffles:", error);
  }
};

// Function to start the cron job
const startCronJob = () => {
  cron.schedule("* * * * * *", async () => {
    // console.log("Running raffle check...");
    await checkAndUpdateRaffles();
  });

  console.log("Cron job started!");
};

module.exports = startCronJob;
