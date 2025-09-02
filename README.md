<!--
SPDX-FileCopyrightText: 2025 XWiki CryptPad Team <contact@cryptpad.org> and Iulian-Tudor Scutaru

SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Post-Quantum Cryptography Benchmark

A browser-based tool for measuring and comparing performance characteristics of post-quantum cryptographic algorithms.

## Overview

This project provides a benchmarking environment for testing various post-quantum cryptographic implementations against each other. It allows developers and researchers to evaluate performance metrics across key generation, encryption/signing, and decryption/verification operations for multiple algorithm families.

## Features

- **Multi-Algorithm Support**: Benchmarks several post-quantum algorithm implementations
- **Customizable Testing**: Configure iteration counts per algorithm
- **Interactive Visualization**: Generate charts for visual performance comparison
- **Exportable Results**: Download benchmark data as JSON for further analysis
- **Client-Side Processing**: All benchmarks run directly in the browser environment

## Cryptography Implementations

### Kyber (ML-KEM)
- NIST's selected standard for key encapsulation
- Lattice-based security with configurable parameters
- Measures key generation, encapsulation, and decapsulation

### ML-Dilithium (ML-DSA)
- NIST's selected standard for digital signatures
- Three security levels: ML-DSA44, ML-DSA65, and ML-DSA87
- Measures key generation, signing, and verification

### Falcon
- Lattice-based signature scheme with efficient verification
- Generates relatively small signatures
- Measures key generation, signing, opening, and verification operations

### Crystals Dilithium
- Implementation of the CRYSTALS-Dilithium signature algorithm
- Measures key generation, signing, and verification 
- Supports both attached and detached signatures

### SPHINCS+
- Stateless hash-based signature scheme
- Conservative design based purely on hash function security
- Measures key generation, signing, and verification operations

## Libraries & Dependencies

This project uses the following libraries:

### Cryptographic Libraries
- **@noble/post-quantum** - JavaScript implementations of NIST PQC standards
  - ML-KEM (Kyber) key encapsulation
  - ML-DSA (Dilithium) signatures
  - SPHINCS+ signatures
- **falcon-crypto** (v1.0.6) - Pure JavaScript implementation of the Falcon signature algorithm
- **dilithium-crystals** (v1.0.6) - JavaScript implementation of CRYSTALS-Dilithium signatures

### Visualization & UI
- **Chart.js** (v4.4.9) - JavaScript charting library for generating interactive visualizations
  - Used components: LinearScale, CategoryScale, BarController, BarElement, Legend, Tooltip

### Utilities
- **@noble/post-quantum/utils** - Helper utilities for conversion and randomization
  - utf8ToBytes - Text encoding
  - randomBytes - Secure random number generation

All libraries are loaded via ESM imports from CDN sources, eliminating the need for local dependencies or build processes.

## Architecture

The system is built around these core components:

- **Benchmarking Engine**: Core measurement infrastructure
- **Crypto Module Wrappers**: Standard interfaces to various cryptographic implementations
- **Chart Generation**: Data visualization for benchmark results
- **UI Controller**: Manages the user interface and test configuration

## Usage

### Running Benchmarks

1. Select algorithms to benchmark by checking their respective boxes
2. Set iteration counts for each selected algorithm
3. Click "Start Benchmark" to begin the testing process
4. After completion, view the visual results in the generated charts
5. Optionally download the raw results as JSON for further analysis

### Configuration Options

Each algorithm can be configured with:
- **Iterations**: Higher values provide more accurate results but increase benchmark duration
- **Algorithm Selection**: Enable/disable specific algorithms to focus testing

## Performance Considerations

When running benchmarks:

1. Browser performance may significantly impact results
2. Higher iteration counts provide more statistically significant results
3. Consider your device capabilities when setting iteration values
4. For consistent results, close other resource-intensive applications
5. Run benchmarks multiple times to account for variability

## Implementation Details

### Measurement Methodology

For each cryptographic operation:
1. Time measurement begins (using Performance API)
2. Operation is executed the configured number of times
3. Time measurement ends
4. Average time and total operations per second are calculated

### Modular Design

The tool uses ES modules to provide:
- Isolated testing environments for each algorithm
- Standard measurement interfaces
- Easy addition of new algorithms
- Consistent data visualization

## Development

### Adding New Algorithms

To implement a new algorithm benchmark:

1. Create a new module in `scripts/benchmarks/`
2. Import the cryptographic library (preferably as an ES module)
3. Implement the benchmark function with standard measurement wrappers
4. Update the UI to include the new algorithm option

## Technical Stack

- **Pure JavaScript**: Core benchmarking functionality
- **Chart.js**: Visualization of benchmark results
- **ES Modules**: Clean organization of benchmark implementations
- **Performance API**: Precise timing measurements
- **Web Crypto API**: Used by some underlying algorithms

## License

This project is for educational and research purposes.
