"""Tiny local server for testing: serves this folder and lets compile.html save targets.mind.

    python3 serve.py        ->  http://localhost:8765
"""
import http.server, os, urllib.parse

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_POST(self):
        url = urllib.parse.urlparse(self.path)
        if url.path != '/save':
            self.send_error(404)
            return
        name = os.path.basename(urllib.parse.parse_qs(url.query).get('name', ['targets.mind'])[0])
        body = self.rfile.read(int(self.headers.get('Content-Length', 0)))
        with open(os.path.join(ROOT, 'assets', name), 'wb') as f:
            f.write(body)
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'ok')


if __name__ == '__main__':
    http.server.ThreadingHTTPServer(('', 8765), Handler).serve_forever()
