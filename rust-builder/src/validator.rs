use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize)]
pub struct ManifestValidation {
    pub id: String,
    pub name: String,
    pub version: String,
    #[serde(rename = "minAppVersion")]
    pub min_app_version: String,
}

pub struct Validator;

impl Validator {
    /// Validates manifest schema and structural integrity of plugin artifacts
    pub fn validate_manifest(path: &Path) -> Result<(), String> {
        let content = fs::read_to_string(path)
            .map_err(|e| format!("Failed to read manifest file: {}", e))?;

        let manifest: ManifestValidation = serde_json::from_str(&content)
            .map_err(|e| format!("Manifest JSON parsing failed: {}", e))?;

        if manifest.id != "vertical-tabs-pro-obsidian" {
            return Err(format!("Invalid plugin ID: {}", manifest.id));
        }

        if manifest.version.is_empty() {
            return Err("Manifest version string cannot be empty".to_string());
        }

        println!("[RUST VALIDATOR] Manifest validated cleanly for ID: {}", manifest.id);
        Ok(())
    }
}
