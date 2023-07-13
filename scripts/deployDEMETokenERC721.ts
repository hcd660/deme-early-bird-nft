import hre, { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {BytesLike} from "@ethersproject/bytes";

async function main() {
  const [caller]: SignerWithAddress[] = await ethers.getSigners();

  console.log("\nCaller address: ", caller.address);
  console.log("\n");

  const contractName = "PoPP Explorer";
  const symbol = "POPE";
  const contractUri = "https://test.v1.api.poppclub.cn/im/deid/pass/contract/uri/PoPP-Explorer";
  const baseUri = "https://test.v1.api.poppclub.cn/im/deid/pass/token/uri/PoPP-Explorer/";
  const gasPriceDeme = "15";//polygon=150 eth=10 goerli=3
  const gasPriceUnit = "gwei";//polygon=150 eth=10 goerli=3

  // const minter = await ethers
  //     .getContractFactory("Minter")
  //     .then(f => f.deploy( ));
  // console.log(
  //     "Deploying Minter \ntransaction: ",
  //     minter.deployTransaction.hash,
  //     "\naddress: ",
  //     minter.address,
  //     "\n"
  // );

  const minterAddress = "0xe62f9743AE3240D1faD22A41c10023C9c0Cab10B";

  const demeTokenERC721 = await ethers
      .getContractFactory("DEMETokenERC721")
      .then(f => f.deploy(
          caller.address
          , contractName
          , symbol
          , contractUri
          , baseUri, {gasPrice: ethers.utils.parseUnits(gasPriceDeme, gasPriceUnit), gasLimit: 5200000}));
  console.log(
      "Deploying DEMETokenERC721 \ntransaction: ",
      demeTokenERC721.deployTransaction.hash,
      "\naddress: ",
      demeTokenERC721.address,
      "\n"
  );


  const mintRole: BytesLike = await demeTokenERC721.MINTER_ROLE();
  const grantRole = await demeTokenERC721.connect(caller)
      .grantRole(mintRole, minterAddress, {gasPrice: ethers.utils.parseUnits(gasPriceDeme, gasPriceUnit), gasLimit: 200000});
  console.log(
      "grantRole MINTER_ROLE \ntransaction: ",
      grantRole.hash,
  );

}

async function verify(address: string, args: any[]) {
  try {
    return await hre.run("verify:verify", {
      address: address,
      constructorArguments: args,
    });
  } catch (e) {
    console.log(address, args, e);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// npx hardhat run scripts/deployDEMETokenERC721.ts --network goerli
// npx hardhat run scripts/deployDEMETokenERC721.ts --network mainnet

