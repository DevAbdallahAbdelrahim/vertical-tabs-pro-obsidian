# Vertical Tabs Pro for Obsidian

> **Enterprise-grade, context-aware vertical tab management engine designed for extreme performance, flat nested grouping, and Page-Fault memory conservation.**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Obsidian Community Plugin](https://img.shields.io/badge/Obsidian-Plugin-purple.svg)](https://obsidian.md)
[![Rust Validation](https://img.shields.io/badge/Rust-Validated-orange.svg)](<>)

---

## 🚀 Overview

**Vertical Tabs Pro** is a high-performance, standalone Obsidian plugin built to solve UI freezes and excessive memory consumption when navigating large vaults with hundreds of open tabs.

By replacing traditional DOM tree lookups with an optimized memory layout and lazy element instantiation, Vertical Tabs Pro delivers buttery-smooth 60 FPS workspace navigation regardless of vault complexity.

---

## ⚡ Key Architectural Innovations

### 🌲 Flat Arena Tree Architecture

Unlike standard tree-traversal algorithms that suffer from memory fragmentation and DOM layout thrashing, Vertical Tabs Pro utilizes a custom **Flat Arena Tree structure**.

- Guarantees $O(1)$ node lookup and manipulation operations.
- Prevents Chromium render thread locks even under severe stress tests.

### 🧠 Page-Fault Hibernation Engine

Large vaults with multiple active CodeMirror 6 viewports quickly exhaust system RAM.

- Automatically unloads inactive CodeMirror 6 editor instances and heavy DOM elements based on configurable inactivity thresholds.
- Retains light visual tab states while freeing gigabytes of memory.

### 📁 Smart Shallow & Nested Grouping

- Dynamically categorizes active workspace tabs by physical directory hierarchy or nested tags.
- Employs lightweight, hardware-accelerated CSS rendering for multi-level visual indentation.

### ⌨️ Keyboard-First & Instant Search

- Integrated zero-latency fuzzy search engine.
- Navigate, group, hibernate, or filter open tabs instantly using configurable hotkeys.

### 🛡️ Cross-Platform Certified

Automated test suite validating cross-platform compatibility across **Linux**, **macOS**, and **Windows**.

---

## 🛠️ Building from Source

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **Rust Toolchain**: Required for native validation tools

### Build Steps

```bash
# Clone the repository
git clone [https://github.com/DevAbdallahAbdelrahim/vertical-tabs-pro-obsidian.git](https://github.com/DevAbdallahAbdelrahim/vertical-tabs-pro-obsidian.git)
cd vertical-tabs-pro-obsidian

# Install dependencies
npm ci

# Build production bundle & run Rust validator
make build
```
