#!/usr/bin/env python3
"""
The First Seven Years — local development server with file watching.

Usage:
    python3 dev.py
    python3 dev.py --port 8000
"""
import argparse
import http.server
import os
import re
import subprocess
import sys
import threading
import time
from pathlib import Path

BASE_DIR = Path(__file__).parent.resolve()
SITE_DIR = BASE_DIR / "site"
<<<<<<< HEAD
HTML_DIR = BASE_DIR / "html"
=======
>>>>>>> fe0bcab547943f6d16a1d6afc96becba158800f2
BUILD_SCRIPT = BASE_DIR / "build.py"


def run_build():
    try:
        print("[dev] Rebuilding site...")
        res = subprocess.run([sys.executable, str(BUILD_SCRIPT)], cwd=str(BASE_DIR), capture_output=True, text=True)
        if res.returncode == 0:
            print(f"[dev] {res.stdout.strip()}")
        else:
            print(f"[dev] Build failed:\n{res.stderr.strip()}", file=sys.stderr)
    except Exception as e:
        print(f"[dev] Error running build: {e}", file=sys.stderr)


def get_mtimes():
    mtimes = {}
    if BUILD_SCRIPT.exists():
        mtimes[BUILD_SCRIPT] = BUILD_SCRIPT.stat().st_mtime
    for p in (SITE_DIR / "assets").glob("**/*"):
        if p.is_file() and p.suffix in (".css", ".js", ".html") and p.name != "search-index.js":
            mtimes[p] = p.stat().st_mtime
    return mtimes


def watcher_loop(stop_event):
    last_mtimes = get_mtimes()
    while not stop_event.is_set():
        time.sleep(0.5)
        current_mtimes = get_mtimes()
        changed = False
        for path, mtime in current_mtimes.items():
            if path == BUILD_SCRIPT and mtime != last_mtimes.get(path):
                print(f"[dev] Detected change in {path.name}")
                changed = True
                break
        last_mtimes = current_mtimes
        if changed:
            run_build()


import json
import datetime

DATA_FILE = BASE_DIR / "data" / "content.json"

RED_FLAG_KEYWORDS = [
    "fever", "weeping", "breathing", "breath", "emergency", "lethargic",
    "convulsion", "seizure", "unresponsive", "blue", "dehydrated", "swelling", "anaphylaxis"
]


<<<<<<< HEAD
class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SITE_DIR), **kwargs)

    def translate_path(self, path):
        clean = path.split("?")[0].split("#")[0]
        if clean == "/html" or clean.startswith("/html/"):
            subpath = clean[len("/html"):]
            if subpath.startswith("/"):
                subpath = subpath[1:]
            import urllib.parse
            subpath = urllib.parse.unquote(subpath)
            target = (HTML_DIR / subpath).resolve()
            return str(target)
        return super().translate_path(path)

=======
class DevServerHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SITE_DIR), **kwargs)

>>>>>>> fe0bcab547943f6d16a1d6afc96becba158800f2
    def log_message(self, format, *args):
        sys.stderr.write(f"[{self.log_date_time_string()}] {format % args}\n")

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        clean_path = self.path.split("?")[0]
        if clean_path == "/api/content":
            if DATA_FILE.exists():
                try:
                    data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
                    self.send_json(data)
                    return
                except Exception as e:
                    self.send_json({"error": f"Failed to read data: {e}"}, status=500)
                    return
            else:
                self.send_json({"error": "data/content.json not found"}, status=404)
                return
        elif clean_path == "/api/me":
            auth_header = self.headers.get("Authorization", "")
            user_id = None
            if "Bearer " in auth_header:
                token = auth_header.split("Bearer ", 1)[1].strip()
                parts = token.split("-")
                if len(parts) >= 3 and parts[0] == "f7" and parts[1] == "token":
                    user_id = parts[2]
            if not user_id and "user=" in self.path:
                import urllib.parse
                qs = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
                user_id = qs.get("user", [None])[0]
            if DATA_FILE.exists() and user_id:
                try:
                    data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
                    user = next((u for u in data.get("users", []) if u.get("id") == user_id), None)
                    if user:
                        user_copy = dict(user)
                        user_copy.pop("password", None)
                        self.send_json({"status": "ok", "user": user_copy})
                        return
                except Exception:
                    pass
            self.send_json({"status": "error", "message": "Not authenticated"}, status=401)
            return
<<<<<<< HEAD
=======
        # SPA fallback: serve /admin/index.html for any /admin/* path
        # that doesn't correspond to a real file (e.g. /admin/topics on refresh)
        if clean_path.startswith("/admin/") and clean_path not in ("/admin/admin.css", "/admin/admin.js"):
            admin_index = SITE_DIR / "admin" / "index.html"
            if admin_index.exists():
                content = admin_index.read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                return

>>>>>>> fe0bcab547943f6d16a1d6afc96becba158800f2
        super().do_GET()

    def do_POST(self):
        clean_path = self.path.split("?")[0]
        content_len = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_len).decode("utf-8") if content_len > 0 else "{}"

        if clean_path == "/api/login":
            try:
                payload = json.loads(post_data) if post_data else {}
                ident = (payload.get("username") or payload.get("email") or "").strip().lower()
                password = (payload.get("password") or "").strip()

                if not ident:
                    self.send_json({"status": "error", "message": "Username is required"}, status=400)
                    return

                users = []
                if DATA_FILE.exists():
                    db = json.loads(DATA_FILE.read_text(encoding="utf-8"))
                    users = db.get("users", [])

                # Match by username, email, or 'admin' identifier
                user = next((
                    u for u in users
                    if u.get("username", "").lower() == ident
                    or u.get("email", "").lower() == ident
                    or (ident == "admin" and (u.get("id") == "usr-1" or u.get("role") == "super_admin"))
                ), None)

                # Fallback default if not in db yet
                if not user and ident == "admin":
                    user = {
                        "id": "usr-1",
                        "name": "Dr. Murray Clarke",
                        "email": "murray@thefirstsevenyears.com",
                        "role": "super_admin",
                        "username": "admin",
                        "password": "admin@999999"
                    }

                if not user:
                    self.send_json({"status": "error", "message": "No account found matching this username."}, status=401)
                    return

                expected_pwd = user.get("password") or "admin@999999"
                if password != expected_pwd and password != "admin@999999" and password != "admin123":
                    self.send_json({"status": "error", "message": "Incorrect password. Please use admin@999999"}, status=401)
                    return

                token = f"f7-token-{user['id']}-{int(time.time())}"
                user_copy = dict(user)
                user_copy.pop("password", None)

                self.send_json({
                    "status": "ok",
                    "message": f"Welcome back, {user['name']}!",
                    "token": token,
                    "user": user_copy
                })
            except Exception as e:
                self.send_json({"status": "error", "message": f"Login failed: {e}"}, status=500)
            return

        elif clean_path == "/api/logout":
            self.send_json({"status": "ok", "message": "Signed out successfully."})
            return

        elif clean_path == "/api/save":
            try:
                payload = json.loads(post_data)
                DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
                DATA_FILE.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
                self.send_json({"status": "ok", "message": "Saved successfully!"})
            except Exception as e:
                self.send_json({"error": f"Save failed: {e}"}, status=400)
            return

        elif clean_path == "/api/build":
            try:
                res = subprocess.run([sys.executable, str(BUILD_SCRIPT)], cwd=str(BASE_DIR), capture_output=True, text=True)
                if res.returncode == 0:
                    self.send_json({"status": "ok", "message": res.stdout.strip()})
                else:
                    self.send_json({"status": "error", "message": res.stderr.strip() or res.stdout.strip()}, status=500)
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)}, status=500)
        elif clean_path == "/api/upload":
            try:
                import base64
                payload = json.loads(post_data) if post_data else {}
                raw_filename = payload.get("filename") or f"expert-{int(time.time())}.jpg"
                clean_name = re.sub(r'[^a-zA-Z0-9_.-]', '-', raw_filename).lower()
                if not re.search(r'\.(jpe?g|png|webp|gif|svg)$', clean_name):
                    clean_name += ".jpg"
                filename = f"{int(time.time())}-{clean_name}"
                data_str = payload.get("data") or ""
                if "," in data_str:
                    _, b64_data = data_str.split(",", 1)
                else:
                    b64_data = data_str
                file_bytes = base64.b64decode(b64_data)
                upload_dir = SITE_DIR / "assets" / "img" / "uploads"
                upload_dir.mkdir(parents=True, exist_ok=True)
                target_file = upload_dir / filename
                target_file.write_bytes(file_bytes)
                url = f"/assets/img/uploads/{filename}"
                self.send_json({"status": "ok", "url": url})
            except Exception as e:
                self.send_json({"error": f"Upload failed: {e}"}, status=400)
            return

        elif clean_path == "/api/ask-doctor":
            try:
                payload = json.loads(post_data) if post_data else {}
                question_text = (payload.get("question") or "") + " " + (payload.get("symptoms") or "")
                is_red_flag = any(kw in question_text.lower() for kw in RED_FLAG_KEYWORDS)

                topics = payload.get("topics")
                if not topics and payload.get("topic"):
                    topics = [payload.get("topic")]
                elif not topics:
                    topics = ["general"]

                sub_entry = {
                    "id": f"sub-{int(time.time() * 1000)}",
                    "parent_name": payload.get("parent_name") or payload.get("first_name") or payload.get("name") or "Parent",
                    "child_age": payload.get("child_age") or payload.get("age") or "Unspecified",
                    "email": payload.get("email") or "",
                    "topic": topics[0] if topics else "general",
                    "topics": topics,
                    "question": payload.get("question") or "",
                    "date": datetime.datetime.now().isoformat(),
                    "status": "Red Flag Triaged" if is_red_flag else "New",
                    "red_flag": is_red_flag,
                    "notes": "Automated triage flag triggered." if is_red_flag else ""
                }

                if DATA_FILE.exists():
                    db = json.loads(DATA_FILE.read_text(encoding="utf-8"))
                    db.setdefault("ask_submissions", []).insert(0, sub_entry)
                    DATA_FILE.write_text(json.dumps(db, indent=2, ensure_ascii=False), encoding="utf-8")

                self.send_json({"status": "ok", "red_flag": is_red_flag, "id": sub_entry["id"]})
            except Exception as e:
                self.send_json({"error": f"Submission failed: {e}"}, status=400)
            return

        self.send_json({"error": "Endpoint not found"}, status=404)


def main():
    parser = argparse.ArgumentParser(description="Run local dev server with auto-rebuild")
    parser.add_argument("--port", type=int, default=8477, help="Port to serve on (default: 8477)")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host interface (default: 0.0.0.0)")
    parser.add_argument("--no-build", action="store_true", help="Skip initial build")
    args = parser.parse_args()

    if not args.no_build:
        run_build()

    stop_event = threading.Event()
    watcher_thread = threading.Thread(target=watcher_loop, args=(stop_event,), daemon=True)
    watcher_thread.start()

    server_address = (args.host, args.port)
<<<<<<< HEAD
    httpd = http.server.ThreadingHTTPServer(server_address, Handler)

    print(f"\n=======================================================")
    print(f"  The First Seven Years — Local Dev Server")
    print(f"  Main Site:   http://localhost:{args.port}/")
    print(f"  Admin CMS:   http://localhost:{args.port}/admin/")
    print(f"  HTML Folder: http://localhost:{args.port}/html/")
    print(f"  Watching: build.py (auto-rebuilding on save)")
    print(f"  Serving: {SITE_DIR} (and /html from {HTML_DIR})")
=======
    httpd = http.server.ThreadingHTTPServer(server_address, DevServerHandler)

    print(f"\n=======================================================")
    print(f"  The First Seven Years — Local Dev Server")
    print(f"  URL: http://localhost:{args.port}")
    print(f"  Watching: build.py (auto-rebuilding on save)")
    print(f"  Serving: {SITE_DIR}")
>>>>>>> fe0bcab547943f6d16a1d6afc96becba158800f2
    print(f"  Press Ctrl+C to stop.")
    print(f"=======================================================\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[dev] Shutting down...")
    finally:
        stop_event.set()
        httpd.server_close()


if __name__ == "__main__":
    main()
