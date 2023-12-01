use axum::{response::Html, routing::get, Router};
use listenfd::ListenFd;
use tokio::net::TcpListener;
use tracing::info;

mod config;
mod logger;

lazy_static::lazy_static!(
    #[derive(Debug)]
    pub static ref APP_CONFIG: config::Settings = config::Settings::new().expect("Failed to load config file");
);

#[tokio::main]
async fn main() {
    logger::setup_logger();

    let app = Router::new().route("/", get(handler));
    println!("server settings: {:?}", APP_CONFIG.server);
    // run it
    let mut listenfd = ListenFd::from_env();
    let listener = match listenfd.take_tcp_listener(0).unwrap() {
        // if we are given a tcp listener on listen fd 0, we use that one
        Some(listener) => TcpListener::from_std(listener).unwrap(),
        // otherwise fall back to local listening
        None => TcpListener::bind(format!("127.0.0.1:{}", APP_CONFIG.server.port))
            .await
            .unwrap(),
    };
    info!("listening on http://{}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

async fn handler() -> Html<&'static str> {
    Html("<h1>Hello, World!</h1>")
}
