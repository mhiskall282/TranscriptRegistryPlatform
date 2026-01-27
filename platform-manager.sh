#!/bin/bash

################################################################################
# TRANSCRIPT REGISTRY PLATFORM MANAGEMENT SCRIPT
# Beacon Proxy Pattern - Gas Optimized
################################################################################

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

# Environment file
ENV_FILE="$PROJECT_ROOT/.env"



################################################################################
# UTILITY FUNCTIONS
################################################################################

print_header() {
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  ${PURPLE}$1${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Load environment variables
# load_env() {
#     if [ -f "$ENV_FILE" ]; then
#         export $(cat "$ENV_FILE" | grep -v '^#' | xargs)
#         print_success "Environment loaded from .env"
#     else
#         print_warning ".env file not found. Some features may not work."
#     fi
# }

load_env() {
  if [ -f "$ENV_FILE" ]; then
    set -a
    source "$ENV_FILE"
    set +a

    # after .env is loaded, set a unified RPC_URL
    RPC_URL="${BASE_SEPOLIA_RPC_URL:-${SEPOLIA_RPC_URL:-}}"
    export RPC_URL

    print_success "Environment loaded from .env"
    print_info "RPC_URL=$RPC_URL"
  else
    print_warning ".env file not found. Some features may not work."
  fi
}

################################################################################
RPC_URL="${BASE_SEPOLIA_RPC_URL:-$SEPOLIA_RPC_URL}"
export RPC_URL
# PRIVATE_KEY="${PRIVATE_KEY:-}"
# export PRIVATE_KEY
# REGISTRAR_PRIVATE_KEY="${REGISTRAR_PRIVATE_KEY:-}"
# export REGISTRAR_PRIVATE_KEY
# STUDENT_PRIVATE_KEY="${STUDENT_PRIVATE_KEY:-}"
# export STUDENT_PRIVATE_KEY
# VERIFIER_PRIVATE_KEY="${VERIFIER_PRIVATE_KEY:-}"
# export VERIFIER_PRIVATE_KEY
# FACTORY_ADDRESS="${FACTORY_ADDRESS:-}"
# export FACTORY_ADDRESS
# REGISTRY_ADDRESS="${REGISTRY_ADDRESS:-}"
# export REGISTRY_ADDRESS

# Check if required tools are installed
check_dependencies() {
    local missing_deps=()
    
    if ! command -v forge &> /dev/null; then
        missing_deps+=("foundry (forge)")
    fi
    
    if ! command -v cast &> /dev/null; then
        missing_deps+=("foundry (cast)")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        exit 1
    fi
}

################################################################################
# DEPLOYMENT FUNCTIONS
################################################################################

deploy_beacon_system() {
    print_header "DEPLOYING BEACON PROXY SYSTEM"
    
    print_info "This will deploy:"
    echo "  1. TranscriptRegistryUpgradeable (Implementation)"
    echo "  2. UpgradeableBeacon"
    echo "  3. UniversityFactoryBeacon (Factory)"
    echo ""
    
    read -p "Continue with deployment? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        print_warning "Deployment cancelled"
        return
    fi
    
    print_info "Deploying Beacon System..."
    
    forge script script/DeployBeacon.s.sol:DeployBeaconSystem \
        --rpc-url "$BASE_SEPOLIA_RPC_URL" \
        --broadcast \
        --verify \
        -vvvv
    
    print_success "Beacon System deployed successfully!"
    print_warning "Don't forget to save FACTORY_ADDRESS to .env"
}

deploy_university_proxies() {
    print_header "DEPLOYING UNIVERSITY PROXIES"
    
    if [ -z "$FACTORY_ADDRESS" ]; then
        print_error "FACTORY_ADDRESS not set in .env"
        return 1
    fi
    
    print_info "Factory Address: $FACTORY_ADDRESS"
    print_info "This will deploy 3 test university proxies"
    echo ""
    
    read -p "Continue? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        print_warning "Deployment cancelled"
        return
    fi
    
    forge script script/DeployBeacon.s.sol:DeployTestUniversitiesBeacon \
        --rpc-url "$BASE_SEPOLIA_RPC_URL" \
        --broadcast \
        -vvvv
    
    print_success "University proxies deployed!"
}

upgrade_implementation() {
    print_header "UPGRADING IMPLEMENTATION"
    
    if [ -z "$FACTORY_ADDRESS" ]; then
        print_error "FACTORY_ADDRESS not set in .env"
        return 1
    fi
    
    print_warning "This will upgrade ALL university proxies to a new implementation!"
    print_info "Factory Address: $FACTORY_ADDRESS"
    echo ""
    
    read -p "Are you sure? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        print_warning "Upgrade cancelled"
        return
    fi
    
    forge script script/DeployBeacon.s.sol:UpgradeImplementation \
        --rpc-url "$BASE_SEPOLIA_RPC_URL" \
        --broadcast \
        -vvvv
    
    print_success "Implementation upgraded successfully!"
}

################################################################################
# FACTORY MANAGEMENT FUNCTIONS
################################################################################

get_platform_stats() {
    print_header "PLATFORM STATISTICS"
    
    if [ -z "$FACTORY_ADDRESS" ]; then
        print_error "FACTORY_ADDRESS not set"
        return 1
    fi
    
    print_info "Fetching platform stats..."
    
    # Get total universities
    total=$(cast call "$FACTORY_ADDRESS" \
        "universityCount()(uint256)" \
        --rpc-url "$RPC_URL")
    
    # Get platform stats (returns tuple)
    stats=$(cast call "$FACTORY_ADDRESS" \
        "getPlatformStats()(uint256,uint256)" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL")
    
    # Parse the tuple
    total_unis=$(echo "$stats" | awk '{print $1}')
    active_unis=$(echo "$stats" | awk '{print $2}')
    
    echo ""
    echo -e "${GREEN}Total Universities:${NC} $total_unis"
    echo -e "${GREEN}Active Universities:${NC} $active_unis"
    echo -e "${YELLOW}Inactive Universities:${NC} $((total_unis - active_unis))"
    
    # Get implementation address
    impl=$(cast call "$FACTORY_ADDRESS" \
        "getImplementation()(address)" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL")
    
    echo -e "${BLUE}Current Implementation:${NC} $impl"
}

list_active_universities() {
    print_header "ACTIVE UNIVERSITIES"
    
    if [ -z "$FACTORY_ADDRESS" ]; then
        print_error "FACTORY_ADDRESS not set"
        return 1
    fi
    
    # Get offset and limit from arguments or use defaults
    offset=${1:-0}
    limit=${2:-10}
    
    print_info "Fetching universities (offset: $offset, limit: $limit)..."
    
    # Get active university IDs
    active_ids=$(cast call "$FACTORY_ADDRESS" \
        "getActiveUniversities(uint256,uint256)(uint256[])" \
        "$offset" "$limit" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL")
    
    echo ""
    echo -e "${GREEN}Active University IDs:${NC}"
    echo "$active_ids"
}

get_university_info() {
    print_header "UNIVERSITY INFORMATION"
    
    if [ -z "$FACTORY_ADDRESS" ]; then
        print_error "FACTORY_ADDRESS not set"
        return 1
    fi
    
    read -p "Enter University ID: " uni_id
    
    print_info "Fetching university info..."
    
    # Get university info (returns struct)
    info=$(cast call "$FACTORY_ADDRESS" \
        "getUniversity(uint256)((string,address,address,uint256,bool))" \
        "$uni_id" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL")
    
    echo ""
    echo -e "${CYAN}University Details:${NC}"
    echo "$info"
    
    # Get the proxy address from the struct
    proxy_addr=$(echo "$info" | grep -oP '0x[a-fA-F0-9]{40}' | head -1)
    
    if [ -n "$proxy_addr" ]; then
        echo ""
        print_info "Fetching registry details..."
        
        # Get registry details
        uni_name=$(cast call "$proxy_addr" \
            "universityName()(string)" \
            --rpc-url "$BASE_SEPOLIA_RPC_URL")
        
        registrar=$(cast call "$proxy_addr" \
            "registrar()(address)" \
            --rpc-url "$BASE_SEPOLIA_RPC_URL")
        
        is_active=$(cast call "$proxy_addr" \
            "isActive()(bool)" \
            --rpc-url "$BASE_SEPOLIA_RPC_URL")
        
        transcript_count=$(cast call "$proxy_addr" \
            "transcriptCount()(uint256)" \
            --rpc-url "$BASE_SEPOLIA_RPC_URL")
        
        version=$(cast call "$proxy_addr" \
            "version()(string)" \
            --rpc-url "$BASE_SEPOLIA_RPC_URL")
        
        echo ""
        echo -e "${GREEN}University Name:${NC} $uni_name"
        echo -e "${GREEN}Proxy Address:${NC} $proxy_addr"
        echo -e "${GREEN}Registrar:${NC} $registrar"
        echo -e "${GREEN}Active:${NC} $is_active"
        echo -e "${GREEN}Transcripts Issued:${NC} $transcript_count"
        echo -e "${GREEN}Implementation Version:${NC} $version"
    fi
}

deploy_new_university() {
    print_header "DEPLOY NEW UNIVERSITY"
    
    if [ -z "$FACTORY_ADDRESS" ]; then
        print_error "FACTORY_ADDRESS not set"
        return 1
    fi
    
    read -p "Enter University Name: " uni_name
    read -p "Enter Registrar Address: " registrar_addr
    
    print_info "Deploying university: $uni_name"
    print_info "Registrar: $registrar_addr"
    echo ""
    
    read -p "Continue? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        print_warning "Deployment cancelled"
        return
    fi
    
    # Deploy university proxy
    cast send "$FACTORY_ADDRESS" \
        "deployUniversityProxy(string,address)(uint256,address)" \
        "$uni_name" "$registrar_addr" \
        --private-key "$PRIVATE_KEY" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL"
    
    print_success "University deployed successfully!"
}

deactivate_university() {
    print_header "DEACTIVATE UNIVERSITY"
    
    if [ -z "$FACTORY_ADDRESS" ]; then
        print_error "FACTORY_ADDRESS not set"
        return 1
    fi
    
    read -p "Enter University ID: " uni_id
    read -p "Enter Reason for Deactivation: " reason
    
    print_warning "This will deactivate university ID: $uni_id"
    echo ""
    
    read -p "Are you sure? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        print_warning "Deactivation cancelled"
        return
    fi
    
    # Deactivate university in factory
    cast send "$FACTORY_ADDRESS" \
        "deactivateUniversity(uint256,string)" \
        "$uni_id" "$reason" \
        --private-key "$PRIVATE_KEY" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL"
    
    print_success "University deactivated in factory!"
    
    # Get proxy address to deactivate contract
    info=$(cast call "$FACTORY_ADDRESS" \
        "getUniversity(uint256)((string,address,address,uint256,bool))" \
        "$uni_id" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL")
    
    proxy_addr=$(echo "$info" | grep -oP '0x[a-fA-F0-9]{40}' | head -1)
    
    if [ -n "$proxy_addr" ]; then
        print_info "Deactivating registry contract..."
        
        cast send "$proxy_addr" \
            "deactivateContract()" \
            --private-key "$PRIVATE_KEY" \
            --rpc-url "$BASE_SEPOLIA_RPC_URL"
        
        print_success "Registry contract deactivated!"
    fi
}

reactivate_university() {
    print_header "REACTIVATE UNIVERSITY"
    
    if [ -z "$FACTORY_ADDRESS" ]; then
        print_error "FACTORY_ADDRESS not set"
        return 1
    fi
    
    read -p "Enter University ID: " uni_id
    
    print_info "This will reactivate university ID: $uni_id"
    echo ""
    
    read -p "Continue? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        print_warning "Reactivation cancelled"
        return
    fi
    
    # Reactivate university in factory
    cast send "$FACTORY_ADDRESS" \
        "reactivateUniversity(uint256)" \
        "$uni_id" \
        --private-key "$PRIVATE_KEY" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL"
    
    print_success "University reactivated in factory!"
    
    # Get proxy address to reactivate contract
    info=$(cast call "$FACTORY_ADDRESS" \
        "getUniversity(uint256)((string,address,address,uint256,bool))" \
        "$uni_id" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL")
    
    proxy_addr=$(echo "$info" | grep -oP '0x[a-fA-F0-9]{40}' | head -1)
    
    if [ -n "$proxy_addr" ]; then
        print_info "Reactivating registry contract..."
        
        cast send "$proxy_addr" \
            "activateContract()" \
            --private-key "$PRIVATE_KEY" \
            --rpc-url "$BASE_SEPOLIA_RPC_URL"
        
        print_success "Registry contract reactivated!"
    fi
}

################################################################################
# TRANSCRIPT REGISTRY FUNCTIONS
################################################################################

register_transcript() {
    print_header "REGISTER TRANSCRIPT"
    
    read -p "Enter Registry Address: " registry_addr
    read -p "Enter Student Address (for hash): " student_addr
    read -p "Enter IPFS Metadata CID: " metadata_cid
    read -p "Enter File Content (for hash): " file_content
    
    # Generate student hash
    student_hash=$(cast keccak "$(cast abi-encode "f(address)" "$student_addr")")
    
    # Generate file hash
    file_hash=$(cast keccak "$file_content")
    
    print_info "Student Hash: $student_hash"
    print_info "File Hash: $file_hash"
    print_info "Metadata CID: $metadata_cid"
    echo ""
    
    read -p "Continue with registration? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        print_warning "Registration cancelled"
        return
    fi
    
    # Register transcript (requires REGISTRAR_PRIVATE_KEY)
    if [ -z "$REGISTRAR_PRIVATE_KEY" ]; then
        print_error "REGISTRAR_PRIVATE_KEY not set"
        return 1
    fi
    
    cast send "$registry_addr" \
        "registerTranscript(bytes32,string,bytes32)(bytes32)" \
        "$student_hash" "$metadata_cid" "$file_hash" \
        --private-key "$REGISTRAR_PRIVATE_KEY" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL"
    
    print_success "Transcript registered successfully!"
}

get_transcript() {
    print_header "GET TRANSCRIPT"
    
    read -p "Enter Registry Address: " registry_addr
    read -p "Enter Record ID: " record_id
    
    print_info "Fetching transcript..."
    
    # Get transcript details
    transcript=$(cast call "$registry_addr" \
        "getTranscript(bytes32)(bytes32,string,bytes32,address,uint256,uint8)" \
        "$record_id" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL")
    
    echo ""
    echo -e "${CYAN}Transcript Details:${NC}"
    echo "$transcript"
}

grant_access() {
    print_header "GRANT ACCESS TO VERIFIER"
    
    read -p "Enter Registry Address: " registry_addr
    read -p "Enter Record ID: " record_id
    read -p "Enter Verifier Address: " verifier_addr
    read -p "Enter Duration (in seconds, max 31536000 for 365 days): " duration
    
    print_info "Granting access..."
    print_info "Record ID: $record_id"
    print_info "Verifier: $verifier_addr"
    print_info "Duration: $duration seconds"
    echo ""
    
    read -p "Continue? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        print_warning "Access grant cancelled"
        return
    fi
    
    # Grant access (requires STUDENT_PRIVATE_KEY)
    if [ -z "$STUDENT_PRIVATE_KEY" ]; then
        print_error "STUDENT_PRIVATE_KEY not set"
        print_info "Set the private key of the student who owns the transcript"
        return 1
    fi
    
    cast send "$registry_addr" \
        "grantAccess(bytes32,address,uint256)" \
        "$record_id" "$verifier_addr" "$duration" \
        --private-key "$STUDENT_PRIVATE_KEY" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL"
    
    print_success "Access granted successfully!"
}

revoke_access() {
    print_header "REVOKE ACCESS FROM VERIFIER"
    
    read -p "Enter Registry Address: " registry_addr
    read -p "Enter Record ID: " record_id
    read -p "Enter Verifier Address: " verifier_addr
    
    print_warning "Revoking access..."
    echo ""
    
    read -p "Continue? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        print_warning "Revocation cancelled"
        return
    fi
    
    # Revoke access
    if [ -z "$STUDENT_PRIVATE_KEY" ]; then
        print_error "STUDENT_PRIVATE_KEY not set"
        return 1
    fi
    
    cast send "$registry_addr" \
        "revokeAccess(bytes32,address)" \
        "$record_id" "$verifier_addr" \
        --private-key "$STUDENT_PRIVATE_KEY" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL"
    
    print_success "Access revoked successfully!"
}

check_access() {
    print_header "CHECK VERIFIER ACCESS"
    
    read -p "Enter Registry Address: " registry_addr
    read -p "Enter Record ID: " record_id
    read -p "Enter Verifier Address: " verifier_addr
    
    print_info "Checking access..."
    
    has_access=$(cast call "$registry_addr" \
        "checkAccess(bytes32,address)(bool)" \
        "$record_id" "$verifier_addr" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL")
    
    echo ""
    if [ "$has_access" == "true" ]; then
        print_success "Verifier has active access"
    else
        print_error "Verifier does NOT have access (denied or expired)"
    fi
}

verify_transcript() {
    print_header "VERIFY TRANSCRIPT"
    
    read -p "Enter Registry Address: " registry_addr
    read -p "Enter Record ID: " record_id
    read -p "Enter File Content (to verify hash): " file_content
    
    # Generate file hash
    file_hash=$(cast keccak "$file_content")
    
    print_info "File Hash: $file_hash"
    echo ""
    
    # Verify transcript (requires VERIFIER_PRIVATE_KEY)
    if [ -z "$VERIFIER_PRIVATE_KEY" ]; then
        print_error "VERIFIER_PRIVATE_KEY not set"
        return 1
    fi
    
    is_valid=$(cast send "$registry_addr" \
        "verifyTranscript(bytes32,bytes32)(bool)" \
        "$record_id" "$file_hash" \
        --private-key "$VERIFIER_PRIVATE_KEY" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL")
    
    if [ "$is_valid" == "true" ]; then
        print_success "Transcript is VALID!"
    else
        print_error "Transcript is INVALID!"
    fi
}

get_student_transcripts() {
    print_header "GET STUDENT TRANSCRIPTS"
    
    read -p "Enter Registry Address: " registry_addr
    read -p "Enter Student Address: " student_addr
    
    # Generate student hash
    student_hash=$(cast keccak "$(cast abi-encode "f(address)" "$student_addr")")
    
    print_info "Student Hash: $student_hash"
    print_info "Fetching transcripts..."
    
    transcripts=$(cast call "$registry_addr" \
        "getStudentTranscripts(bytes32)(bytes32[])" \
        "$student_hash" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL")
    
    echo ""
    echo -e "${GREEN}Student Transcript IDs:${NC}"
    echo "$transcripts"
}

update_transcript_status() {
    print_header "UPDATE TRANSCRIPT STATUS"
    
    read -p "Enter Registry Address: " registry_addr
    read -p "Enter Record ID: " record_id
    echo ""
    echo "Status Options:"
    echo "  0 = Active"
    echo "  1 = Revoked"
    echo "  2 = Amended"
    echo ""
    read -p "Enter New Status (0-2): " new_status
    read -p "Enter Reason: " reason
    
    print_info "Updating transcript status..."
    echo ""
    
    read -p "Continue? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        print_warning "Update cancelled"
        return
    fi
    
    # Update status (requires REGISTRAR_PRIVATE_KEY)
    if [ -z "$REGISTRAR_PRIVATE_KEY" ]; then
        print_error "REGISTRAR_PRIVATE_KEY not set"
        return 1
    fi
    
    cast send "$registry_addr" \
        "updateTranscriptStatus(bytes32,uint8,string)" \
        "$record_id" "$new_status" "$reason" \
        --private-key "$REGISTRAR_PRIVATE_KEY" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL"
    
    print_success "Transcript status updated!"
}

update_registrar() {
    print_header "UPDATE REGISTRAR"
    
    read -p "Enter Registry Address: " registry_addr
    read -p "Enter New Registrar Address: " new_registrar
    
    print_warning "This will change the registrar address!"
    echo ""
    
    read -p "Continue? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        print_warning "Update cancelled"
        return
    fi
    
    # Update registrar (requires ADMIN/PRIVATE_KEY)
    cast send "$registry_addr" \
        "updateRegistrar(address)" \
        "$new_registrar" \
        --private-key "$PRIVATE_KEY" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL"
    
    print_success "Registrar updated successfully!"
}

get_registry_stats() {
    print_header "REGISTRY STATISTICS"
    
    read -p "Enter Registry Address: " registry_addr
    
    print_info "Fetching registry stats..."
    
    # Get contract stats
    stats=$(cast call "$registry_addr" \
        "getContractStats()(uint256,uint256,bool)" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL")
    
    # Parse stats
    transcript_count=$(echo "$stats" | awk '{print $1}')
    verification_count=$(echo "$stats" | awk '{print $2}')
    is_active=$(echo "$stats" | awk '{print $3}')
    
    echo ""
    echo -e "${GREEN}Total Transcripts:${NC} $transcript_count"
    echo -e "${GREEN}Total Verifications:${NC} $verification_count"
    echo -e "${GREEN}Contract Active:${NC} $is_active"
    
    # Get additional info
    uni_name=$(cast call "$registry_addr" \
        "universityName()(string)" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL")
    
    registrar=$(cast call "$registry_addr" \
        "registrar()(address)" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL")
    
    admin=$(cast call "$registry_addr" \
        "admin()(address)" \
        --rpc-url "$BASE_SEPOLIA_RPC_URL")
    
    echo -e "${BLUE}University Name:${NC} $uni_name"
    echo -e "${BLUE}Registrar:${NC} $registrar"
    echo -e "${BLUE}Admin:${NC} $admin"
}

################################################################################
# TESTING FUNCTIONS
################################################################################

run_tests() {
    print_header "RUNNING TESTS"
    
    print_info "Running all test suites..."
    
    forge test -vvv
    
    print_success "Tests completed!"
}

run_specific_test() {
    print_header "RUN SPECIFIC TEST"
    
    echo "Test Contracts:"
    echo "  1. TranscriptRegistry.t.sol"
    echo "  2. TranscriptUpgradeable.t.sol"
    echo "  3. UniversityFactory.t.sol"
    echo "  4. UniversityFactoryBeacon.t.sol"
    echo ""
    
    read -p "Enter test number (1-4): " test_num
    
    case $test_num in
        1)
            forge test --match-contract TranscriptRegistryTest -vvv
            ;;
        2)
            forge test --match-contract TranscriptRegistryUpgradeableTest -vvv
            ;;
        3)
            forge test --match-contract UniversityFactoryTest -vvv
            ;;
        4)
            forge test --match-contract UniversityFactoryBeaconTest -vvv
            ;;
        *)
            print_error "Invalid test number"
            ;;
    esac
}

################################################################################
# UTILITY FUNCTIONS
################################################################################

generate_student_hash() {
    print_header "GENERATE STUDENT HASH"
    
    read -p "Enter Student Address: " student_addr
    
    student_hash=$(cast keccak "$(cast abi-encode "f(address)" "$student_addr")")
    
    echo ""
    print_success "Student Hash: $student_hash"
    echo ""
    print_info "Use this hash when registering transcripts"
}

generate_file_hash() {
    print_header "GENERATE FILE HASH"
    
    read -p "Enter File Content (or path): " file_input
    
    if [ -f "$file_input" ]; then
        # If it's a file, read and hash content
        file_hash=$(cast keccak "$(cat "$file_input")")
        print_info "Hashing file: $file_input"
    else
        # Hash the input as string
        file_hash=$(cast keccak "$file_input")
        print_info "Hashing string input"
    fi
    
    echo ""
    print_success "File Hash: $file_hash"
    echo ""
    print_info "Use this hash when registering transcripts"
}

check_balance() {
    print_header "CHECK WALLET BALANCE"
    
    read -p "Enter Address (or press Enter for deployer): " addr
    
    if [ -z "$addr" ]; then
        addr=$(cast wallet address --private-key "$PRIVATE_KEY")
        print_info "Using deployer address: $addr"
    fi
    
    balance=$(cast balance "$addr" --rpc-url "$RPC_URL")
    balance_eth=$(cast to-unit "$balance" ether)
    
    echo ""
    print_success "Balance: $balance_eth ETH"
}

export_abi() {
    print_header "EXPORT CONTRACT ABIs"
    
    print_info "Exporting ABIs..."
    
    mkdir -p abis
    
    # Export UniversityFactoryBeacon ABI
    forge inspect UniversityFactoryBeacon abi > abis/UniversityFactoryBeacon.json
    print_success "Exported UniversityFactoryBeacon.json"
    
    # Export TranscriptRegistryUpgradeable ABI
    forge inspect TranscriptRegistryUpgradeable abi > abis/TranscriptRegistryUpgradeable.json
    print_success "Exported TranscriptRegistryUpgradeable.json"
    
    # Export UniversityFactory ABI (for reference)
    forge inspect UniversityFactory abi > abis/UniversityFactory.json
    print_success "Exported UniversityFactory.json"
    
    # Export TranscriptRegistry ABI (for reference)
    forge inspect TranscriptRegistry abi > abis/TranscriptRegistry.json
    print_success "Exported TranscriptRegistry.json"
    
    echo ""
    print_success "ABIs exported to ./abis directory"
}

################################################################################
# MAIN MENU
################################################################################

show_menu() {
    clear
    echo -e "${PURPLE}"
    cat << "EOF"
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║   ████████╗██████╗  █████╗ ███╗   ██╗███████╗ ██████╗██████╗ ██╗██████╗████████╗  ║
║   ╚══██╔══╝██╔══██╗██╔══██╗████╗  ██║██╔════╝██╔════╝██╔══██╗██║██╔══██╔══██╔══╝  ║
║      ██║   ██████╔╝███████║██╔██╗ ██║███████╗██║     ██████╔╝██║██████╔╝  ██║     ║
║      ██║   ██╔══██╗██╔══██║██║╚██╗██║╚════██║██║     ██╔══██╗██║██╔═══╝   ██║     ║
║      ██║   ██║  ██║██║  ██║██║ ╚████║███████║╚██████╗██║  ██║██║██║       ██║     ║
║      ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝       ╚═╝     ║
║                                                                      ║
║              REGISTRY PLATFORM MANAGEMENT - BEACON PROXY             ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    echo -e "${CYAN}═══════════════════ DEPLOYMENT ═══════════════════${NC}"
    echo -e "  ${GREEN}1${NC})  Deploy Beacon System (Implementation + Beacon + Factory)"
    echo -e "  ${GREEN}2${NC})  Deploy University Proxies (Test Universities)"
    echo -e "  ${GREEN}3${NC})  Upgrade Implementation (All Proxies)"
    
    echo ""
    echo -e "${CYAN}═══════════════════ FACTORY MANAGEMENT ═══════════════════${NC}"
    echo -e "  ${GREEN}4${NC})  Get Platform Statistics"
    echo -e "  ${GREEN}5${NC})  List Active Universities"
    echo -e "  ${GREEN}6${NC})  Get University Info"
    echo -e "  ${GREEN}7${NC})  Deploy New University"
    echo -e "  ${GREEN}8${NC})  Deactivate University"
    echo -e "  ${GREEN}9${NC})  Reactivate University"
    
    echo ""
    echo -e "${CYAN}═══════════════════ TRANSCRIPT MANAGEMENT ═══════════════════${NC}"
    echo -e "  ${GREEN}10${NC}) Register Transcript"
    echo -e "  ${GREEN}11${NC}) Get Transcript"
    echo -e "  ${GREEN}12${NC}) Grant Access to Verifier"
    echo -e "  ${GREEN}13${NC}) Revoke Access from Verifier"
    echo -e "  ${GREEN}14${NC}) Check Verifier Access"
    echo -e "  ${GREEN}15${NC}) Verify Transcript"
    echo -e "  ${GREEN}16${NC}) Get Student Transcripts"
    echo -e "  ${GREEN}17${NC}) Update Transcript Status"
    echo -e "  ${GREEN}18${NC}) Update Registrar"
    echo -e "  ${GREEN}19${NC}) Get Registry Statistics"
    
    echo ""
    echo -e "${CYAN}═══════════════════ TESTING & UTILITIES ═══════════════════${NC}"
    echo -e "  ${GREEN}20${NC}) Run All Tests"
    echo -e "  ${GREEN}21${NC}) Run Specific Test"
    echo -e "  ${GREEN}22${NC}) Generate Student Hash"
    echo -e "  ${GREEN}23${NC}) Generate File Hash"
    echo -e "  ${GREEN}24${NC}) Check Wallet Balance"
    echo -e "  ${GREEN}25${NC}) Export Contract ABIs"
    
    echo ""
    echo -e "${RED}  0${NC})  Exit"
    echo ""
}

main() {
    # Load environment
    load_env
    
    # Check dependencies
    check_dependencies
    
    while true; do
        show_menu
        read -p "Enter your choice: " choice
        echo ""
        
        case $choice in
            1) deploy_beacon_system ;;
            2) deploy_university_proxies ;;
            3) upgrade_implementation ;;
            4) get_platform_stats ;;
            5) list_active_universities ;;
            6) get_university_info ;;
            7) deploy_new_university ;;
            8) deactivate_university ;;
            9) reactivate_university ;;
            10) register_transcript ;;
            11) get_transcript ;;
            12) grant_access ;;
            13) revoke_access ;;
            14) check_access ;;
            15) verify_transcript ;;
            16) get_student_transcripts ;;
            17) update_transcript_status ;;
            18) update_registrar ;;
            19) get_registry_stats ;;
            20) run_tests ;;
            21) run_specific_test ;;
            22) generate_student_hash ;;
            23) generate_file_hash ;;
            24) check_balance ;;
            25) export_abi ;;
            0)
                print_info "Exiting..."
                exit 0
                ;;
            *)
                print_error "Invalid choice. Please try again."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main