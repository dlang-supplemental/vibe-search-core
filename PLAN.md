# Implementation Plan

## Overview

This library aims to port the core logic of CLIP-based image search to native D.

### Current Status

- [x] Initial structure.
- [ ] **Dependency**: Integrate `densor` for inference.
- [ ] **Dependency**: Integrate `vector-store-dlang` for storage.
- [ ] Image Preprocessing (Resize, Normalize, CHW conversion) using `imageformats`.
- [ ] Tokenizer (CLIP tokenizer implementation in Pure D).

### Integration Goals

- **Inference**: Use `densor` to load and run Quantized CLIP models (GGUF).
- **Storage**: Use `vector-store-dlang` to save embeddings to disk.
- [ ] **Orchestration**: Manage threading to keep UI responsive while keeping `densor` fed.

### Token Usage Control

- Large implementations (like full BPE tokenizer code or complex matrix math libraries) should be broken down into smaller commits or referenced via stable external libraries where possible to save context window.
