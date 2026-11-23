"""Site integrity and end-to-end rendering checks for kizouker/public-cv.

Runs with Python stdlib only (no external packages). If Google Chrome / Chromium
is available, also loads code-standards.html over HTTP in headless mode and
verifies that all five Markdown standards render into the DOM without errors.
"""
from __future__ import annotations

import functools
import http.server
import re
import shutil
import subprocess
import sys
import threading
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML_PAGES = [
    "index.html",
    "sv.html",
    "assignments.html",
    "ai-engineering.html",
    "code-standards.html",
]
VOID_TAGS = {"meta", "br", "img", "link", "input", "hr", "area", "base", "col", "embed", "param", "source", "track", "wbr"}


class SiteHTMLChecker(HTMLParser):
    def __init__(self, filename: str) -> None:
        super().__init__()
        self.filename = filename
        self.stack: list[str] = []
        self.local_refs: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag not in VOID_TAGS:
            self.stack.append(tag)
        for key, value in attrs:
            if key in {"href", "src"} and value:
                if value.startswith(("http://", "https://", "mailto:", "tel:", "#", "javascript:")):
                    continue
                self.local_refs.append(value.split("#", 1)[0].split("?", 1)[0])

    def handle_endtag(self, tag: str) -> None:
        if not self.stack:
            raise AssertionError(f"{self.filename}: unexpected closing </{tag}>")
        opened = self.stack.pop()
        if opened != tag:
            raise AssertionError(f"{self.filename}: expected </{opened}>, got </{tag}>")


def check_html_and_links(base_url: str) -> None:
    for page in HTML_PAGES:
        path = ROOT / page
        assert path.exists(), f"Missing page: {page}"
        checker = SiteHTMLChecker(page)
        checker.feed(path.read_text(encoding="utf-8"))
        assert not checker.stack, f"{page}: unclosed tags {checker.stack}"
        for ref in checker.local_refs:
            if not ref:
                continue
            url = f"{base_url}/{ref}"
            with urllib.request.urlopen(url, timeout=5) as resp:
                assert resp.status == 200, f"{page}: broken local link {ref} (HTTP {resp.status})"
                assert len(resp.read()) > 0, f"{page}: empty asset {ref}"
        print(f"OK HTML + links: {page} ({len(checker.local_refs)} local refs)")


def check_code_standards_sources(base_url: str) -> list[str]:
    html_text = (ROOT / "code-standards.html").read_text(encoding="utf-8")
    docs = re.findall(r'\["([a-z0-9-]+)",\s*"([^"]+\.md)"\]', html_text)
    assert len(docs) >= 5, f"Expected >=5 Markdown docs in code-standards.html, found {docs}"
    for doc_id, md_path in docs:
        with urllib.request.urlopen(f"{base_url}/{md_path}", timeout=5) as resp:
            body = resp.read().decode("utf-8")
            assert resp.status == 200 and len(body.strip()) > 50, f"Bad Markdown source: {md_path}"
        print(f"OK Markdown source: {doc_id} -> {md_path} ({len(body)} chars)")
    return [doc_id for doc_id, _ in docs]


def find_chrome() -> str | None:
    candidates = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        shutil.which("google-chrome"),
        shutil.which("chromium"),
        shutil.which("chromium-browser"),
    ]
    for c in candidates:
        if c and Path(c).exists():
            return c
    return None


def check_code_standards_browser(base_url: str, expected_ids: list[str]) -> None:
    chrome = find_chrome()
    if not chrome:
        print("SKIP headless browser check (Chrome/Chromium not installed)")
        return
    url = f"{base_url}/code-standards.html"
    proc = subprocess.run(
        [chrome, "--headless=new", "--disable-gpu", "--no-sandbox", "--virtual-time-budget=5000", "--dump-dom", url],
        check=True,
        capture_output=True,
        text=True,
    )
    dom = proc.stdout
    visible = re.sub(r"<(script|noscript)\b[^>]*>.*?</\1>", "", dom, flags=re.S | re.I)
    assert 'class="error"' not in visible, "code-standards.html rendered an error element!"
    assert "The documents could not be loaded" not in visible, "code-standards.html rendered an error message!"
    assert "All standards loaded from Markdown source files." in visible, "code-standards.html did not finish loading!"
    for doc_id in expected_ids:
        assert f'<article class="doc" id="{doc_id}"' in visible, f"Rendered DOM missing <article id=\"{doc_id}\">"
    print(f"OK headless Chrome DOM check: all {len(expected_ids)} standards rendered with zero errors")


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args: object) -> None:
        return


def main() -> int:
    handler = functools.partial(QuietHandler, directory=str(ROOT))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    port = server.server_address[1]
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        base_url = f"http://127.0.0.1:{port}"
        check_html_and_links(base_url)
        expected_ids = check_code_standards_sources(base_url)
        check_code_standards_browser(base_url, expected_ids)
    finally:
        server.shutdown()
    print("ALL SITE TESTS PASSED")
    return 0


if __name__ == "__main__":
    sys.exit(main())
