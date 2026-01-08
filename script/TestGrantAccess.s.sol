// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/TranscriptRegistry.sol";

contract TestGrantAccess is Script {
    function run() external {
        // Load environment variables
        address studentAddress = vm.envAddress("TEST_STUDENT_ADDRESS");
        uint256 studentPrivateKey = vm.envUint("TEST_STUDENT_PRIVATE_KEY");
        address registryAddress = vm.envAddress("REGISTRY_ADDRESS_KNUST");
        address verifierAddress = vm.envAddress("TEST_VERIFIER_ADDRESS");
        
        // Use the Record ID from the previous successful registration
        bytes32 recordId = 0xf49acb04f4b936b04fcfd6e981a985ed7f2500c9bfc932cc44dcdd2a0ac134e8;
        
        console.log("==============================================");
        console.log("TESTING ACCESS GRANT ON BLOCKCHAIN");
        console.log("==============================================");
        console.log("Registry:", registryAddress);
        console.log("Student:", studentAddress);
        console.log("Verifier:", verifierAddress);
        console.log("Record ID:", vm.toString(recordId));
        console.log("==============================================");
        
        TranscriptRegistry registry = TranscriptRegistry(registryAddress);
        
        // Start broadcasting transactions as the student
        vm.startBroadcast(studentPrivateKey);
        
        console.log("\nGranting access to verifier...");
        
        // Grant access to the verifier
        registry.grantAccess(recordId, verifierAddress);
        
        vm.stopBroadcast();
        
        console.log("\n==============================================");
        console.log("ACCESS GRANTED SUCCESSFULLY!");
        console.log("==============================================");
        
        // Verify the access was granted
        bool hasAccess = registry.hasAccess(recordId, verifierAddress);
        console.log("\nVerification:");
        console.log("  Verifier has access:", hasAccess);
        console.log("==============================================");
    }
}

contract TestVerifyTranscript is Script {
    function run() external {
        // Load environment variables
        address verifierAddress = vm.envAddress("TEST_VERIFIER_ADDRESS");
        uint256 verifierPrivateKey = vm.envUint("TEST_VERIFIER_PRIVATE_KEY");
        address registryAddress = vm.envAddress("REGISTRY_ADDRESS_KNUST");
        
        // Use the Record ID from the previous successful registration
        bytes32 recordId = 0xf49acb04f4b936b04fcfd6e981a985ed7f2500c9bfc932cc44dcdd2a0ac134e8;
        
        console.log("==============================================");
        console.log("TESTING TRANSCRIPT VERIFICATION");
        console.log("==============================================");
        console.log("Registry:", registryAddress);
        console.log("Verifier:", verifierAddress);
        console.log("Record ID:", vm.toString(recordId));
        console.log("==============================================");
        
        TranscriptRegistry registry = TranscriptRegistry(registryAddress);
        
        // Check if verifier has access
        bool hasAccess = registry.hasAccess(recordId, verifierAddress);
        console.log("\nAccess Check:");
        console.log("  Verifier has access:", hasAccess);
        
        if (!hasAccess) {
            console.log("\nERROR: Verifier does not have access to this record!");
            console.log("Please run TestGrantAccess first.");
            return;
        }
        
        // Start broadcasting transactions as the verifier
        vm.startBroadcast(verifierPrivateKey);
        
        console.log("\nVerifying transcript...");
        
        // Verify the transcript
        registry.verifyTranscript(recordId);
        
        vm.stopBroadcast();
        
        console.log("\n==============================================");
        console.log("TRANSCRIPT VERIFIED SUCCESSFULLY!");
        console.log("==============================================");
        
        // Get the updated record
        (
            bytes32 studentHash,
            string memory metadataCID,
            bytes32 fileHash,
            address issuer,
            uint256 timestamp,
            TranscriptRegistry.RecordStatus status,
            uint256 verificationCount
        ) = registry.getRecord(recordId);
        
        console.log("\nUpdated Record Details:");
        console.log("  Student Hash:", vm.toString(studentHash));
        console.log("  Metadata CID:", metadataCID);
        console.log("  File Hash:", vm.toString(fileHash));
        console.log("  Issuer:", issuer);
        console.log("  Timestamp:", timestamp);
        console.log("  Status:", status == TranscriptRegistry.RecordStatus.Active ? "Active" : status == TranscriptRegistry.RecordStatus.Revoked ? "Revoked" : "Suspended");
        console.log("  Verification Count:", verificationCount);
        console.log("==============================================");
    }
}

contract TestRevokeAccess is Script {
    function run() external {
        // Load environment variables
        address studentAddress = vm.envAddress("TEST_STUDENT_ADDRESS");
        uint256 studentPrivateKey = vm.envUint("TEST_STUDENT_PRIVATE_KEY");
        address registryAddress = vm.envAddress("REGISTRY_ADDRESS_KNUST");
        address verifierAddress = vm.envAddress("TEST_VERIFIER_ADDRESS");
        
        // Use the Record ID from the previous successful registration
        bytes32 recordId = 0xf49acb04f4b936b04fcfd6e981a985ed7f2500c9bfc932cc44dcdd2a0ac134e8;
        
        console.log("==============================================");
        console.log("TESTING ACCESS REVOCATION");
        console.log("==============================================");
        console.log("Registry:", registryAddress);
        console.log("Student:", studentAddress);
        console.log("Verifier:", verifierAddress);
        console.log("Record ID:", vm.toString(recordId));
        console.log("==============================================");
        
        TranscriptRegistry registry = TranscriptRegistry(registryAddress);
        
        // Check current access
        bool hasAccessBefore = registry.hasAccess(recordId, verifierAddress);
        console.log("\nBefore Revocation:");
        console.log("  Verifier has access:", hasAccessBefore);
        
        // Start broadcasting transactions as the student
        vm.startBroadcast(studentPrivateKey);
        
        console.log("\nRevoking access from verifier...");
        
        // Revoke access from the verifier
        registry.revokeAccess(recordId, verifierAddress);
        
        vm.stopBroadcast();
        
        console.log("\n==============================================");
        console.log("ACCESS REVOKED SUCCESSFULLY!");
        console.log("==============================================");
        
        // Verify the access was revoked
        bool hasAccessAfter = registry.hasAccess(recordId, verifierAddress);
        console.log("\nAfter Revocation:");
        console.log("  Verifier has access:", hasAccessAfter);
        console.log("==============================================");
    }
}