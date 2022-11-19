import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import "./App.css";
import { ABI, WHITELIST_CONTRACT_ADDRESS } from "./constant";

const GOERLI_CHAIN_ID = 5;

/* @ts-ignore */
const provider = new ethers.providers.Web3Provider(window.ethereum);
const getProvider = async () => {
  const { chainId } = await provider.getNetwork();
  if (chainId !== GOERLI_CHAIN_ID) {
    window.alert("Change the network to Goerli");
    throw new Error("Change network to Goerli");
  }
  return provider;
};

const getSigner = async () => {
  return (await getProvider()).getSigner();
};

function App() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [whiteListedAddressCount, setWhiteListedAddressCount] = useState(0);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);

  const addAddressToWhitelist = async () => {
    try {
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getSigner();
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        ABI,
        signer
      );
      // call the addAddressToWhitelist from the contract
      const tx = await whitelistContract.addAddressToWhiteList();
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      // get the updated number of addresses in the whitelist
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProvider();
      const whiteListContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        ABI,
        provider
      );

      const _whitelistedAdressesCount =
        await whiteListContract.whitelistedAdressesCount();
      setWhiteListedAddressCount(_whitelistedAdressesCount);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getSigner();
      const whiteListContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        ABI,
        signer
      );
      const signerAddress = await signer.getAddress();
      const _joinedWhiteList = await whiteListContract.whitelistedAdresses(
        signerAddress
      );

      setJoinedWhitelist(_joinedWhiteList);
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      await getSigner();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      connectWallet();
    }
  }, [walletConnected]);

  useEffect(() => {
    window.ethereum.on("accountsChanged", connectWallet);
  }, []);

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return <div>Thanks for joining the Whitelist!</div>;
      } else if (loading) {
        return <button>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist}>Join the Whitelist</button>
        );
      }
    } else {
      return <button onClick={connectWallet}>Connect your wallet</button>;
    }
  };

  return (
    <div>
      <h1>Welcome to Crypto Devs!</h1>
      <div>Its an NFT collection for developers in Crypto.</div>
      <div>{whiteListedAddressCount} have already joined the Whitelist</div>
      {renderButton()}
    </div>
  );
}

export default App;
