#!/usr/bin/env python3
"""Reindent project source files to 4-space indentation."""

from __future__ import annotations

import re
import sys
from pathlib import Path

try:
    from bs4 import BeautifulSoup, NavigableString, Tag
except ImportError:
    BeautifulSoup = None  # type: ignore[assignment,misc]
    NavigableString = None  # type: ignore[assignment,misc]
    Tag = None  # type: ignore[assignment,misc]

ROOT = Path(__file__).resolve().parent.parent
INDENT_SIZE = 4
SOURCE_OLD_SIZE = 2
EXTENSIONS = {".html", ".css", ".js", ".py", ".md"}
SKIP_DIRS = {".git", "node_modules", "__pycache__"}


def detect_newline(text: str) -> str:
    return "\r\n" if "\r\n" in text else "\n"


def reindent_line(line: str, old_size: int = SOURCE_OLD_SIZE, new_size: int = INDENT_SIZE) -> str:
    expanded = line.expandtabs(new_size)
    stripped = expanded.lstrip(" ")
    leading = len(expanded) - len(stripped)
    if leading == 0:
        return stripped
    levels, remainder = divmod(leading, old_size)
    return (" " * (levels * new_size + remainder)) + stripped


def reindent_text(text: str, old_size: int = SOURCE_OLD_SIZE, new_size: int = INDENT_SIZE) -> str:
    newline = detect_newline(text)
    lines = text.splitlines()
    return newline.join(reindent_line(line, old_size, new_size) for line in lines)


def prettify_fragment(fragment: str, base_depth: int, indent_size: int = INDENT_SIZE) -> str:
    newline = detect_newline(fragment)
    if BeautifulSoup is None:
        base = " " * (base_depth * indent_size)
        return newline.join(base + line if line.strip() else line for line in fragment.splitlines())

    soup = BeautifulSoup(fragment, "html.parser")
    output: list[str] = []

    def append_pretty(node: Tag | NavigableString, depth: int) -> None:
        if isinstance(node, NavigableString):
            text = str(node)
            if not text.strip():
                return
            for part in text.splitlines():
                if part.strip():
                    output.append((" " * ((base_depth + depth) * indent_size)) + part.strip())
            return

        if not isinstance(node, Tag):
            return

        pretty = node.prettify(formatter="html")
        for line in pretty.splitlines():
            if not line.strip():
                continue
            leading = len(line) - len(line.lstrip())
            output.append((" " * (base_depth * indent_size + leading * indent_size)) + line.lstrip())

    for child in soup.children:
        append_pretty(child, 0)

    if not output:
        return fragment

    return newline.join(output) + newline


def reindent_manifesto_html(text: str) -> str:
    newline = detect_newline(text)
    match = re.search(r"(<article>)(.*?)(</article>)", text, flags=re.DOTALL | re.IGNORECASE)
    if not match:
        return reindent_text(text)

    prefix = text[: match.start(2)]
    article_inner = match.group(2)
    suffix = text[match.end(2) :]

    # article sits at: body > reader-shell > main > article (depth 4)
    pretty_article = prettify_fragment(article_inner, base_depth=4)
    converted_prefix = reindent_text(prefix)
    converted_suffix = reindent_text(suffix)

    if not converted_prefix.endswith(newline):
        converted_prefix += newline
    if pretty_article and not pretty_article.endswith(newline):
        pretty_article += newline

    return converted_prefix + pretty_article + converted_suffix


def should_process(path: Path) -> bool:
    return path.suffix.lower() in EXTENSIONS and path.is_file()


def iter_source_files() -> list[Path]:
    files: list[Path] = []
    for path in ROOT.rglob("*"):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if should_process(path):
            files.append(path)
    return sorted(files)


def process_file(path: Path) -> bool:
    original = path.read_text(encoding="utf-8")
    if path.name.startswith("Beyond_Bills_Manifesto_") and path.suffix == ".html":
        updated = reindent_manifesto_html(original)
    elif path.suffix == ".py":
        updated = reindent_text(original, old_size=INDENT_SIZE, new_size=INDENT_SIZE)
    else:
        updated = reindent_text(original)

    if updated != original:
        path.write_text(updated, encoding="utf-8")
        return True
    return False


def main() -> int:
    if any(
        path.name.startswith("Beyond_Bills_Manifesto_") and path.suffix == ".html"
        for path in iter_source_files()
    ) and BeautifulSoup is None:
        print("Error: beautifulsoup4 is required to indent manifesto HTML files.", file=sys.stderr)
        print("Install it with: pip install beautifulsoup4", file=sys.stderr)
        return 1

    changed = [path for path in iter_source_files() if process_file(path)]
    print(f"Processed {len(list(iter_source_files()))} files.")
    print(f"Updated {len(changed)} files.")
    for path in changed:
        print(f"  - {path.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())