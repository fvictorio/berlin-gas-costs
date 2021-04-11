const hre = require("hardhat")
const { ethers, network} = hre
const assert = require('assert');

async function main() {
  console.log('SLOAD');
  await readSlot();
  await readSlot(true);
  console.log();

  console.log('SLOAD twice');
  await readSlotTwice();
  await readSlotTwice(true);
  console.log();

  console.log('SSTORE from 0 to 1');
  await setSlot(0, 1)
  await setSlot(0, 1, true)
  console.log();

  console.log('SSTORE from 1 to 2');
  await setSlot(1, 2)
  await setSlot(1, 2, true)
  console.log();

  console.log('SSTORE from 1 to 0');
  await setSlot(1, 0)
  await setSlot(1, 0, true)
  console.log();

  console.log('From 0 to 1 and then from 1 to 2');
  await setAndSetSlot(0, 1, 2);
  await setAndSetSlot(0, 1, 2, true);
  console.log();

  console.log('Read and set');
  await readAndSetSlot(1, 2);
  await readAndSetSlot(1, 2, true);
  console.log();

  console.log('Set and read');
  await setAndReadSlot(1, 2);
  await setAndReadSlot(1, 2, true);
  console.log();
}

async function setSlot(from, to, accessList = false) {
  const Test = await ethers.getContractFactory("Test");
  let test = await deploy(Test, from);

  let options = {}
  if (accessList) {
    options.accessList = [{
      address: test.address,
      storageKeys: ["0x0000000000000000000000000000000000000000000000000000000000000000"]
    }]
  }

  let tx = await test.set(to, options);

  let trace = await network.provider.send("debug_traceTransaction", [tx.hash])
  let gasCost = getGasCost(trace, 'SSTORE');
  console.log(`${accessList ? "With access list" : "Without access list"}: ${gasCost}`);
}

async function setAndSetSlot(from, to1, to2, accessList = false) {
  const Test = await ethers.getContractFactory("Test");
  let test = await deploy(Test, from);

  let options = {}
  if (accessList) {
    options.accessList = [{
      address: test.address,
      storageKeys: ["0x0000000000000000000000000000000000000000000000000000000000000000"]
    }]
  }

  let tx = await test.setAndSet(to1, to2, options);

  let trace = await network.provider.send("debug_traceTransaction", [tx.hash])
  let [gasCost1, gasCost2] = getGasCosts(trace, 'SSTORE');
  console.log(`${accessList ? "With access list" : "Without access list"}: first SSTORE ${gasCost1}, second SSTORE ${gasCost2}`);
}

async function readAndSetSlot(from, to, accessList = false) {
  const Test = await ethers.getContractFactory("Test");
  let test = await deploy(Test, from);

  let options = {}
  if (accessList) {
    options.accessList = [{
      address: test.address,
      storageKeys: ["0x0000000000000000000000000000000000000000000000000000000000000000"]
    }]
  }

  let tx = await test.readAndSet(to, options);

  let trace = await network.provider.send("debug_traceTransaction", [tx.hash])
  let readGasCost = getGasCost(trace, 'SLOAD');
  let setGasCost = getGasCost(trace, 'SSTORE');
  console.log(`${accessList ? "With access list" : "Without access list"}: SLOAD ${readGasCost}, SSTORE ${setGasCost}`);
}

async function setAndReadSlot(from, to, accessList = false) {
  const Test = await ethers.getContractFactory("Test");
  let test = await deploy(Test, from);

  let options = {}
  if (accessList) {
    options.accessList = [{
      address: test.address,
      storageKeys: ["0x0000000000000000000000000000000000000000000000000000000000000000"]
    }]
  }

  let tx = await test.setAndRead(to, options);

  let trace = await network.provider.send("debug_traceTransaction", [tx.hash])
  let setGasCost = getGasCost(trace, 'SSTORE');
  let readGasCost = getGasCost(trace, 'SLOAD');
  console.log(`${accessList ? "With access list" : "Without access list"}: SSTORE ${setGasCost}, SLOAD ${readGasCost}`);
}

async function readSlot(accessList = false) {
  const Test = await ethers.getContractFactory("Test");
  let test = await deploy(Test, 0);

  let options = {}
  if (accessList) {
    options.accessList = [{
      address: test.address,
      storageKeys: ["0x0000000000000000000000000000000000000000000000000000000000000000"]
    }]
  }

  let tx = await test.read(options);

  let trace = await network.provider.send("debug_traceTransaction", [tx.hash])
  let gasCost = getGasCost(trace, 'SLOAD');
  console.log(`${accessList ? "With access list" : "Without access list"}: ${gasCost}`);
}

async function readSlotTwice(accessList = false) {
  const Test = await ethers.getContractFactory("Test");
  let test = await deploy(Test, 0);

  let options = {}
  if (accessList) {
    options.accessList = [{
      address: test.address,
      storageKeys: ["0x0000000000000000000000000000000000000000000000000000000000000000"]
    }]
  }

  let tx = await test.readTwice(options);

  let trace = await network.provider.send("debug_traceTransaction", [tx.hash])
  let [gasCost1, gasCost2] = getGasCosts(trace, 'SLOAD');
  console.log(`${accessList ? "With access list" : "Without access list"}: first SLOAD ${gasCost1}, second SSLOAD ${gasCost2}`);
}

function getGasCost(trace, op) {
  const logs = trace.structLogs.filter(log => log.op === op);

  assert(logs.length === 1);

  return logs[0].gasCost
}

function getGasCosts(trace, op) {
  const logs = trace.structLogs.filter(log => log.op === op);

  assert(logs.length === 2);

  return [logs[0].gasCost, logs[1].gasCost]
}

async function deploy(factory, ...args) {
  const contract = await factory.deploy(...args)
  await contract.deployTransaction.wait()

  return contract;
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
