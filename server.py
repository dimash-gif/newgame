import http.server
import socketserver
import webbrowser
import threading
import time
import sys

PORT = 8888

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Prevent spamming the console with asset requests
        pass

def start_server():
    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", PORT), QuietHandler) as httpd:
            print(f"\n[SYSTEM] Cyber Security Arcade Server running at http://localhost:{PORT}")
            httpd.serve_forever()
    except Exception as e:
        print(f"[ERROR] Failed to start server: {e}", file=sys.stderr)

if __name__ == "__main__":
    # Start the server in a separate daemon thread
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    
    time.sleep(0.5)
    
    # Open browser automatically
    game_url = f"http://localhost:{PORT}"
    print(f"[SYSTEM] Loading Cyber Security Arcade in default browser...")
    webbrowser.open(game_url)
    
    # Keep the main thread alive to serve requests
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[SYSTEM] Shutting down Arcade Server. Goodbye!")
        sys.exit(0)
