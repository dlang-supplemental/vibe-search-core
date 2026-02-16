= Implementation Plan

== Overview
This library aims to port the core logic of CLIP-based image search to native D.

=== Current Status
- [x] Initial structure.
- [ ] ONNX Runtime bindings setup.
- [ ] Image Preprocessing (Resize, Normalize, CHW conversion).
- [ ] Tokenizer (CLIP tokenizer implementation in D or binding).
- [ ] Vector Store (Simple flat index).

=== Future Reimplementation Goals
- **Tokenizer**: Instead of using Python bindings or C++, implement Byte-Pair Encoding (BPE) tokenizer in pure D.
- **Image Operations**: Optimize resize/crop operations using `mir-algorithm` or `intel-intrinsics`.
- **Inference**: Continue using ONNX Runtime (industry standard), but wrap it in a clean, high-level D API.

=== Token Usage Control
- Large implementations (like full BPE tokenizer code or complex matrix math libraries) should be broken down into smaller commits or referenced via stable external libraries where possible to save context window.
