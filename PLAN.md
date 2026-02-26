= Implementation Plan

== Overview
This library aims to port the core logic of CLIP-based image search to native D.

=== Current Status
- [x] Initial structure.
- [ ] **Dependency**: Integrate `dgml` for inference.
- [ ] **Dependency**: Integrate `d-vector-search` for storage.
- [ ] Image Preprocessing (Resize, Normalize, CHW conversion) using `imageformats`.
- [ ] Tokenizer (CLIP tokenizer implementation in Pure D).

=== Integration Goals
- **Inference**: Use `dgml` to load and run Quantized CLIP models (GGUF).
- **Storage**: Use `d-vector-search` to save embeddings to disk.
- **Orchestration**: Manage threading to keep UI responsive while keeping `dgml` fed.

=== Token Usage Control
- Large implementations (like full BPE tokenizer code or complex matrix math libraries) should be broken down into smaller commits or referenced via stable external libraries where possible to save context window.
