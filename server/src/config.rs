use std::env;

use config::{Config, ConfigError, File, Value};
use serde::Deserialize;
use simple_derive::IntoValueKind;

#[derive(Debug, Deserialize, IntoValueKind)]
pub struct Server {
    pub port: u16,
    pub debug: bool,
}

#[derive(Debug, Deserialize, IntoValueKind)]
pub struct Settings {
    pub server: Server,
    pub hosts: Vec<String>,
    // pub hosts1: [String; 1],
}

impl Settings {
    pub fn new() -> Result<Self, ConfigError> {
        let run_mode = env::var("RUN_MODE").unwrap_or_else(|_| "dev".into());
        let config = Config::builder()
            .set_default("server", Settings::default().server)?
            .set_default("hosts", vec!["test"])?
            .add_source(
                File::with_name(format!("conf/simple-{}", run_mode).as_str()).required(false),
            )
            .build()?;

        config.try_deserialize()
    }
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            server: Server {
                debug: false,
                port: 3000,
            },
            hosts: vec![],
            // hosts1: [String::new()],
        }
    }
}
