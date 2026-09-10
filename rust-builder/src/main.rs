use std::fs;
use std::path::Path;
use std::process::exit;

fn main() {
    println!("─── Running Rust Build Orchestrator & Sanity Checker ───");

    let main_js = Path::new("main.js");
    let manifest = Path::new("manifest.json");

    if !main_js.exists() {
        eprintln!("[ERROR] Output bundle 'main.js' missing!");
        exit(1);
    }

    if !manifest.exists() {
        eprintln!("[ERROR] File 'manifest.json' missing!");
        exit(1);
    }

    let metadata = fs::metadata(main_js).expect("Failed to read main.js metadata");
    let file_size_kb = metadata.len() as f64 / 1024.0;

    println!("[SUCCESS] Bundle 'main.js' generated successfully.");
    println!("[INFO] Bundle Size: {:.2} KB", file_size_kb);

    // Validate Manifest JSON structure
    let manifest_content = fs::read_to_string(manifest).expect("Failed to read manifest.json");
    let parsed: serde_json::Value = serde_json::from_str(&manifest_content).expect("Invalid JSON in manifest.json");

    if let Some(version) = parsed.get("version") {
        println!("[INFO] Manifest Version: {}", version);
    } else {
        eprintln!("[ERROR] Manifest missing 'version' field!");
        exit(1);
    }

    println!("─── All Sanity Checks Passed Cleanly ───");
}
