.PHONY: all build dev test clean

all: build

# Development watching build
dev:
	node esbuild.config.mjs

# Production single-bundle build & Rust validation
build:
	node esbuild.config.mjs production
	cargo run --manifest-path rust-builder/Cargo.toml

# Strict TypeCheck
test:
	npx tsc --noEmit

# Clean build artifacts
clean:
	rm -f main.js
	cargo clean --manifest-path rust-builder/Cargo.toml
