import { NodeData } from './types';

// Zama Yellow Hex: #F5E148
const ZAMA_YELLOW = "#F5E148";
const ZAMA_GREY = "#333333";
const ZAMA_WHITE = "#FFFFFF";
const ZAMA_BLUE = "#4895F5"; 

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
      intro: "The FHE State Operating System is Zama's conceptual framework for developing robust, blockchain-based IT infrastructure engineered for 'Network States'. It reconciles public blockchain transparency with the non-negotiable confidentiality requirements of sovereign governance.",
      sections: [
        {
          heading: "The Core Thesis",
          body: [
            "Public blockchains offer integrity and auditability but lack privacy, making them unsuitable for critical societal functions like identity management and national defense.",
            "The FHE State OS enforces 'Privacy by Default'. It leverages Fully Homomorphic Encryption (FHE) to allow computation on data while it remains encrypted 'in use'.",
            "This enables an end-to-end encrypted Web3 infrastructure where identity, taxation, and governance occur on-chain without ever exposing the underlying plaintext data to validators or the public."
          ]
        },
        {
          heading: "Strategic Valuation",
          body: [
            "Zama has achieved unicorn status (>$1B valuation) with backing from Pantera Capital and Multicoin Capital.",
            "The valuation is predicated on the successful transition from a cryptographic research challenge to a scalable engineering solution via hardware acceleration (ASICs)."
          ]
        }
      ],
      stats: [
        { label: "Valuation", value: "$1 Billion+" },
        { label: "Mainnet", value: "Q4 2025" }
      ]
    }
  },
  {
    id: "cryptography",
    position: [5, 2, 0],
    color: ZAMA_WHITE,
    icon: "Lock",
    shape: "icosahedron",
    content: {
      title: "II. Cryptographic Core",
      subtitle: "TFHE & Lattice-Based Security",
      intro: "Fully Homomorphic Encryption (FHE) sits at the apex of the encryption hierarchy, allowing arbitrary computations on ciphertexts. Zama utilizes the TFHE scheme, optimized for speed and low latency.",
      sections: [
        {
          heading: "The Noise Problem & Bootstrapping",
          body: [
            "In FHE, every operation (addition/multiplication) adds 'cryptographic noise' to the ciphertext. If noise exceeds a threshold, decryption fails.",
            "Zama utilizes TFHE (Torus FHE), which revolutionized the field with 'Fast Bootstrapping'. Bootstrapping is a procedure to refresh the ciphertext and reduce noise, enabling infinite computation depth.",
            "TFHE reduces bootstrapping time to a fraction of a second, making it the only viable scheme for the responsive operations required by a blockchain Virtual Machine."
          ]
        },
        {
          heading: "Quantum Resistance",
          body: [
            "Modern FHE schemes are based on hard mathematical problems in Lattices (LWE - Learning With Errors).",
            "This foundation makes the FHE State OS inherently quantum-resistant, a critical requirement for long-term governmental and financial infrastructure."
          ]
        }
      ]
    }
  },
  {
    id: "architecture",
    position: [-5, 2, 0],
    color: ZAMA_WHITE,
    icon: "Cpu",
    shape: "box",
    content: {
      title: "III. fhEVM Architecture",
      subtitle: "Symbolic Execution & Coprocessors",
      intro: "The fhEVM (Fully Homomorphic Encryption Virtual Machine) allows standard Solidity contracts to execute on encrypted states. It abstracts cryptographic complexity using the 'euint' data type.",
      sections: [
        {
          heading: "The 'euint' Abstraction",
          body: [
            "Developers use standard Solidity toolchains. Privacy is declared via types: `euint8`, `euint16`, `euint32`.",
            "The VM supports encrypted conditional logic (if-else). Since the data is encrypted, the branch taken cannot be known. The VM evaluates both branches and uses a multiplexer (MUX) to select the correct result based on the encrypted boolean condition."
          ]
        },
        {
          heading: "Symbolic Execution Model",
          body: [
            "To prevent FHE operations from stalling the blockchain, the fhEVM uses a symbolic execution model.",
            "The blockchain validator executes the logic symbolically. The heavy cryptographic lifting (bootstrapping, homomorphic multiplications) is offloaded asynchronously to specialized 'Coprocessors'.",
            "This decoupling ensures that the computational overhead of FHE does not choke the block finality schedule."
          ]
        },
        {
          heading: "The Concrete Library",
          body: [
            "Built on Rust, 'Concrete' is the underlying cryptographic library. It provides automatic parameter selection and GPU acceleration bindings.",
            "Concrete ML enables machine learning models to run directly on encrypted data."
          ]
        }
      ]
    }
  },
  {
    id: "scaling",
    position: [-3, -4, 4],
    color: ZAMA_YELLOW,
    icon: "Zap",
    shape: "torus",
    content: {
      title: "V. Scaling Strategy",
      subtitle: "Hardware Acceleration & ZK-Rollups",
      intro: "FHE is computationally intensive. Zama's roadmap shifts from algorithmic improvements to a 'Moore's Law' hardware strategy, augmented by ZK-Rollups for validity.",
      sections: [
        {
          heading: "Hardware Roadmap (The 3 Phases)",
          body: [
            "Phase 1 (Initial Mainnet Q4 2025): Software optimization on existing CPUs/GPUs. Target: 50-100 TPS.",
            "Phase 2 (Mid-Term): FPGA Accelerators. Utilizing reconfigurable hardware to parallelize lattice operations. Target: 500-1,000 TPS.",
            "Phase 3 (Long-Term 2027+): Dedicated ASICs. Custom silicon designed specifically for TFHE bootstrapping. Target: 10,000+ TPS."
          ]
        },
        {
          heading: "The KKRT (Kakarot) Acquisition",
          body: [
            "In Nov 2025, Zama acquired KKRT Labs, a ZK-Rollup specialist.",
            "This creates a Hybrid Architecture: FHE is used for 'Confidentiality' (computing on secret data), while ZK-Proofs are used for 'Scalability' (compressing transactions and proving validity).",
            "This effectively solves the scaling trilemma, allowing the system to verify the correctness of FHE computations without re-executing them on-chain."
          ]
        }
      ],
      stats: [
        { label: "Phase 1 TPS", value: "100" },
        { label: "ASIC TPS", value: "10,000+" }
      ]
    }
  },
  {
    id: "use-cases",
    position: [3, -4, 4],
    color: ZAMA_WHITE,
    icon: "Users",
    shape: "dodecahedron",
    content: {
      title: "IV. Use Cases",
      subtitle: "Identity, Governance & Finance",
      intro: "The FHE State OS enables applications that were previously impossible on public blockchains due to privacy constraints.",
      sections: [
        {
          heading: "Confidential Governance",
          body: [
            "Enables truly secret ballots on-chain. Votes are encrypted with the network's public key.",
            "The smart contract performs homomorphic addition of the encrypted votes. Only the final result is decrypted.",
            "This mathematically prevents coercion and bribery, as individual votes are never revealed."
          ]
        },
        {
          heading: "Confidential DID & Compliance",
          body: [
            "Store encrypted PII (Personal Identifiable Information) on-chain.",
            "Generate attestations (e.g., 'Is Age > 18?') via FHE computation without revealing the birthdate.",
            "Financial institutions can run AML (Anti-Money Laundering) models on encrypted transaction histories."
          ]
        },
        {
          heading: "Blind Auctions & Gaming",
          body: [
            "Sealed-bid auctions where bids remain encrypted until the reveal phase, ensuring fair price discovery.",
            "On-chain poker or strategy games where 'Fog of War' is cryptographically enforced."
          ]
        }
      ]
    }
  },
  {
    id: "competition",
    position: [0, 5, -5],
    color: ZAMA_BLUE,
    icon: "Scale",
    shape: "sphere",
    content: {
      title: "VII. Competitive Landscape",
      subtitle: "FHE vs TEE vs ZKP",
      intro: "Confidential computing approaches differ fundamentally in their trust models. Zama posits FHE as the only zero-trust solution suitable for state infrastructure.",
      sections: [
        {
          heading: "vs. Trusted Execution Environments (TEE)",
          body: [
            "TEEs (Intel SGX, TDX, AMD SEV) rely on a 'Hardware Root of Trust'. You must trust the chip manufacturer.",
            "They are vulnerable to side-channel attacks (e.g., power analysis) and hardware exploits.",
            "FHE is 'Zero-Trust'. Security is mathematical, not physical. Even if the server is malicious, they cannot read the data."
          ]
        },
        {
          heading: "vs. Zero-Knowledge Proofs (ZKP)",
          body: [
            "ZKPs (like Aztec) are excellent for *proving* a statement without revealing data (e.g., 'I have enough funds').",
            "However, ZKPs struggle with *multi-user shared state* computation. They are primarily single-player privacy tools.",
            "FHE allows multiple users to compute on shared encrypted state (e.g., a Uniswap pool where the liquidity curve is encrypted).",
            "Zama's strategy is not FHE *or* ZK, but FHE *and* ZK (Hybrid)."
          ]
        }
      ]
    }
  }
];