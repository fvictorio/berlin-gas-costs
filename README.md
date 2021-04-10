# Berlin gas costs

This is the companion repo to my article: [Understanding gas costs after Berlin](https://hackmd.io/@0XdFpIk7THuZuOIHC1WpuQ/ryzXaHJI_).

The code kind of sucks. Sorry.

## Installation

Clone this repo and run `npm install`.

## Geth

Before running the script, you should have a [`geth`](https://geth.ethereum.org/) instance running on port 8545. Download geth v1.10.2 (or later)
and run it like this:

```
geth --dev --http --http.port 8545 --http.api eth,debug,web3,net
```

## Running the script

After starting the geth instance, run this in another terminal:

```
npx hardhat run --network localhost
```
