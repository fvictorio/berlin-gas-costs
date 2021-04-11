//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

contract Test {
  uint public x;

  constructor(uint _x) {
    x = _x;
  }

  function set(uint _x) public {
    x = _x;
  }

  function setAndSet(uint x1, uint x2) public {
    x = x1;
    x = x2;
  }

  function read() public returns (uint) {
    uint a = x;
    return a;
  }

  function readTwice() public returns (uint) {
    uint a = x;
    uint b = x;

    return a + b;
  }

  function readAndSet(uint _x) public returns (uint) {
    uint a = x;
    x = _x;
    return a;
  }

  function setAndRead(uint _x) public returns (uint) {
    x = _x;
    uint a = x;
    return a;
  }
}
