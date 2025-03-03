const { ethers } = require("hardhat");

async function main() {
  const LoteriaPrognosticos = await ethers.getContractFactory("LoteriaPrognosticos");
  const loteria = await LoteriaPrognosticos.deploy();

  await loteria.deployed();
  console.log("Contrato LoteriaPrognosticos implantado em:", loteria.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
