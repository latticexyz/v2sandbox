import { Wallet } from "ethers";

export const getBurnerWallet = () => {
  const urlKey = new URLSearchParams(window.location.search).get("privateKey");
  if (urlKey) return new Wallet(urlKey).privateKey;

  // Migrate old burnerWallet key
  const oldBurnerWallet = localStorage.getItem("burnerWallet");
  if (oldBurnerWallet) localStorage.setItem("mud:burnerWallet", oldBurnerWallet);

  const privateKey = localStorage.getItem("mud:burnerWallet");
  if (privateKey) return privateKey;

  const burnerWallet = Wallet.createRandom();
  localStorage.setItem("mud:burnerWallet", burnerWallet.privateKey);
  return burnerWallet.privateKey;
};
