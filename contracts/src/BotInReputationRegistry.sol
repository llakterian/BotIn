// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {IBotInReputationRegistry} from "./interfaces/IBotInReputationRegistry.sol";
import {IBotInIdentityRegistry} from "./interfaces/IBotInIdentityRegistry.sol";

uint256 constant DECIMALS = 18;

contract BotInReputationRegistry is IBotInReputationRegistry, OwnableUpgradeable, UUPSUpgradeable {
    address private _identityRegistry;

    mapping(uint256 => mapping(address => mapping(uint64 => Feedback))) private _feedback;
    mapping(uint256 => mapping(address => uint64)) private _lastFeedbackIndex;
    mapping(uint256 => address[]) private _clients;
    mapping(bytes32 => Validation) private _validations;
    mapping(uint256 => bytes32[]) private _agentValidations;
    mapping(address => bytes32[]) private _validatorRequests;

    modifier validAgent(uint256 agentId) {
        require(IBotInIdentityRegistry(_identityRegistry).isActiveAgent(agentId), "Invalid agent");
        _;
    }

    modifier notAgentOwner(uint256 agentId) {
        require(IBotInIdentityRegistry(_identityRegistry).ownerOf(agentId) != msg.sender, "Owner cannot give feedback");
        _;
    }

    function initialize(address identityRegistry_) public initializer {
        require(identityRegistry_ != address(0), "Invalid identity registry");
        __Ownable_init(msg.sender);
        _identityRegistry = identityRegistry_;
    }

    function giveFeedback(
        uint256 agentId,
        int128 value,
        uint8 valueDecimals,
        string calldata tag1,
        string calldata tag2,
        string calldata endpoint,
        string calldata feedbackURI,
        bytes32 feedbackHash
    ) external override validAgent(agentId) notAgentOwner(agentId) {
        require(valueDecimals <= DECIMALS, "Invalid decimals");

        uint64 feedbackIndex = _lastFeedbackIndex[agentId][msg.sender] + 1;
        _lastFeedbackIndex[agentId][msg.sender] = feedbackIndex;

        bool isNewClient = true;
        address[] storage clients = _clients[agentId];
        for (uint256 i = 0; i < clients.length; i++) {
            if (clients[i] == msg.sender) {
                isNewClient = false;
                break;
            }
        }
        if (isNewClient) {
            _clients[agentId].push(msg.sender);
        }

        _feedback[agentId][msg.sender][feedbackIndex] = Feedback({
            clientAddress: msg.sender,
            agentId: agentId,
            value: value,
            valueDecimals: valueDecimals,
            tag1: tag1,
            tag2: tag2,
            endpoint: endpoint,
            feedbackURI: feedbackURI,
            feedbackHash: feedbackHash,
            feedbackIndex: feedbackIndex,
            isRevoked: false,
            timestamp: block.timestamp
        });

        emit NewFeedback(
            agentId,
            msg.sender,
            feedbackIndex,
            value,
            valueDecimals,
            tag1,
            tag1,
            tag2,
            endpoint,
            feedbackURI,
            feedbackHash
        );
    }

    function revokeFeedback(uint256 agentId, uint64 feedbackIndex) external override {
        Feedback storage feedback = _feedback[agentId][msg.sender][feedbackIndex];
        require(feedback.clientAddress == msg.sender, "Not feedback owner");
        require(!feedback.isRevoked, "Already revoked");

        feedback.isRevoked = true;
        emit FeedbackRevoked(agentId, msg.sender, feedbackIndex);
    }

    function appendResponse(
        uint256 agentId,
        address clientAddress,
        uint64 feedbackIndex,
        string calldata responseURI,
        bytes32 responseHash
    ) external override {
        require(_feedback[agentId][clientAddress][feedbackIndex].clientAddress != address(0), "Feedback not found");

        emit ResponseAppended(agentId, clientAddress, feedbackIndex, msg.sender, responseURI, responseHash);
    }

    function validationRequest(
        address validatorAddress,
        uint256 agentId,
        string calldata requestURI,
        bytes32 requestHash
    ) external override validAgent(agentId) {
        require(
            IBotInIdentityRegistry(_identityRegistry).ownerOf(agentId) == msg.sender
                || IBotInIdentityRegistry(_identityRegistry).getAgentWallet(agentId) == msg.sender,
            "Not authorized"
        );

        _agentValidations[agentId].push(requestHash);
        _validatorRequests[validatorAddress].push(requestHash);

        _validations[requestHash] = Validation({
            validator: validatorAddress,
            agentId: agentId,
            requestHash: requestHash,
            response: 0,
            responseURI: "",
            responseHash: bytes32(0),
            tag: "",
            timestamp: block.timestamp
        });

        emit ValidationRequested(validatorAddress, agentId, requestURI, requestHash);
    }

    function validationResponse(
        bytes32 requestHash,
        uint8 response,
        string calldata responseURI,
        bytes32 responseHash,
        string calldata tag
    ) external override {
        Validation storage validation = _validations[requestHash];
        require(validation.validator == msg.sender, "Not validator");
        require(response <= 100, "Invalid response");

        validation.response = response;
        validation.responseURI = responseURI;
        validation.responseHash = responseHash;
        validation.tag = tag;
        validation.timestamp = block.timestamp;

        emit ValidationResponse(
            msg.sender,
            validation.agentId,
            requestHash,
            response,
            responseURI,
            responseHash,
            tag
        );
    }

    function getSummary(
        uint256 agentId,
        address[] calldata clientAddresses,
        string calldata tag1,
        string calldata tag2
    ) external view override returns (uint64 count, int128 summaryValue, uint8 summaryValueDecimals) {
        int256 total = 0;
        uint64 validCount = 0;
        uint8 decimals = 0;

        for (uint256 i = 0; i < clientAddresses.length; i++) {
            uint64 lastIndex = _lastFeedbackIndex[agentId][clientAddresses[i]];
            for (uint64 j = 1; j <= lastIndex; j++) {
                Feedback storage fb = _feedback[agentId][clientAddresses[i]][j];
                if (!fb.isRevoked) {
                    bool tag1Match = bytes(tag1).length == 0 || keccak256(bytes(fb.tag1)) == keccak256(bytes(tag1));
                    bool tag2Match = bytes(tag2).length == 0 || keccak256(bytes(fb.tag2)) == keccak256(bytes(tag2));

                    if (tag1Match && tag2Match) {
                        int256 normalized = int256(fb.value) * int256(10 ** (DECIMALS - fb.valueDecimals));
                        total += normalized;
                        validCount++;
                        if (fb.valueDecimals > decimals) decimals = fb.valueDecimals;
                    }
                }
            }
        }

        if (validCount > 0) {
            summaryValue = int128(total / int256(uint256(validCount)));
            summaryValueDecimals = uint8(DECIMALS);
        }
        count = validCount;
    }

    function readFeedback(uint256 agentId, address clientAddress, uint64 feedbackIndex)
        external
        view
        override
        returns (Feedback memory)
    {
        return _feedback[agentId][clientAddress][feedbackIndex];
    }

    function getValidationStatus(bytes32 requestHash) external view override returns (Validation memory) {
        return _validations[requestHash];
    }

    function getAgentValidations(uint256 agentId) external view override returns (bytes32[] memory) {
        return _agentValidations[agentId];
    }

    function getClients(uint256 agentId) external view returns (address[] memory) {
        return _clients[agentId];
    }

    function getLastIndex(uint256 agentId, address clientAddress) external view returns (uint64) {
        return _lastFeedbackIndex[agentId][clientAddress];
    }

    function IDENTITY_REGISTRY() external view override returns (address) {
        return _identityRegistry;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
