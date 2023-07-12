// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IOperatorFilterToggle {
    event OperatorRestriction(bool restriction);

    function operatorRestriction() external view returns (bool);

    function setOperatorRestriction(bool restriction) external;
}
