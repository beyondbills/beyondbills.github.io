from pathlib import Path

p = Path(__file__).with_name("index.html")
text = p.read_text(encoding="utf-8")
old = (
    '    <header class="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-ink/88 text-white backdrop-blur-xl">\n'
    '        <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">\n'
    '            <a href="#hero" class="flex items-center gap-3" aria-label="Beyond Bills Global home">\n'
    '                <img src="assets/Beyond_Bills_Logo.png" alt="Beyond Bills Global logo" class="h-11 w-11 object-contain">\n'
    '                <span class="text-lg font-black sm:text-xl">Beyond Bills Global</span>\n'
    "            </a>"
)
new = (
    '    <header class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)]">\n'
    '        <nav class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">\n'
    '            <a href="#hero" class="flex min-w-0 items-center gap-3" aria-label="Beyond Bills Global home">\n'
    '                <img src="assets/Beyond_Bills_Logo.png" alt="Beyond Bills Global logo" class="h-11 w-11 shrink-0 object-contain">\n'
    '                <span class="break-words text-base font-black tracking-tight sm:text-lg lg:text-xl">Beyond Bills Global</span>\n'
    "            </a>"
)
if old not in text:
    idx = text.find("<header class=")
    print("OLD NOT FOUND")
    print(repr(text[idx : idx + 500]))
else:
    p.write_text(text.replace(old, new, 1), encoding="utf-8", newline="\n")
    print("updated header")
