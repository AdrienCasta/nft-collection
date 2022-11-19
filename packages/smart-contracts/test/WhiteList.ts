import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("WhiteList", function () {
  async function deployWhiteListOf3AddressesFixture() {
    const [owner, ...otherAccounts] = await ethers.getSigners();

    const WhiteList = await ethers.getContractFactory("WhiteList");
    const whiteList = await WhiteList.deploy(3);

    return { whiteList, owner, otherAccounts };
  }

  describe("Deployment", function () {
    it("Should set the right maxWhitelistedAdresses", async function () {
      const { whiteList } = await loadFixture(
        deployWhiteListOf3AddressesFixture
      );

      expect(await whiteList.maxWhitelistedAdresses()).to.equal(3);
    });
  });

  describe("addAddressToWhiteList", function () {
    it("Should add address to white list", async function () {
      const { whiteList, otherAccounts } = await loadFixture(
        deployWhiteListOf3AddressesFixture
      );
      await whiteList.connect(otherAccounts[0]).addAddressToWhiteList();

      expect(await whiteList.whitelistedAdresses(otherAccounts[0].address)).to
        .be.true;

      expect(await whiteList.whitelistedAdressesCount()).to.equal(1);
    });
    it("Should revert if address is already whitelisted", async function () {
      const { whiteList, otherAccounts } = await loadFixture(
        deployWhiteListOf3AddressesFixture
      );
      await whiteList.connect(otherAccounts[0]).addAddressToWhiteList();
      await expect(
        whiteList.connect(otherAccounts[0]).addAddressToWhiteList()
      ).to.be.revertedWith("Address has already been white listed");
    });
    it("Should revert if address is already whitelisted", async function () {
      const { whiteList, otherAccounts } = await loadFixture(
        deployWhiteListOf3AddressesFixture
      );
      await whiteList.connect(otherAccounts[0]).addAddressToWhiteList();
      await whiteList.connect(otherAccounts[1]).addAddressToWhiteList();
      await whiteList.connect(otherAccounts[2]).addAddressToWhiteList();
      await expect(
        whiteList.connect(otherAccounts[3]).addAddressToWhiteList()
      ).to.be.revertedWith("More addresses cant be added, limit reached");
    });
  });
});
