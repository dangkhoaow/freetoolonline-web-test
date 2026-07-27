JsBarcode (vendored, self-hosted) - MIT License
Copyright (c) 2016 Johan Lindell (johan@lindell.me)
Source: https://github.com/lindell/JsBarcode (v3.11.6, jsdelivr UMD "all formats" build)
Files: JsBarcode.all.min.js (window.JsBarcode)
Full text: https://github.com/lindell/JsBarcode/blob/master/MIT-LICENSE.txt

Served with an explicit `; charset=utf-8` Content-Type (GitHub Pages already
does this for .js by default - confirmed live 2026-07-23). The minified
bundle contains a small number of non-ASCII bytes inside a CODE128 regex
character class; without an explicit UTF-8 charset a host may serve it as
Latin-1 and corrupt that regex ("Range out of order in character class"),
breaking every barcode format, not just CODE128. Verified via a standalone
Playwright isolation test comparing a no-charset local server (broken) vs a
UTF-8-charset local server (correct) - new-tool-discovery-loop fire383.
