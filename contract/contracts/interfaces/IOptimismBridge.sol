// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

interface IOptimismBridge {
    function bridgeETHTo(
        address _to,
        uint32 _minGasLimit,
        bytes memory _extraData
    ) external payable;
}
