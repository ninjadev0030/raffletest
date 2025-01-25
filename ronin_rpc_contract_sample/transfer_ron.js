const { ethers } = require("ethers");

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
  console.log(
    "Balance after sending RON:",
    ethers.utils.formatEther(balance),
    "RON",
  );
}

// Call the sendRON function with the necessary parameters


sendRON(privateKey, toAddress, amount);