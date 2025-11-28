import { NodeData } from './types';

// Zama Yellow Hex: #F5E148
const ZAMA_YELLOW = "#F5E148";
const ZAMA_GREY = "#333333";
const ZAMA_WHITE = "#FFFFFF";

export const APP_DATA: NodeData[] = [
  {
    id: "executive-summary",
    position: [0, 0, 0], // Center
    color: ZAMA_YELLOW,
    icon: "Shield",
    shape: "octahedron",
    content: {
      title: "I. The FHE State OS",
      subtitle: "The Confidentiality Paradigm Shift",
      body: [
        "The FHE State Operating System is Zama's framework for blockchain-based IT infrastructure specifically engineered for 'Network States'.",
        "It reconciles the transparency of public blockchains with the non-negotiable confidentiality requirements of governments (identity, taxation, governance).",
        "Core Mission: Establish privacy by default using Fully Homomorphic Encryption (FHE) to allow computation on encrypted data while it remains 'in use'."
      ],
      stats: [
        { label: "Valuation", value: "$1 Billion+" },
        { label: "Goal", value: "Privacy by Default" }
      ]
    }
  },
  {
    id: "cryptography",
    position: [4, 1, 2],
    color: ZAMA_WHITE,
    icon: "Lock",
    shape: "sphere",
    content: {
      title: "II. Cryptographic Foundation",
      subtitle: "Fully Homomorphic Encryption (FHE)",
      body: [
        "FHE allows arbitrary computations (addition/multiplication) directly on encrypted data without ever decrypting it.",
        "Based on lattice cryptography, making it quantum-resistant.",
        "Zama utilizes TFHE (Torus FHE) which allows for fast bootstrapping—refreshing ciphertexts to reduce noise and enable unlimited computation depth.",
        "Comparison: Unlike TEEs (hardware trust) or ZKPs (proof of knowledge), FHE allows complex processing of secret data."
      ]
    }
  },
  {
    id: "architecture",
    position: [-4, 1, 2],
    color: ZAMA_WHITE,
    icon: "Cpu",
    shape: "box",
    content: {
      title: "III. Architecture: fhEVM",
      subtitle: "The FHE Virtual Machine",
      body: [
        "fhEVM is Zama's flagship technology, an extension of the Ethereum Virtual Machine.",
        "It allows Solidity smart contracts to execute on encrypted inputs using the 'euint' data type.",
        "Developers can build confidential dApps using standard tools (Hardhat, Remix) without deep cryptographic knowledge.",
        "Key Feature: Encrypted conditionals. Contracts can execute if-else logic on secret data without revealing the condition."
      ]
    }
  },
  {
    id: "scaling",
    position: [-3, -2, 5],
    color: ZAMA_YELLOW,
    icon: "Zap",
    shape: "torus",
    content: {
      title: "V. & VI. Scaling Strategy",
      subtitle: "Hardware & ZK-Rollups (KKRT)",
      body: [
        "Problem: FHE is computationally expensive. Early estimates suggested millions of GPUs for LLMs.",
        "Solution 1: Hardware Acceleration. CPU/GPU optimization (Phase 1), FPGAs (Phase 2), and Custom ASICs (Phase 3) for 10,000+ TPS.",
        "Solution 2: Hybrid Architecture. Acquired KKRT Labs (Kakarot) to integrate ZK-Rollups.",
        "The Hybrid Approach: Use FHE for confidential computation and ZK-proofs for validity and scalability."
      ],
      stats: [
        { label: "Initial TPS", value: "50-100" },
        { label: "Target TPS", value: "10,000+" }
      ]
    }
  },
  {
    id: "use-cases",
    position: [3, -2, 5],
    color: ZAMA_WHITE,
    icon: "Users",
    shape: "box",
    content: {
      title: "IV. Use Cases",
      subtitle: "Governance & Enterprise",
      body: [
        "Confidential Governance: Secret ballots for DAOs preventing coercion and bribery.",
        "Confidential Identity (DID): Store encrypted personal data and generate attestations (e.g., age > 18) without revealing PII.",
        "Finance: Confidential ERC-20 transfers (hidden balances) and blind auctions.",
        "Enterprise AI: Run risk models or healthcare analysis on encrypted datasets without exposing the raw data."
      ]
    }
  }
];