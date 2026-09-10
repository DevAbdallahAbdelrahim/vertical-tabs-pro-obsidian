# Vertical Tabs Pro for Obsidian

Enterprise-grade, context-aware vertical tab management plugin designed for extreme performance, flat nested grouping, and Page-Fault hibernation memory saving.

## Key Features
- **Smart Shallow & Nested Grouping:** Automatically categorizes open tabs by folder structures or nested tags with dynamic CSS indentation.
- **Page-Fault Hibernation Engine:** Releases CodeMirror 6 editor instances from RAM after custom inactivity thresholds without closing tab representations.
- **Flat Arena Tree Architecture:** $O(1)$ node manipulations preventing Chromium UI freezes even under massive stress tests.
- **Keyboard-First & Instant Search:** Zero-latency fuzzy filtering across open tabs.
- **Cross-Platform Certified:** Tested automatically on Linux, macOS, and Windows.

## Building from Source
Requires Node.js 18+ and Rust Toolchain:

```bash
# Install dependencies
npm ci

# Build production bundle & run Rust validator
make build
