#!/usr/bin/env python3

import os
import sys
from pathlib import Path


def rename_files(folder_path):
    folder = Path(folder_path).expanduser()

    if not folder.exists():
        print(f"Error: Folder does not exist: {folder}")
        return

    if not folder.is_dir():
        print(f"Error: Path is not a folder: {folder}")
        return

    renamed = 0
    skipped = 0

    # Recursively scan all files
    for file_path in folder.rglob("*"):
        if not file_path.is_file():
            continue

        filename = file_path.name

        # Nothing to rename if there are no spaces
        if " " not in filename:
            continue

        new_filename = filename.replace(" ", "_")
        new_path = file_path.with_name(new_filename)

        # Avoid overwriting an existing file
        if new_path.exists():
            print(f"SKIPPED: {file_path}")
            print(f"  Target already exists: {new_path}")
            skipped += 1
            continue

        try:
            file_path.rename(new_path)
            print(f"RENAMED: {file_path}")
            print(f"      TO: {new_path}")
            renamed += 1

        except OSError as e:
            print(f"ERROR: Could not rename {file_path}: {e}")
            skipped += 1

    print("\nDone.")
    print(f"Files renamed: {renamed}")
    print(f"Files skipped/errors: {skipped}")


def main():
    if len(sys.argv) != 2:
        print("Usage:")
        print(f"  python {Path(sys.argv[0]).name} <folder_path>")
        print()
        print("Examples:")
        print(r'  python rename_spaces.py "C:\Users\John\Documents"')
        print(r'  python rename_spaces.py "/home/john/documents"')
        sys.exit(1)

    rename_files(sys.argv[1])


if __name__ == "__main__":
    main()