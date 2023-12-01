use std::env;

use tracing::info;
use tracing::level_filters;
use tracing_appender::rolling;
use tracing_subscriber::fmt::{layer, time::ChronoLocal};
use tracing_subscriber::layer::SubscriberExt;

use crate::APP_CONFIG;

pub fn setup_logger() {
    let log_path = if let Ok(mut exec_path) = env::current_exe() {
        exec_path.pop();
        exec_path.join("log")
    } else {
        panic!("can't found log path")
    };

    println!("{:?}", env::current_dir().unwrap());
    let file_appender = rolling::daily(&log_path, "simple.log");
    let console_logger = layer()
        .with_timer(ChronoLocal::new("%H:%M:%S%.3f".into()))
        .pretty();
    let file_logger = layer()
        .with_timer(ChronoLocal::new("%Y-%m-%d %H:%M:%S%.3f".into()))
        .with_writer(file_appender)
        .with_ansi(false);
    let subscriber = tracing_subscriber::registry()
        .with(file_logger)
        .with(console_logger);

    let subscriber = if APP_CONFIG.server.debug {
        subscriber.with(level_filters::LevelFilter::DEBUG)
    } else {
        subscriber.with(level_filters::LevelFilter::INFO)
    };

    tracing::subscriber::set_global_default(subscriber).expect("Failed to set global default");
    info!("set log path at {}", &log_path.display());
}
