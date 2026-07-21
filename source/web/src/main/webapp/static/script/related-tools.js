try {
  // plan-warm-pascal-v3 S3.1: locale-aware Related-Tools link rewriter.
  // Detect the active page locale from `<html lang>` (set by the renderer for
  // /guides/<lang>/<slug>.html URLs) and rewrite guide URLs in urlMaps to the
  // matching locale variant. Falls back to the EN canonical when the variant
  // is unknown to the client (the link target is then resolved server-side
  // via JSP_BY_ROUTE or 301s through ALIAS_ROUTES).
  var SUPPORTED_LOCALES = ["pt", "es", "vi", "id", "de"];
  function detectPageLocale() {
    try {
      var lang = (document.documentElement.getAttribute("lang") || "").toLowerCase().slice(0, 2);
      if (SUPPORTED_LOCALES.indexOf(lang) !== -1) return lang;
    } catch (e) {}
    return null;
  }
  function localizeRelatedUrl(url) {
    var locale = detectPageLocale();
    if (!locale) return url;
    // Only rewrite /guides/<bare-slug>.html (EN canonical). Already-localised
    // /guides/<lang>/<slug>.html URLs and non-guide URLs pass through.
    var m = /^https:\/\/freetoolonline\.com\/guides\/(?:en\/)?([a-z0-9-]+\.html)$/.exec(url);
    if (!m) return url;
    return "https://freetoolonline.com/guides/" + locale + "/" + m[1];
  }
  // plan-kahan: dedicated Related-guides section. Client fallback mirrors the
  // SSR partition (page-renderer.mjs) - tool links -> .relatedTools, /guides/
  // links -> .relatedGuides - and renders an optional "- desc" blurb. The
  // guides list is injected ONLY when a .relatedGuides container already exists
  // in the DOM (the SSR emits it only on allowlisted routes), so the staged
  // rollout gate is respected on the client path too.
  function escRelDesc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function relatedLiHtml(url, title, color, titleAttr, desc) {
    var d = desc ? ' - <span class="desc">' + escRelDesc(desc) + "</span>" : "";
    return '<li class="d-inline"><a title="' + titleAttr + '" style="color: ' + color + ';" href="' + url + '">' + title + "</a>" + d + "</li>";
  }
  function isGuideRelatedUrl(url) {
    return /\/guides\//.test(String(url || ""));
  }
  // news-loop (2026-07-08): a /news/ URL routes into the dedicated
  // Related-news section, mirroring the guides partition above.
  function isNewsRelatedUrl(url) {
    return /\/news\//.test(String(url || ""));
  }
  var urlMaps = [
    { title: "ZIP Tools", url: "https://freetoolonline.com/zip-tools.html", include: !1, tags: "zip,pdf" },
    { title: "File Compressor: Pick the Right Tool by File Type", url: "https://freetoolonline.com/utility-tools/file-compressor.html", include: !1, tags: "compress,zip,image-editing,pdf,utility,file-compressor" },
    { title: "Get JPEG Compression Level", url: "https://freetoolonline.com/image-tools/get-jpeg-compression-level.html", include: !1, tags: "jpg,compress,quality,image-editing" },
    { title: "Base64 To Image", url: "https://freetoolonline.com/image-converter-tools/base64-to-image.html", include: !1, tags: "image-conversion,base64" },
    { title: "Convert Time In Millisecond To Date", url: "https://freetoolonline.com/utility-tools/convert-time-in-millisecond-to-date.html", include: !1, tags: "millis,utility" },
    { title: "Convert GIF To Images Frame", url: "https://freetoolonline.com/image-converter-tools/extract-gif-to-image-frames.html", include: !1, tags: "image-conversion,split,gif,image-editing,video" },
    { title: "Convert HEIC to JPG online", url: "https://freetoolonline.com/image-converter-tools/heic-to-jpg.html", include: !1, tags: "image-conversion,jpg,pdf,ai" },
    { title: "Image Converter Tools", url: "https://freetoolonline.com/image-converter-tools.html", include: !1, tags: "image-conversion" },
    { title: "Convert Images to PDF", url: "https://freetoolonline.com/pdf-tools/images-to-pdf.html", include: !1, tags: "pdf,image-conversion,image-editing" },
    { title: "Image To Base64", url: "https://freetoolonline.com/image-converter-tools/image-to-base64.html", include: !1, tags: "image-conversion,base64,jpg,png" },
    { title: "MD5 converter", url: "https://freetoolonline.com/developer-tools/md5-converter.html", include: !1, tags: "md5,developer,utility" },
    { title: "Convert PDF to HTML online", url: "https://freetoolonline.com/pdf-tools/pdf-to-html.html", include: !1, tags: "pdf" },
    { title: "Convert PDF To Images", url: "https://freetoolonline.com/pdf-tools/pdf-to-images.html", include: !1, tags: "pdf,image-conversion,image-editing" },
    { title: "Convert PDF to TEXT online", url: "https://freetoolonline.com/pdf-tools/pdf-to-text.html", include: !1, tags: "pdf,developer" },
    { title: "QR Code Generator", url: "https://freetoolonline.com/utility-tools/qr-code-generator.html", include: !1, tags: "qrcode,generator,utility" },
    { title: "SVG to PNG and WEBP Converter", url: "https://freetoolonline.com/image-converter-tools/svg-to-png.html", include: !1, tags: "image-conversion,pagespeed,png,jpg,webp" },
    { title: "PNG to SVG by Interpolation algorithm", url: "https://freetoolonline.com/image-converter-tools/png-to-svg.html", include: !1, tags: "image-conversion,jpg,png,interpolation" },
    { title: "Text To HTML Editor", url: "https://freetoolonline.com/developer-tools/text-html-editor.html", include: !1, tags: "editor,text,html,developer" },
    { title: "All Video Converter", url: "https://freetoolonline.com/video-tools/video-converter.html", include: !1, tags: "video,resize,trim,cut" },
    { title: "Get Current Time In Millisecond", url: "https://freetoolonline.com/utility-tools/get-time-in-millisecond.html", include: !1, tags: "millis,utility" },
    { title: "Remove Zip Password", url: "https://freetoolonline.com/zip-tools/remove-zip-password.html", include: !1, tags: "password,zip" },
    { title: "UnZip File, Extract, Decompress Zip", url: "https://freetoolonline.com/zip-tools/unzip-file.html", include: !1, tags: "zip,unzip" },
    { title: "Compress, Zip File and Folder", url: "https://freetoolonline.com/zip-tools/zip-file.html", include: !1, tags: "compress,zip" },
    { title: "Compress JPEG by AI", url: "https://freetoolonline.com/image-tools/compress-image.html", include: !1, tags: "compress,jpg,ai,image-editing,utility,image-conversion" },
    { title: "Insights Image Optimizer", url: "https://freetoolonline.com/image-tools/insights-image-optimizer.html", include: !1, tags: "pagespeed,jpg,png,compress,image-editing" },
    { title: "Image Cropper And Rotator", url: "https://freetoolonline.com/image-tools/crop-image.html", include: !1, tags: "crop,jpg,png,image-editing" },
    { title: "FFmpeg Online", url: "https://freetoolonline.com/video-tools/ffmpeg-online.html", include: !1, tags: "video,ffmpeg,execute" },
    { title: "GIF Maker and Gif Editor", url: "https://freetoolonline.com/image-tools/gif-maker.html", include: !1, tags: "split,gif,maker,resize,trim,cut,editor,image-editing,image-conversion,video" },
    { title: "ImageMagick Online", url: "https://freetoolonline.com/image-tools/imagemagick-online.html", include: !1, tags: "imagemagick,execute,image-editing" },
    { title: "Resize JPG and PNG by BiInterpolation Algorithm", url: "https://freetoolonline.com/image-tools/resize-image.html", include: !1, tags: "resize,jpg,png,interpolation,image-editing,image-conversion" },
    { title: "Compose, Create PDF By Editor", url: "https://freetoolonline.com/pdf-tools/compose-pdf.html", include: !1, tags: "editor,pdf,image-editing" },
    { title: "Encrypt, Protect PDF By Password", url: "https://freetoolonline.com/pdf-tools/protect-pdf-by-password.html", include: !1, tags: "pdf,password" },
    { title: "Flatten Pdf", url: "https://freetoolonline.com/pdf-tools/flatten-pdf.html", include: !1, tags: "pdf,compress" },
    { title: "Join Multiple PDF Files To One File", url: "https://freetoolonline.com/pdf-tools/join-pdf-from-multiple-files.html", include: !1, tags: "pdf" },
    { title: "PDF Validator, PreFlight", url: "https://freetoolonline.com/pdf-tools/preflight-pdf.html", include: !1, tags: "pdf,validation" },
    { title: "Remove PDF Password", url: "https://freetoolonline.com/pdf-tools/remove-pdf-password.html", include: !1, tags: "pdf,password" },
    { title: "Split PDF By Range, Start And End Page", url: "https://freetoolonline.com/pdf-tools/split-pdf-by-range.html", include: !1, tags: "pdf,split" },
    { title: "Split PDF To Single PDF Pages", url: "https://freetoolonline.com/pdf-tools/split-pdf-to-each-pages.html", include: !1, tags: "pdf,split" },
    { title: "Camera Test", url: "https://freetoolonline.com/device-test-tools/camera-test.html", include: !1, tags: "device-test,utility,video" },
    { title: "CSS Gradient Animator Generator", url: "https://freetoolonline.com/developer-tools/css-gradient-generator.html", include: !1, tags: "generator,css,developer" },
    { title: "CSS Minifier", url: "https://freetoolonline.com/developer-tools/css-minifier.html", include: !1, tags: "pagespeed,minifier,css,developer" },
    { title: "CSS UnMinifier", url: "https://freetoolonline.com/developer-tools/css-unminifier.html", include: !1, tags: "beautifier,css,developer" },
    { title: "JavaScript Minifier", url: "https://freetoolonline.com/developer-tools/js-minifier.html", include: !1, tags: "pagespeed,minifier,javascript,developer" },
    { title: "JSON Parser By Tree View", url: "https://freetoolonline.com/developer-tools/json-parser.html", include: !1, tags: "beautifier,parser,javascript,json,developer" },
    { title: "JavaScript UnMinifier", url: "https://freetoolonline.com/developer-tools/js-unminifier.html", include: !1, tags: "beautifier,javascript,developer" },
    { title: "Keyboard Test", url: "https://freetoolonline.com/device-test-tools/keyboard-test.html", include: !1, tags: "device-test,utility,developer" },
    { title: "LCD Test", url: "https://freetoolonline.com/device-test-tools/lcd-test.html", include: !1, tags: "device-test,utility" },
    { title: "Microphone Test", url: "https://freetoolonline.com/device-test-tools/microphone-test.html", include: !1, tags: "device-test,utility" },
    { title: "Text Diff", url: "https://freetoolonline.com/developer-tools/text-diff.html", include: !1, tags: "compare,text,developer" },
    { title: "Video And SlideShow Maker", url: "https://freetoolonline.com/video-tools/video-maker.html", include: !1, tags: "video,maker,editor" },
    { title: "Total Photo Editor", url: "https://freetoolonline.com/image-tools/photo-editor.html", include: !1, tags: "png,jpg,editor,image-editing" },
    { title: "Đo nồng độ cồn trực tuyến", url: "https://freetoolonline.com/utility-tools/do-nong-do-con-truc-tuyen.html", include: !1, tags: "utility,alcohol,calculator" },
    { title: "Chuyển đổi sang Tiếq Việt mới trực tuyến", url: "https://freetoolonline.com/utility-tools/cong-cu-chuyen-doi-chu-quoc-ngu-tieng-viet-thanh-tieq-viet-kieu-moi.html", include: !1, tags: "utility,vietnamese,tieqviet" },
    { title: "Image Tools", url: "https://freetoolonline.com/image-tools.html", include: !1, tags: "image-editing" },
    { title: "PDF Tools", url: "https://freetoolonline.com/pdf-tools.html", include: !1, tags: "pdf,zip" },
    { title: "Developer Tools", url: "https://freetoolonline.com/developer-tools.html", include: !1, tags: "developer" },
    { title: "Video Tools", url: "https://freetoolonline.com/video-tools.html", include: !1, tags: "video" },
    { title: "Device Test Tools", url: "https://freetoolonline.com/device-test-tools.html", include: !1, tags: "device-test" },
    { title: "Utility Tools", url: "https://freetoolonline.com/utility-tools.html", include: !1, tags: "utility" },
    { title: "HEIC vs JPG vs WebP - When to Use Each", url: "https://freetoolonline.com/guides/en/heic-vs-jpg-vs-webp.html", include: !1, tags: "guide,image-conversion,jpg,heic,webp" },
    { title: "Dead Pixel Testing Guide", url: "https://freetoolonline.com/guides/en/dead-pixel-testing-guide.html", include: !1, tags: "guide,device-test,lcd" },
    { title: "Unix Timestamps Explained", url: "https://freetoolonline.com/guides/en/unix-timestamps-explained.html", include: !1, tags: "guide,utility,developer,millis" },
    { title: "PDF Password Types: Owner vs User", url: "https://freetoolonline.com/guides/en/pdf-password-types-owner-vs-user.html", include: !1, tags: "guide,pdf,password" },
    { title: "PNG vs SVG - When to Use Each", url: "https://freetoolonline.com/guides/en/png-vs-svg-when-to-use.html", include: !1, tags: "guide,image-conversion,png,svg" },
    { title: "CSS Minifier vs Compressor", url: "https://freetoolonline.com/guides/en/css-minifier-vs-compressor.html", include: !1, tags: "guide,developer,css,minifier,pagespeed" },
    { title: "MP4 vs WebM for the Web", url: "https://freetoolonline.com/guides/en/mp4-vs-webm-for-web.html", include: !1, tags: "guide,video,mp4,webm" },
    { title: "JPG vs PNG for the Web", url: "https://freetoolonline.com/guides/en/jpg-vs-png-for-web.html", include: !1, tags: "guide,image-conversion,jpg,png,image-editing" },
    { title: "MD5 vs SHA-256 - When to Hash", url: "https://freetoolonline.com/guides/en/md5-vs-sha256-when-to-hash.html", include: !1, tags: "guide,developer,md5,hash" },
    { title: "CSV vs JSON Data Formats", url: "https://freetoolonline.com/guides/en/csv-vs-json-data-formats.html", include: !1, tags: "guide,developer,json,csv" },
    { title: "JSON Parser Online: Validate vs Format vs Tree View", url: "https://freetoolonline.com/guides/en/json-parser-validate-vs-format-vs-tree-view.html", include: !1, tags: "guide,developer,json,parser" },
    { title: "Milliseconds to Date - UTC vs Local Time", url: "https://freetoolonline.com/guides/en/milliseconds-to-date-utc-vs-local-time.html", include: !1, tags: "guide,developer,milliseconds,timestamp,timezone" },
    { title: "Current Time in Milliseconds", url: "https://freetoolonline.com/guides/en/current-time-in-milliseconds.html", include: !1, tags: "guide,utility,developer,milliseconds,timestamp,epoch" },
    { title: "Time in Milliseconds", url: "https://freetoolonline.com/guides/en/time-in-ms.html", include: !1, tags: "guide,utility,developer,milliseconds,duration,epoch" },
    { title: "PDF vs HEIC for Document Archival", url: "https://freetoolonline.com/guides/en/pdf-vs-heic-for-document-archival.html", include: !1, tags: "guide,pdf,heic,image-conversion" },
    { title: "FFmpeg Online vs Local FFmpeg", url: "https://freetoolonline.com/guides/en/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html", include: !1, tags: "guide,video,ffmpeg" },
    { title: "How to Convert 100 HEIC Photos to JPG", url: "https://freetoolonline.com/guides/en/how-to-convert-100-heic-photos-to-jpg.html", include: !1, tags: "guide,image-conversion,heic,jpg" },
    { title: "How to Test for Dead Pixels Before Returning a Monitor", url: "https://freetoolonline.com/guides/en/how-to-test-for-dead-pixels-before-returning-a-monitor.html", include: !1, tags: "guide,device-test,lcd" },
    { title: "How to Sign a PDF After Removing a Password", url: "https://freetoolonline.com/guides/en/how-to-sign-pdf-after-removing-a-password.html", include: !1, tags: "guide,pdf,password" },
    { title: "How to Extract Frames from a GIF for a Social Post", url: "https://freetoolonline.com/guides/en/how-to-extract-frames-from-a-gif-for-a-social-post.html", include: !1, tags: "guide,gif,image-conversion,split,image-editing,video" },
    { title: "How to Check Webcam and Microphone Before an Interview", url: "https://freetoolonline.com/guides/en/how-to-check-webcam-and-microphone-before-an-interview.html", include: !1, tags: "guide,device-test,utility,video" },
    { title: "How to Minify CSS and JS for Cloud Run Cold Start", url: "https://freetoolonline.com/guides/en/how-to-minify-css-js-for-cloud-run-cold-start.html", include: !1, tags: "guide,developer,css,javascript,minifier,pagespeed" },
    { title: "Unminify JS: Restore Readability of Minified JavaScript", url: "https://freetoolonline.com/guides/en/unminify-js.html", include: !1, tags: "guide,developer,javascript,unminifier,beautifier" },
    { title: "LCD Screen Test", url: "https://freetoolonline.com/guides/en/lcd-screen-test.html", include: !1, tags: "device-test,guide,lcd,screen,test" },
    { title: "LCD Test for Laptop Screens", url: "https://freetoolonline.com/guides/en/lcd-test-laptop.html", include: !1, tags: "device-test,guide,lcd,test,laptop" },
    { title: "Millisecond To Date", url: "https://freetoolonline.com/guides/en/millisecond-to-date.html", include: !1, tags: "utility,guide,millisecond,to,date" },
    { title: "Current Millis", url: "https://freetoolonline.com/guides/en/current-millis.html", include: !1, tags: "utility,guide,current,millis,timestamp,milliseconds" },
    { title: "Zip Unlocker Online", url: "https://freetoolonline.com/guides/en/zip-unlocker-online.html", include: !1, tags: "zip,guide,zip,unlocker,online,remove-zip-password" },
    { title: "Unlock Zip File Online", url: "https://freetoolonline.com/guides/en/unlock-zip-file-online.html", include: !1, tags: "zip,guide,unlock,password,extract" },
    { title: "What We Learned Running Free In-Browser Image Tools", url: "https://freetoolonline.com/guides/en/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html", include: !1, tags: "guide,image-editing,image-conversion" },
    { title: "When to Compress vs Convert an Image", url: "https://freetoolonline.com/guides/en/when-to-compress-vs-convert-an-image.html", include: !1, tags: "guide,image-editing,image-conversion,compress" },
    { title: "How to Compress a Folder for Email", url: "https://freetoolonline.com/guides/en/how-to-compress-a-folder-for-email.html", include: !1, tags: "guide,zip,compress" },
    { title: "Device Test Checklist for Remote Work", url: "https://freetoolonline.com/guides/en/device-test-checklist-for-remote-work.html", include: !1, tags: "guide,device-test,utility" },
    { title: "PDF Editing Ladder", url: "https://freetoolonline.com/guides/en/pdf-editing-ladder.html", include: !1, tags: "guide,pdf" },
    { title: "File Compressor vs ZIP - What to Pick", url: "https://freetoolonline.com/guides/en/file-compressor-vs-zip-what-to-pick.html", include: !1, tags: "guide,zip,compress,image-editing,image-conversion,pdf" },
    { title: "HEIC vs JPG Converter - When Each Wins", url: "https://freetoolonline.com/guides/en/heic-vs-jpg-converter-when-each-wins.html", include: !1, tags: "guide,image-conversion,heic,jpg" },
    { title: "What Is a File Compressor and Which to Use", url: "https://freetoolonline.com/guides/en/what-is-a-file-compressor-and-which-to-use.html", include: !1, tags: "guide,zip,compress,image-editing,image-conversion,pdf" },
    { title: "File Compressor: Pick the Right Tool by File Type", url: "https://freetoolonline.com/guides/en/file-compressor.html", include: !1, tags: "guide,zip,compress,image-editing,image-conversion,pdf,file-compressor" },
    { title: "File to ZIP - Online File Compressor Guide", url: "https://freetoolonline.com/guides/en/file-to-zip.html", include: !1, tags: "guide,zip,compress,file-to-zip" },
    { title: "Online Diff Tool - Compare Two Texts Side-by-Side Guide", url: "https://freetoolonline.com/guides/en/online-diff-tool.html", include: !1, tags: "developer,guide,online,diff,tool,text-diff" },
    { title: "MD5 Hashing in the Browser - What `common::md5::gethash64string` Style Calls Do", url: "https://freetoolonline.com/guides/en/common-md5-gethash64string.html", include: !1, tags: "developer,guide,md5,hash,checksum" },
    { title: "Test LCD: Pick the Right Screen-Test Tool", url: "https://freetoolonline.com/guides/en/test-lcd.html", include: !1, tags: "guide,device-test,lcd,lcd-test,screen-test,dead-pixel" },
    { title: "LCD Test Online: Run a Free Browser-Based Screen Test", url: "https://freetoolonline.com/guides/en/lcd-test-online.html", include: !1, tags: "guide,device-test,lcd,lcd-test,screen-test,dead-pixel" },
    { title: "Screen / Display Test Synonyms", url: "https://freetoolonline.com/guides/en/screen-display-test-synonyms.html", include: !1, tags: "guide,device-test,lcd,screen-test,synonym" },
    { title: "Microphone Test No Sound - Four Fixes", url: "https://freetoolonline.com/guides/en/microphone-test-no-sound-four-fixes.html", include: !1, tags: "guide,device-test,utility,microphone" },
    { title: "How to Compress a File Online (Step by Step)", url: "https://freetoolonline.com/guides/en/how-to-compress-a-file-online.html", include: !1, tags: "guide,zip,compress,image-editing,pdf,video" },
    { title: "Folder To Zip: When and How to Archive a Folder Online", url: "https://freetoolonline.com/guides/en/folder-to-zip.html", include: !1, tags: "guide,zip,compress,folder" },
    { title: "Online Zip File: How to Build a ZIP Archive Online", url: "https://freetoolonline.com/guides/en/online-zip-file.html", include: !1, tags: "guide,zip,compress" },
    { title: "Zip Compressor Online - When It Shrinks a Folder and When It Does Not", url: "https://freetoolonline.com/guides/en/zip-compressor-online.html", include: !1, tags: "guide,zip,compress" },
    { title: "Create Zip File Online (Free ZIP Creator, No Install, No Account)", url: "https://freetoolonline.com/guides/en/create-zip-file-online.html", include: !1, tags: "guide,zip,compress" },
    { title: "Make a ZIP File Online - What the Tool Does and When ZIP Saves Space", url: "https://freetoolonline.com/guides/en/make-zip-file-online.html", include: !1, tags: "guide,zip,compress" },
    { title: "How to Reduce Zip File Size Online (Free)", url: "https://freetoolonline.com/guides/en/how-to-reduce-zip-file-size-online.html", include: !1, tags: "guide,zip,compress" },
    { title: "How to Convert HEIC to JPG Step by Step", url: "https://freetoolonline.com/guides/en/how-to-convert-heic-to-jpg-step-by-step.html", include: !1, tags: "guide,image-conversion,heic,jpg" },
    { title: "What an LCD Test Does (and When to Run One)", url: "https://freetoolonline.com/guides/en/what-an-lcd-test-does-and-when-to-run-one.html", include: !1, tags: "guide,device-test,lcd" },
    { title: "How to Make a Zip File Smaller", url: "https://freetoolonline.com/guides/en/how-to-make-a-zip-file-smaller.html", include: !1, tags: "guide,zip,compress" },
    { title: "Zip File Size Compressor", url: "https://freetoolonline.com/guides/en/zip-file-size-compressor.html", include: !1, tags: "guide,zip,compress,zip-file-size-compressor" },
    { title: "Resize Zip File", url: "https://freetoolonline.com/guides/en/resize-zip-file.html", include: !1, tags: "guide,zip,resize,disambiguation" },
    { title: "How to Compress a Zip to a Smaller Size", url: "https://freetoolonline.com/guides/en/how-to-compress-zip-file-to-smaller-size.html", include: !1, tags: "guide,zip,compress" },
    { title: "How to Compress a ZIP File to 2 MB", url: "https://freetoolonline.com/guides/en/compress-zip-file-to-2mb.html", include: !1, tags: "guide,zip,compress,email-attachment" },
    { title: "How To Compress A Zip File", url: "https://freetoolonline.com/guides/en/how-to-compress-a-zip-file.html", include: !1, tags: "guide,zip,compress" },
    { title: "Zip Folder Online Free", url: "https://freetoolonline.com/guides/en/zip-folder-online-free.html", include: !1, tags: "zip,guide,zip,folder,online" },
    { title: "Online Zip vs 7z vs Rar - Which to Pick", url: "https://freetoolonline.com/guides/en/online-zip-vs-7z-vs-rar-which-to-pick.html", include: !1, tags: "guide,zip,compress" },
    { title: "How to Zip Multiple Files Into One", url: "https://freetoolonline.com/guides/en/how-to-zip-multiple-files-into-one.html", include: !1, tags: "guide,zip,compress" },
    { title: "How to Zip a Folder Online, Step by Step", url: "https://freetoolonline.com/guides/en/how-to-zip-folder-online-step-by-step.html", include: !1, tags: "guide,zip,compress" },
    { title: "Zip vs Zipx vs Rar vs 7z, Explained", url: "https://freetoolonline.com/guides/en/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html", include: !1, tags: "guide,zip,compress" },
    { title: "Recover a Corrupt Zip File - Options", url: "https://freetoolonline.com/guides/en/recover-corrupt-zip-file-options.html", include: !1, tags: "guide,zip" },
    { title: "iPhone Photo Format Explained", url: "https://freetoolonline.com/guides/en/iphone-photo-format-explained-heic-jpg-png-raw.html", include: !1, tags: "guide,image-conversion,heic,jpg" },
    { title: "How to Convert an iPhone Photo to JPG", url: "https://freetoolonline.com/guides/en/how-to-convert-iphone-photo-to-jpg.html", include: !1, tags: "guide,image-conversion,heic,jpg" },
    { title: "JPG vs JPEG - Are They the Same?", url: "https://freetoolonline.com/guides/en/jpg-vs-jpeg-are-they-the-same.html", include: !1, tags: "guide,image-conversion,jpg" },
    { title: "SVG to PNG - When to Rasterize", url: "https://freetoolonline.com/guides/en/svg-to-png-when-to-rasterize-an-svg.html", include: !1, tags: "guide,image-conversion,png,svg" },
    { title: "How to Check Camera Quality on Your Phone", url: "https://freetoolonline.com/guides/en/how-to-check-camera-quality-on-your-phone.html", include: !1, tags: "guide,device-test" },
    { title: "Microphone Test Online - What It Checks", url: "https://freetoolonline.com/guides/en/microphone-test-online-what-it-actually-checks.html", include: !1, tags: "guide,device-test,utility" },
    { title: "Keyboard Tester - Rollover vs Anti-Ghost", url: "https://freetoolonline.com/guides/en/keyboard-tester-online-rollover-vs-anti-ghosting.html", include: !1, tags: "guide,device-test" },
    { title: "How to Test a Keyboard Online Step by Step", url: "https://freetoolonline.com/guides/en/how-to-test-a-keyboard-online-step-by-step.html", include: !1, tags: "guide,device-test,utility" },
    { title: "Extract GIF Frames: PNG or JPG, Which Format?", url: "https://freetoolonline.com/guides/en/extract-gif-frames-png-vs-jpg-which-format.html", include: !1, tags: "guide,image-editing,gif,png,jpg" },
    { title: "GIF Frames vs GIF Frame Rate (FPS) Explained", url: "https://freetoolonline.com/guides/en/gif-frames-extract-vs-frame-rate-fps-explained.html", include: !1, tags: "guide,image-editing,gif,fps" },
    { title: "Why MD5 Cannot Be Decrypted", url: "https://freetoolonline.com/guides/en/why-md5-cannot-be-decrypted.html", include: !1, tags: "guide,developer,md5,hash" },
    { title: "MD5 Alternatives - bcrypt vs Argon2id vs SHA-256", url: "https://freetoolonline.com/guides/en/md5-alternatives-bcrypt-argon2id-sha256-when-each-fits.html", include: !1, tags: "guide,developer,md5,hash,bcrypt,argon2id,sha256" },
    { title: "Camera Test Black Screen: 4 Fixes That Work", url: "https://freetoolonline.com/guides/en/camera-test-shows-black-screen-four-fixes.html", include: !1, tags: "guide,device-test,utility,video" },
    { title: "Text vs Line vs Word vs Git Diff", url: "https://freetoolonline.com/guides/en/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html", include: !1, tags: "guide,developer" },
    { title: "JSON vs YAML vs TOML, Explained", url: "https://freetoolonline.com/guides/en/json-vs-yaml-vs-toml-config-formats-explained.html", include: !1, tags: "guide,developer,json" },
    { title: "CSS Minifier vs Uglifier vs Tree-Shaking", url: "https://freetoolonline.com/guides/en/css-minifier-vs-uglifier-vs-tree-shaking.html", include: !1, tags: "guide,developer,css,minifier,pagespeed" },
    { title: "Base64 - When to Use and When Not To", url: "https://freetoolonline.com/guides/en/base64-when-to-use-and-when-not-to.html", include: !1, tags: "guide,developer" },
    { title: "How to Split a GIF Into Frames", url: "https://freetoolonline.com/guides/en/how-to-split-a-gif-into-frames-for-editing.html", include: !1, tags: "guide,gif,image-conversion,split,image-editing,video" },
    { title: "How to Crop and Rotate an Image", url: "https://freetoolonline.com/guides/en/how-to-crop-and-rotate-an-image.html", include: !1, tags: "guide,image-editing" },
    { title: "Photo Editor vs Graphics App vs Batch", url: "https://freetoolonline.com/guides/en/photo-editor-vs-graphics-app-vs-batch-processor.html", include: !1, tags: "guide,image-editing" },
    { title: "MP4 vs MOV vs MKV - Which Container When", url: "https://freetoolonline.com/guides/en/mp4-vs-mov-vs-mkv-which-container-when.html", include: !1, tags: "guide,video,mp4" },
    { title: "Free Online Tools - No Upload Required", url: "https://freetoolonline.com/guides/en/free-online-tools-that-work-without-uploading-files.html", include: !1, tags: "guide,utility" },
    { title: "QR Code Generator - Best Practices", url: "https://freetoolonline.com/guides/en/qr-code-generator-best-practices.html", include: !1, tags: "guide,utility" },
    { title: "QR Code Error Correction and Scan Failures", url: "https://freetoolonline.com/guides/en/qr-code-error-correction-and-scan-failures.html", include: !1, tags: "guide,utility,qrcode" },
    { title: "Image to Base64 - Embed in HTML/CSS vs Link the Image File", url: "https://freetoolonline.com/guides/en/image-to-base64-embed-in-html-vs-link.html", include: !1, tags: "guide,developer,image-conversion,base64" },
    { title: "How to Test a Touchscreen for Bad Spots", url: "https://freetoolonline.com/guides/en/how-to-test-a-touchscreen-for-bad-spots.html", include: !1, tags: "guide,device-test,lcd-test" },
    { title: "Webcam Mirror vs Flip Explained", url: "https://freetoolonline.com/guides/en/camera-mirror-vs-flip-explained.html", include: !1, tags: "guide,device-test,camera-test" },
    { title: "CSS Unminifier vs Prettier - When to Use Each", url: "https://freetoolonline.com/guides/en/css-unminifier-vs-prettier-when-to-use-each.html", include: !1, tags: "guide,developer,css" },
    { title: "LED Test vs LCD Test - Which Applies to Your Screen?", url: "https://freetoolonline.com/guides/en/led-test-vs-lcd-test-which-applies-to-your-screen.html", include: !1, tags: "guide,device-test,lcd-test" },
    { title: "OLED Test vs LCD Test - What Changes on an OLED Panel", url: "https://freetoolonline.com/guides/en/oled-test-vs-lcd-test-what-changes-on-oled.html", include: !1, tags: "guide,device-test,lcd-test" },
    { title: "How to Compress a JPG for Email Attachment Size Limits", url: "https://freetoolonline.com/guides/en/how-to-compress-a-jpg-for-email-attachment-limits.html", include: !1, tags: "guide,image-conversion,compress,jpg,email" },
    { title: "Microphone Test Levels - What Quiet, Normal, and Peak Mean", url: "https://freetoolonline.com/guides/en/microphone-test-online-quiet-normal-peak-meter.html", include: !1, tags: "guide,device-test,microphone-test,utility" },
    { title: "Camera Test Permission Blocked - How to Allow Camera Access in Your Browser", url: "https://freetoolonline.com/guides/en/camera-test-permission-blocked-how-to-allow-it.html", include: !1, tags: "guide,device-test,camera-test,utility" },
    { title: "Camera Check - What People Mean and Which Tool to Use", url: "https://freetoolonline.com/guides/en/camera-check.html", include: !1, tags: "guide,device-test,camera-test" },
    { title: "Microphone Test Permission Blocked - How to Allow Mic Access in Your Browser", url: "https://freetoolonline.com/guides/en/microphone-test-permission-blocked-how-to-allow-it.html", include: !1, tags: "guide,device-test,microphone-test,utility" },
    { title: "QR Code Content Types - URL vs vCard vs Wi-Fi vs Text - Which to Pick", url: "https://freetoolonline.com/guides/en/qr-code-content-types-url-vcard-wifi-text-which-to-pick.html", include: !1, tags: "guide,utility,qrcode" },
    { title: "EXIF Metadata and Image Compression - What Gets Stripped", url: "https://freetoolonline.com/guides/en/image-compression-and-exif-metadata-what-gets-stripped.html", include: !1, tags: "guide,image-conversion,image-editing,compress,jpg,exif,metadata,privacy" },
    { title: "How to Compress a Folder", url: "https://freetoolonline.com/guides/en/how-to-compress-a-folder.html", include: !1, tags: "guide,zip,compress" },
    { title: "What an LCD Test Actually Checks", url: "https://freetoolonline.com/guides/en/lcd-test-what-it-checks.html", include: !1, tags: "guide,device-test,lcd-test" },
    { title: "LCD Test - Reader-Task Explainer", url: "https://freetoolonline.com/guides/en/lcdtest.html", include: !1, tags: "guide,device-test,lcd-test" },
    { title: "LCD Test vs Display Test vs Monitor Test", url: "https://freetoolonline.com/guides/en/lcd-test-vs-display-test-which-do-you-need.html", include: !1, tags: "guide,device-test,lcd-test" },
    { title: "Screen Test Online vs App - Which Is More Accurate", url: "https://freetoolonline.com/guides/en/screen-test-online-vs-app-which-is-more-accurate.html", include: !1, tags: "guide,device-test,lcd-test" },
    { title: "Screen Test vs Camera Test - Which One Do You Need?", url: "https://freetoolonline.com/guides/en/screen-test-vs-camera-test-pick-the-right-tool.html", include: !1, tags: "guide,device-test,lcd-test,camera-test" },
    { title: "MD5 to Text - Why You Cannot Convert It Back", url: "https://freetoolonline.com/guides/en/md5-to-text-why-you-cannot-convert-back.html", include: !1, tags: "guide,developer,md5,hash" },
    { title: "MD5 Hash Decrypt - When Lookup Works", url: "https://freetoolonline.com/guides/en/md5-hash-decrypt.html", include: !1, tags: "guide,developer,md5,hash,decrypt,rainbow-table" },
    { title: "Before a Video Call - Which Tools to Run", url: "https://freetoolonline.com/guides/en/before-a-video-call-which-tools-to-run.html", include: !1, tags: "guide,device-test,camera-test,lcd-test,microphone-test" },
    { title: "Screen Test for Laptop - 5-Minute Checklist", url: "https://freetoolonline.com/guides/en/screen-test-for-laptop-5-minute-checklist.html", include: !1, tags: "guide,device-test,lcd-test" },
    { title: "FFmpeg Online vs Video Converter - Which to Pick", url: "https://freetoolonline.com/guides/en/ffmpeg-online-vs-video-converter-which-to-pick.html", include: !1, tags: "guide,video,ffmpeg" },
    { title: "ImageMagick Online vs Task-Specific Tools - Which to Pick", url: "https://freetoolonline.com/guides/en/imagemagick-online-vs-task-specific-tools-which-to-pick.html", include: !1, tags: "guide,image-editing,imagemagick,image-conversion" },
    { title: "File Compressor Online: ZIP a Folder vs Compress an Image", url: "https://freetoolonline.com/guides/en/file-compressor-online-when-to-zip-vs-when-to-compress-image.html", include: !1, tags: "guide,zip,image-editing,file-compressor" },
    { title: "How to Extract a File Online - ZIP, RAR, 7z", url: "https://freetoolonline.com/guides/en/how-to-extract-a-file-online-zip-rar-7z.html", include: !1, tags: "guide,zip,extract,unzip,file-extractor" },
    { title: "How to Choose a Compression Level - Quality vs File Size", url: "https://freetoolonline.com/guides/en/how-to-choose-a-compression-level.html", include: !1, tags: "guide,image-editing,compress,jpg,quality" },
    { title: "ZIP Password Types - Strong vs Weak, Explained", url: "https://freetoolonline.com/guides/en/zip-password-types-strong-vs-weak-explained.html", include: !1, tags: "guide,zip,password" },
    { title: "PDF Preflight Online - What It Actually Checks", url: "https://freetoolonline.com/guides/en/pdf-preflight-online-what-it-actually-checks.html", include: !1, tags: "guide,pdf,preflight,validator" },
    { title: "Read and Compare MD5 Hashes Correctly", url: "https://freetoolonline.com/guides/en/read-and-compare-md5-hashes-correctly.html", include: !1, tags: "guide,developer,md5,hash" },
    { title: "How to Tell If a JPG Was Compressed Too Much", url: "https://freetoolonline.com/guides/en/how-to-tell-if-a-jpg-was-compressed-too-much.html", include: !1, tags: "guide,image-conversion,image-editing,jpg,quality" },
    { title: "How to Flatten a PDF - and When to Do It", url: "https://freetoolonline.com/guides/en/how-to-flatten-a-pdf-and-when-to-do-it.html", include: !1, tags: "guide,pdf,flatten,annotations,signatures" },
    { title: "PNG to SVG - When to Vectorize a Raster Image", url: "https://freetoolonline.com/guides/en/png-to-svg-when-to-vectorize-a-raster-image.html", include: !1, tags: "guide,image-conversion,svg,png,vectorize" },
    { title: "Download Link Not Appearing After Conversion - 5 Fixes", url: "https://freetoolonline.com/guides/en/download-link-not-appearing-after-conversion-five-fixes.html", include: !1, tags: "guide,troubleshooting,converter,upload,download" },
    { title: "Why HEIC Won't Open on Windows - Three Quick Fixes", url: "https://freetoolonline.com/guides/en/why-heic-wont-open-on-windows-three-fixes.html", include: !1, tags: "guide,image-conversion,heic,windows" },
    { title: "Zip File Converter - What It Actually Does", url: "https://freetoolonline.com/guides/en/zip-file-converter-what-it-actually-does.html", include: !1, tags: "guide,zip,unzip,compress,archive" },
    { title: "Zip File Converter", url: "https://freetoolonline.com/guides/en/zip-file-converter.html", include: !1, tags: "guide,zip,compress,archive" },
    { title: "HEIC to JPG: What the Converter Actually Does", url: "https://freetoolonline.com/guides/en/heic-to-jpg-claims-what-actually-works.html", include: !1, tags: "guide,image-conversion,heic,jpg,trust" },
    { title: "All Guides - Browser Tool Library", url: "https://freetoolonline.com/guides.html", include: !1, tags: "guide" },
    { title: "Hd Online Video Converter", url: "https://freetoolonline.com/hd-video-converter.html", include: !1, tags: "video,converter" },
    // Cycle 20260521-12 semantic-dedup cleanup: /json-formatter.html entry removed.
    // The existing /developer-tools/json-parser.html ("JSON Parser & Formatter (Tree
    // View)") already covers the same reader intent (validate / format / tree view /
    // copy beautified JSON). 8 aliases (json-formatter + 6 synonyms + chatgpt-json-
    // tree-viewer) retargeted to /developer-tools/json-parser.html via ALIAS_ROUTES.
    // Tool route + CMS + manifest + tool-skill deleted in same commit.
    { title: "Comprimir Carpeta Zip Online Gratis", url: "https://freetoolonline.com/guides/es/compress-folder-to-zip-online-free.html", include: !1, tags: "zip,guide,comprimir,carpeta,zip,es" },
    { title: "Reducir Tamaño Zip Online", url: "https://freetoolonline.com/guides/es/reduce-zip-size-online.html", include: !1, tags: "zip,guide,reducir,tamano,zip,es" },
    { title: "Reduce Zip File Size Online", url: "https://freetoolonline.com/guides/en/reduce-zip-file-size-online.html", include: !1, tags: "zip,guide,reduce,size" },
    { title: "GIF Into Frames", url: "https://freetoolonline.com/guides/en/gif-into-frames.html", include: !1, tags: "image-editing,guide,gif,frames,extract" },
    { title: "GIF to Frames Converter", url: "https://freetoolonline.com/guides/en/gif-to-frames-converter.html", include: !1, tags: "utility,guide,gif,to,frames,converter" },
    { title: "GIF to Frame", url: "https://freetoolonline.com/guides/en/gif-to-frame.html", include: !1, tags: "image-conversion,guide,gif,to,frame" },
    { title: "Kompres File Zip", url: "https://freetoolonline.com/guides/en/kompres-file-zip.html", include: !1, tags: "zip,guide,kompres,file,zip" },
    { title: "Kompres Zip", url: "https://freetoolonline.com/guides/en/kompres-zip.html", include: !1, tags: "zip,guide,kompres,size" },
    { title: "Comprimir Pasta Zipada", url: "https://freetoolonline.com/guides/pt/compress-folder-to-zip.html", include: !1, tags: "zip,guide,comprimir,pasta,zipada,pt" },
    { title: "Zipar Pasta", url: "https://freetoolonline.com/guides/pt/zip-a-folder.html", include: !1, tags: "zip,guide,zipar,pasta,portugues,pt" },
    { title: "Comprimir Arquivo Zip", url: "https://freetoolonline.com/guides/pt/compress-zip-file.html", include: !1, tags: "zip,guide,comprimir,arquivo,portugues,pt" },
    { title: "Compactar Pasta", url: "https://freetoolonline.com/guides/pt/compress-folder.html", include: !1, tags: "zip,guide,compactar,pasta,portugues,pt" },
    { title: "Comprimir ZIP Online", url: "https://freetoolonline.com/guides/pt/compress-zip-online.html", include: !1, tags: "zip,guide,comprimir,zip,online,portugues,pt" },
    { title: "MD5 Password: Hash a Password String and When MD5 Is the Wrong Tool", url: "https://freetoolonline.com/guides/en/md5-password.html", include: !1, tags: "guide,developer,md5,hash,password" },
    { title: "MD5 Decrypter: Hash, Verify, and Reverse-Lookup", url: "https://freetoolonline.com/guides/en/md5-decrypter.html", include: !1, tags: "guide,developer,md5,hash,decrypt,reverse-lookup" },
    { title: "Crop and Rotate Image", url: "https://freetoolonline.com/guides/en/crop-and-rotate-image.html", include: !1, tags: "image-editing,guide,crop,rotate,image" },
    { title: "Compress Folder Online", url: "https://freetoolonline.com/guides/en/compress-folder-online.html", include: !1, tags: "zip,guide,compress,folder,online" },
    { title: "Regex Tester Online", url: "https://freetoolonline.com/developer-tools/regex-tester.html", include: !1, tags: "developer" },
    { title: "Front Camera Test", url: "https://freetoolonline.com/guides/front-camera-test.html", include: !1, tags: "device-test,guide,front,camera,test" },
    { title: "Compress PDF Online Free", url: "https://freetoolonline.com/guides/compress-pdf-online-free.html", include: !1, tags: "pdf,guide,compress,pdf,online" },
    { title: "Split PDF Online Free", url: "https://freetoolonline.com/guides/split-pdf-online-free.html", include: !1, tags: "pdf,guide,split,pdf,online" },
    { title: "To-Do List", url: "https://freetoolonline.com/utility-tools/todo-list.html", include: !1, tags: "utility" },
    { title: "How to Make a To-Do List Online - Free and No Sign-Up", url: "https://freetoolonline.com/guides/how-to-make-a-to-do-list-online.html", include: !1, tags: "utility" },
    { title: "Unit Converter", url: "https://freetoolonline.com/utility-tools/unit-converter.html", include: !1, tags: "utility" },
    { title: "How to Convert Units Online - Free, No Sign-Up", url: "https://freetoolonline.com/guides/how-to-convert-units-online.html", include: !1, tags: "utility" },
    { title: "Color Picker", url: "https://freetoolonline.com/developer-tools/color-picker.html", include: !1, tags: "developer" },
    { title: "How to Pick a Color Online - HEX, RGB, and HSL", url: "https://freetoolonline.com/guides/how-to-pick-a-color-online.html", include: !1, tags: "developer" },
    { title: "Data Visualizer", url: "https://freetoolonline.com/developer-tools/data-visualizer.html", include: !1, tags: "developer" },
    { title: "How to Visualize Data Online - Make a Chart From Your Numbers", url: "https://freetoolonline.com/guides/how-to-visualize-data-online.html", include: !1, tags: "developer" },
    { title: "Screen Recorder", url: "https://freetoolonline.com/device-test-tools/screen-recorder.html", include: !1, tags: "device-test" },
    { title: "How to Record Your Screen Online - Screen, Camera, or Microphone", url: "https://freetoolonline.com/guides/how-to-record-your-screen-online.html", include: !1, tags: "device-test" },
    { title: "Font Generator", url: "https://freetoolonline.com/utility-tools/font-generator.html", include: !1, tags: "utility" },
    { title: "How to Turn Text Into an Image (PNG) Online Free", url: "https://freetoolonline.com/guides/how-to-turn-text-into-an-image-online.html", include: !1, tags: "utility" },
    { title: "Code Editor", url: "https://freetoolonline.com/developer-tools/code-editor.html", include: !1, tags: "developer" },
    { title: "Private AI Chat", url: "https://freetoolonline.com/utility-tools/private-ai-chat.html", include: !1, tags: "utility" },
    { title: "Steganography", url: "https://freetoolonline.com/image-tools/steganography.html", include: !1, tags: "image-editing" },
    { title: "How to Hide a Message in an Image (Steganography, Free + In-Browser)", url: "https://freetoolonline.com/guides/how-to-hide-a-message-in-an-image.html", include: !1, tags: "image-editing" },
    { title: "How to Edit Code Online - Free, In Your Browser", url: "https://freetoolonline.com/guides/how-to-edit-code-online.html", include: !1, tags: "developer" },
    { title: "How to Run a Private AI Chat in Your Browser - Free, No Upload", url: "https://freetoolonline.com/guides/how-to-run-a-private-ai-chat-in-your-browser.html", include: !1, tags: "utility" },
    { title: "Mengecilkan Ukuran Zip Online - Free Guide", url: "https://freetoolonline.com/guides/mengecilkan-ukuran-zip.html", include: !1, tags: "zip" },
    { title: "Video Converter Online Free: Convert to MP4, MOV, MP3 and More", url: "https://freetoolonline.com/guides/video-converter-online-free.html", include: !1, tags: "video" },
    { title: "JSON Formatter Online - Step by Step", url: "https://freetoolonline.com/guides/en/json-formatter-step-by-step.html", include: !1, tags: "guide,developer,json,parser,formatter" },
    { title: "HD Video Converter - Step by Step", url: "https://freetoolonline.com/guides/en/hd-video-converter-step-by-step.html", include: !1, tags: "guide,video,converter,ffmpeg" },
    { title: "MD5 Decode Explained", url: "https://freetoolonline.com/guides/en/md5-decode.html", include: !1, tags: "guide,developer,md5,hash" },
    { title: "Are Online Tools Actually Free?", url: "https://freetoolonline.com/guides/en/tool-free.html", include: !1, tags: "guide,utility,privacy" },
    { title: "Merge PDF Online Free - Combine PDFs in Your Browser", url: "https://freetoolonline.com/guides/merge-pdf-online-free-unlimited.html", include: !1, tags: "pdf" },
    { title: "Crop Image Online Free - Drag, Preset Ratio, or Exact Pixels", url: "https://freetoolonline.com/guides/crop-image-online-free.html", include: !1, tags: "image-editing" },
    { title: "How to Compress an Image to 50KB Online (Free)", url: "https://freetoolonline.com/guides/compress-image-online-to-50kb.html", include: !1, tags: "image-editing" },
    { title: "How to check a laptop screen for dead pixels and backlight bleed", url: "https://freetoolonline.com/guides/cek-layar-laptop.html", include: !1, tags: "utility" },
    { title: "MP4 to GIF Online Free: Trim, Resize, and Export an Animated GIF", url: "https://freetoolonline.com/guides/mp4-to-gif-online-free.html", include: !1, tags: "video" },
    { title: "PDF Filler Form Editor", url: "https://freetoolonline.com/pdf-tools/pdf-filler-form-editor.html", include: !1, tags: "pdf" },
    { title: "Audio Converter", url: "https://freetoolonline.com/image-converter-tools/audio-converter.html", include: !1, tags: "image-conversion" },
    { title: "Code Formatter Beautifier", url: "https://freetoolonline.com/developer-tools/code-formatter-beautifier.html", include: !1, tags: "developer" },
    { title: "Analog Clock Online", url: "https://freetoolonline.com/utility-tools/analog-clock.html", include: !1, tags: "utility" },
    { title: "Digital Clock Online", url: "https://freetoolonline.com/utility-tools/digital-clock.html", include: !1, tags: "utility" },
    { title: "Countdown Timer Online", url: "https://freetoolonline.com/utility-tools/countdown-timer.html", include: !1, tags: "utility" },
    { title: "Pomodoro Timer Online", url: "https://freetoolonline.com/utility-tools/pomodoro-timer.html", include: !1, tags: "utility" },
    { title: "Online Stopwatch", url: "https://freetoolonline.com/utility-tools/stopwatch.html", include: !1, tags: "utility" },
    { title: "Online Alarm Clock", url: "https://freetoolonline.com/utility-tools/online-alarm-clock.html", include: !1, tags: "utility" },
    { title: "Wheel Spinner (Wheel of Names)", url: "https://freetoolonline.com/utility-tools/wheel-spinner.html", include: !1, tags: "utility" },
    { title: "Dice Roller Online", url: "https://freetoolonline.com/utility-tools/dice-roller.html", include: !1, tags: "utility" },
    { title: "Coin Flip Online", url: "https://freetoolonline.com/utility-tools/coin-flip.html", include: !1, tags: "utility" },
    { title: "Random Number Generator", url: "https://freetoolonline.com/utility-tools/random-number-picker.html", include: !1, tags: "utility" },
    { title: "Random List Shuffler", url: "https://freetoolonline.com/utility-tools/name-shuffler.html", include: !1, tags: "utility" },
    { title: "Yes or No Wheel", url: "https://freetoolonline.com/utility-tools/yes-or-no-wheel.html", include: !1, tags: "utility" },
    { title: "Word Counter", url: "https://freetoolonline.com/developer-tools/word-counter.html", include: !1, tags: "developer" },
    { title: "Sort Text Lines", url: "https://freetoolonline.com/developer-tools/sort-text-lines.html", include: !1, tags: "developer" },
    { title: "Remove Duplicate Lines", url: "https://freetoolonline.com/developer-tools/remove-duplicate-lines.html", include: !1, tags: "developer" },
    { title: "Reverse Text", url: "https://freetoolonline.com/developer-tools/reverse-text.html", include: !1, tags: "developer" },
    { title: "Password Generator", url: "https://freetoolonline.com/utility-tools/password-generator.html", include: !1, tags: "utility" },
    { title: "Online Video Trimmer", url: "https://freetoolonline.com/video-tools/video-trimmer.html", include: !1, tags: "video" },
    { title: "Online Voice Recorder", url: "https://freetoolonline.com/utility-tools/voice-recorder.html", include: !1, tags: "utility" },
    { title: "Text to Speech", url: "https://freetoolonline.com/utility-tools/text-to-speech.html", include: !1, tags: "utility" },
    { title: "Speech to Text", url: "https://freetoolonline.com/utility-tools/speech-to-text.html", include: !1, tags: "utility" },
    { title: "Habit Tracker", url: "https://freetoolonline.com/utility-tools/habit-tracker.html", include: !1, tags: "utility" },
    { title: "Grocery List", url: "https://freetoolonline.com/utility-tools/grocery-list.html", include: !1, tags: "utility" },
    { title: "QR Code Scanner", url: "https://freetoolonline.com/utility-tools/qr-code-scanner.html", include: !1, tags: "utility" },
    { title: "Text Repeater", url: "https://freetoolonline.com/developer-tools/text-repeater.html", include: !1, tags: "developer" },
    { title: "Base64 Encoder", url: "https://freetoolonline.com/developer-tools/base64-encoder.html", include: !1, tags: "developer" },
    { title: "URL Decoder", url: "https://freetoolonline.com/developer-tools/url-decoder.html", include: !1, tags: "developer" },
    { title: "Snake Classic", url: "https://freetoolonline.com/games/snake-classic.html", include: !1, tags: "games" },
    { title: "Retro Tank Battle", url: "https://freetoolonline.com/games/retro-tank-battle.html", include: !1, tags: "games" },
    { title: "Garden Defense", url: "https://freetoolonline.com/games/garden-defense.html", include: !1, tags: "games" },
    { title: "Voxel World Builder", url: "https://freetoolonline.com/games/voxel-world-builder.html", include: !1, tags: "games" },
    { title: "Solar System 3D Explorer", url: "https://freetoolonline.com/space-3d/solar-system.html", include: !1, tags: "space-3d" },
    { title: "Black Hole 3D Visualizer", url: "https://freetoolonline.com/space-3d/black-hole.html", include: !1, tags: "space-3d" },
    { title: "Galaxy 3D Simulator", url: "https://freetoolonline.com/space-3d/galaxy.html", include: !1, tags: "space-3d" },
    { title: "Tyrannosaurus rex 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/tyrannosaurus-rex.html", include: !1, tags: "dinosaur-3d" },
    { title: "Mosasaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/mosasaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Velociraptor 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/velociraptor.html", include: !1, tags: "dinosaur-3d" },
    { title: "Triceratops 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/triceratops.html", include: !1, tags: "dinosaur-3d" },
    { title: "Spinosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/spinosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Stegosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/stegosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Brachiosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/brachiosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Ankylosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/ankylosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Parasaurolophus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/parasaurolophus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Lambeosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/lambeosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Pteranodon 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/pteranodon.html", include: !1, tags: "dinosaur-3d" },
    { title: "Allosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/allosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Giganotosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/giganotosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Diplodocus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/diplodocus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Barosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/barosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Amargasaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/amargasaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Apatosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/apatosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Carnotaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/carnotaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Dilophosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/dilophosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Iguanodon 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/iguanodon.html", include: !1, tags: "dinosaur-3d" },
    { title: "Pachycephalosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/pachycephalosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Gallimimus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/gallimimus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Therizinosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/therizinosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Deinonychus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/deinonychus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Utahraptor 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/utahraptor.html", include: !1, tags: "dinosaur-3d" },
    { title: "Baryonyx 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/baryonyx.html", include: !1, tags: "dinosaur-3d" },
    { title: "Plesiosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/plesiosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Pachyrhinosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/pachyrhinosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Ground Sloth (Megatherium) 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/ground-sloth.html", include: !1, tags: "dinosaur-3d" },
    { title: "Ichthyosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/ichthyosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Edmontosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/edmontosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Protoceratops 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/protoceratops.html", include: !1, tags: "dinosaur-3d" },
    { title: "Chasmosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/chasmosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Abelisaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/abelisaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Psittacosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/psittacosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Becklespinax 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/becklespinax.html", include: !1, tags: "dinosaur-3d" },
    { title: "Oviraptor 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/oviraptor.html", include: !1, tags: "dinosaur-3d" },
    { title: "Pinacosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/pinacosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Monolophosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/monolophosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Wendiceratops 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/wendiceratops.html", include: !1, tags: "dinosaur-3d" },
    { title: "Panoplosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/panoplosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Suchomimus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/suchomimus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Ceratosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/ceratosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Brontosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/brontosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Megalosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/megalosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Microraptor 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/microraptor.html", include: !1, tags: "dinosaur-3d" },
    { title: "Majungasaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/majungasaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Cryolophosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/cryolophosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Concavenator 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/concavenator.html", include: !1, tags: "dinosaur-3d" },
    { title: "Albertaceratops 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/albertaceratops.html", include: !1, tags: "dinosaur-3d" },
    { title: "Pentaceratops 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/pentaceratops.html", include: !1, tags: "dinosaur-3d" },
    { title: "Deinocheirus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/deinocheirus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Ostafrikasaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/ostafrikasaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Torvosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/torvosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Sarcosuchus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/sarcosuchus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Postosuchus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/postosuchus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Kentrosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/kentrosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Tsintaosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/tsintaosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Ornithomimus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/ornithomimus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Tylosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/tylosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Gorgosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/gorgosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Dimetrodon 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/dimetrodon.html", include: !1, tags: "dinosaur-3d" },
    { title: "Ichthyovenator 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/ichthyovenator.html", include: !1, tags: "dinosaur-3d" },
    { title: "Ampelosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/ampelosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Seismosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/seismosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Stygimoloch 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/stygimoloch.html", include: !1, tags: "dinosaur-3d" },
    { title: "Avaceratops 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/avaceratops.html", include: !1, tags: "dinosaur-3d" },
    { title: "Titanoboa 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/titanoboa.html", include: !1, tags: "dinosaur-3d" },
    { title: "Moropus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/moropus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Gryponyx 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/gryponyx.html", include: !1, tags: "dinosaur-3d" },
    { title: "Brontotherium 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/brontotherium.html", include: !1, tags: "dinosaur-3d" },
    { title: "Hybodus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/hybodus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Coelophysis 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/coelophysis.html", include: !1, tags: "dinosaur-3d" },
    { title: "Quetzalcoatlus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/quetzalcoatlus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Gigantoraptor 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/gigantoraptor.html", include: !1, tags: "dinosaur-3d" },
    { title: "Tarbosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/tarbosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Titanosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/titanosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Dracovenator 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/dracovenator.html", include: !1, tags: "dinosaur-3d" },
    { title: "Sauropelta 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/sauropelta.html", include: !1, tags: "dinosaur-3d" },
    { title: "Brachylophosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/brachylophosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Shuangmiaosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/shuangmiaosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Alioramus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/alioramus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Doliosauriscus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/doliosauriscus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Compsognathus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/compsognathus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Mamenchisaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/mamenchisaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Troodon 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/troodon.html", include: !1, tags: "dinosaur-3d" },
    { title: "Acrocanthosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/acrocanthosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "Albertosaurus 3D Viewer", url: "https://freetoolonline.com/dinosaur-3d/albertosaurus.html", include: !1, tags: "dinosaur-3d" },
    { title: "AI Background Remover", url: "https://freetoolonline.com/image-tools/background-remover.html", include: !1, tags: "image-editing" },
    { title: "PDF to Text Online: Extract Text Free, No Install", url: "https://freetoolonline.com/guides/pdf-to-text-online-i-love-pdf.html", include: !1, tags: "pdf" },
    { title: "Video to GIF Converter", url: "https://freetoolonline.com/video-tools/video-to-gif.html", include: !1, tags: "video" },
    { title: "Audio Trimmer", url: "https://freetoolonline.com/video-tools/audio-trimmer.html", include: !1, tags: "video" },
    { title: "How to Turn a PNG into a Vector SVG", url: "https://freetoolonline.com/guides/png-to-svg-vector.html", include: !1, tags: "image-conversion" },
    { title: "GPU Test - WebGL Benchmark & Info", url: "https://freetoolonline.com/device-test-tools/gpu-test.html", include: !1, tags: "device-test" },
    { title: "Sky Gates Flight", url: "https://freetoolonline.com/games/sky-gates-flight.html", include: !1, tags: "games" },
    { title: "City Time Machine 3D", url: "https://freetoolonline.com/games/city-time-machine.html", include: !1, tags: "games" },
    { title: "Percentage Calculator", url: "https://freetoolonline.com/utility-tools/percentage-calculator.html", include: !1, tags: "utility" },
    { title: "PNG to WebP Converter", url: "https://freetoolonline.com/image-converter-tools/png-to-webp.html", include: !1, tags: "image-conversion" },
    { title: "JPG to WebP Converter", url: "https://freetoolonline.com/image-converter-tools/jpg-to-webp.html", include: !1, tags: "image-conversion" },
    { title: "WebP to PNG Converter", url: "https://freetoolonline.com/image-converter-tools/webp-to-png.html", include: !1, tags: "image-conversion" },
    { title: "2048 Game - Merge the Numbers Puzzle", url: "https://freetoolonline.com/games/2048-game.html", include: !1, tags: "games" },
    { title: "City Drive Open World 3D", url: "https://freetoolonline.com/games/city-drive-3d.html", include: !1, tags: "games" },
    { title: "Retro Highway Racer", url: "https://freetoolonline.com/games/retro-highway-racer.html", include: !1, tags: "games" },
    { title: "Hover Racing", url: "https://freetoolonline.com/games/hover-racing.html", include: !1, tags: "games" },
    { title: "Retro Arcade Shooter", url: "https://freetoolonline.com/games/retro-arcade-shooter.html", include: !1, tags: "games" },
    { title: "Marble Maze", url: "https://freetoolonline.com/games/marble-maze.html", include: !1, tags: "games" },
    { title: "Globe Siege", url: "https://freetoolonline.com/games/globe-siege.html", include: !1, tags: "games" },
    { title: "Void Trader", url: "https://freetoolonline.com/games/void-trader.html", include: !1, tags: "games" },
    { title: "Layer Flip Platformer", url: "https://freetoolonline.com/games/layer-flip-platformer.html", include: !1, tags: "games" },
    { title: "Violence Town", url: "https://freetoolonline.com/games/violence-town.html", include: !1, tags: "games" },
    { title: "Claudicus Quest", url: "https://freetoolonline.com/games/claudicus-quest.html", include: !1, tags: "games" },
    { title: "Neon Energy Arena", url: "https://freetoolonline.com/games/neon-energy-arena.html", include: !1, tags: "games" },
    { title: "Mono Minefield Grid", url: "https://freetoolonline.com/games/mono-minefield-grid.html", include: !1, tags: "games" },
    { title: "Space Pi Defense", url: "https://freetoolonline.com/games/space-pi-defense.html", include: !1, tags: "games" },
    { title: "Mono Paddle Duel", url: "https://freetoolonline.com/games/mono-paddle-duel.html", include: !1, tags: "games" },
    { title: "Head Soccer Arena", url: "https://freetoolonline.com/games/head-soccer-arena.html", include: !1, tags: "games" },
    { title: "Idle Capitalist Loop", url: "https://freetoolonline.com/games/idle-capitalist-loop.html", include: !1, tags: "games" },
    { title: "Mono Stack Blocks", url: "https://freetoolonline.com/games/mono-stack-blocks.html", include: !1, tags: "games" },
    { title: "Mono Grid Duel", url: "https://freetoolonline.com/games/mono-grid-duel.html", include: !1, tags: "games" },
    { title: "Pipe Rotate Puzzle", url: "https://freetoolonline.com/games/pipe-rotate-puzzle.html", include: !1, tags: "games" },
    { title: "Black Hole Square", url: "https://freetoolonline.com/games/black-hole-square.html", include: !1, tags: "games" },
    { title: "Pixel Park Puzzle", url: "https://freetoolonline.com/games/pixel-park-puzzle.html", include: !1, tags: "games" },
    { title: "Wash The Cat", url: "https://freetoolonline.com/games/wash-the-cat.html", include: !1, tags: "games" },
    { title: "Ritual Catacombs", url: "https://freetoolonline.com/games/ritual-catacombs.html", include: !1, tags: "games" },
    { title: "Potion Brew Shop", url: "https://freetoolonline.com/games/potion-brew-shop.html", include: !1, tags: "games" },
    { title: "Cat Typing Race", url: "https://freetoolonline.com/games/cat-typing-race.html", include: !1, tags: "games" },
    { title: "Unlucky Crossing", url: "https://freetoolonline.com/games/unlucky-crossing.html", include: !1, tags: "games" },
    { title: "Mystic Card Paw", url: "https://freetoolonline.com/games/mystic-card-paw.html", include: !1, tags: "games" },
    { title: "Cat Hop Cloud", url: "https://freetoolonline.com/games/cat-hop-cloud.html", include: !1, tags: "games" },
    { title: "Herd Cats Home", url: "https://freetoolonline.com/games/herd-cats-home.html", include: !1, tags: "games" },
    { title: "Solo Battlefield", url: "https://freetoolonline.com/games/solo-battlefield.html", include: !1, tags: "games" },
    { title: "Feast Night", url: "https://freetoolonline.com/games/feast-night.html", include: !1, tags: "games" },
    { title: "Rune Keeper", url: "https://freetoolonline.com/games/rune-keeper.html", include: !1, tags: "games" },
    { title: "Bounce Back", url: "https://freetoolonline.com/games/bounce-back.html", include: !1, tags: "games" },
    { title: "Classic Pong", url: "https://freetoolonline.com/games/classic-pong.html", include: !1, tags: "games" },
    { title: "Thirteen Hours", url: "https://freetoolonline.com/games/thirteen-hours.html", include: !1, tags: "games" },
    { title: "Quantum Shift", url: "https://freetoolonline.com/games/quantum-shift.html", include: !1, tags: "games" },
    { title: "Rollermaze", url: "https://freetoolonline.com/games/roller-maze-escape.html", include: !1, tags: "games" },
    { title: "Thirteen Case Files", url: "https://freetoolonline.com/games/thirteen-case-files.html", include: !1, tags: "games" },
    { title: "Googol Stopping Game", url: "https://freetoolonline.com/games/googol-stopping-game.html", include: !1, tags: "games" },
    { title: "Bangbang Artillery", url: "https://freetoolonline.com/games/bangbang-artillery.html", include: !1, tags: "games" },
    { title: "Rock Paper Neural", url: "https://freetoolonline.com/games/rock-paper-neural.html", include: !1, tags: "games" },
    { title: "Iso City Sandbox", url: "https://freetoolonline.com/games/iso-city-sandbox.html", include: !1, tags: "games" },
    { title: "Neuro Aim Arena", url: "https://freetoolonline.com/games/neuro-aim-arena.html", include: !1, tags: "games" },
    { title: "Flexbox Froggy", url: "https://freetoolonline.com/games/flexbox-froggy.html", include: !1, tags: "games" },
    { title: "Grid Garden", url: "https://freetoolonline.com/games/grid-garden.html", include: !1, tags: "games" },
    { title: "Mochi and the Midnight Escape", url: "https://freetoolonline.com/games/mochi-midnight-escape.html", include: !1, tags: "games" },
    { title: "Swing Block Tower", url: "https://freetoolonline.com/games/swing-block-tower.html", include: !1, tags: "games" },
    { title: "Star Fuel Battle", url: "https://freetoolonline.com/games/star-fuel-battle.html", include: !1, tags: "games" },
    { title: "Progress Knight", url: "https://freetoolonline.com/games/progress-knight.html", include: !1, tags: "games" },
    { title: "Miami Mice", url: "https://freetoolonline.com/games/miami-mice.html", include: !1, tags: "games" },
    { title: "Orbital Order", url: "https://freetoolonline.com/games/orbital-order.html", include: !1, tags: "games" },
    { title: "Spike Sprint", url: "https://freetoolonline.com/games/spike-sprint.html", include: !1, tags: "games" },
    { title: "Neon Deep Space", url: "https://freetoolonline.com/games/neon-deep-space.html", include: !1, tags: "games" },
    { title: "Vim Master", url: "https://freetoolonline.com/games/vim-master.html", include: !1, tags: "games" },
    { title: "Egg Time Rewind", url: "https://freetoolonline.com/games/egg-time-rewind.html", include: !1, tags: "games" },
    { title: "Seasonal Witchcat", url: "https://freetoolonline.com/games/seasonal-witchcat.html", include: !1, tags: "games" },
    { title: "Desk Cat Coder", url: "https://freetoolonline.com/games/desk-cat-coder.html", include: !1, tags: "games" },
    { title: "Boing Cat Platformer", url: "https://freetoolonline.com/games/boing-cat-platformer.html", include: !1, tags: "games" },
    { title: "DarkLine Paws", url: "https://freetoolonline.com/games/darkline-paws.html", include: !1, tags: "games" },
    { title: "Mor Chess 2", url: "https://freetoolonline.com/games/mor-chess-2.html", include: !1, tags: "games" },
    { title: "Black Cat on a Hot Tin Roof", url: "https://freetoolonline.com/games/black-cat-hot-tin-roof.html", include: !1, tags: "games" },
    { title: "Machine Guard Corps", url: "https://freetoolonline.com/games/machine-guard-corps.html", include: !1, tags: "games" },
    { title: "Asteroid Blaster", url: "https://freetoolonline.com/games/asteroid-blaster.html", include: !1, tags: "games" },
    { title: "Hex Puzzle Blocks", url: "https://freetoolonline.com/games/hex-puzzle-blocks.html", include: !1, tags: "games" },
    { title: "Procedural Horde Game", url: "https://freetoolonline.com/games/procedural-horde-game.html", include: !1, tags: "games" },
    { title: "Chili Blast Shooter", url: "https://freetoolonline.com/games/chili-blast-shooter.html", include: !1, tags: "games" },
    { title: "Pixel Pipeline Reflex", url: "https://freetoolonline.com/games/pixel-pipeline-reflex.html", include: !1, tags: "games" },
    { title: "Medieval Wall Defense", url: "https://freetoolonline.com/games/medieval-wall-defense.html", include: !1, tags: "games" },
    { title: "Cyber Slide Puzzle", url: "https://freetoolonline.com/games/cyber-slide-puzzle.html", include: !1, tags: "games" },
    { title: "Starlight Breaker", url: "https://freetoolonline.com/games/starlight-breaker.html", include: !1, tags: "games" },
    { title: "Night Swarm Survivor", url: "https://freetoolonline.com/games/night-swarm-survivor.html", include: !1, tags: "games" },
    { title: "Neon Tower Rush", url: "https://freetoolonline.com/games/neon-tower-rush.html", include: !1, tags: "games" },
    { title: "Cyber Neon Maze", url: "https://freetoolonline.com/games/cyber-neon-maze.html", include: !1, tags: "games" },
    { title: "Serpentine 3D", url: "https://freetoolonline.com/games/serpentine-3d.html", include: !1, tags: "games" },
    { title: "Neural Particle Life", url: "https://freetoolonline.com/games/neural-particle-life.html", include: !1, tags: "games" },
    { title: "Neon Surge Loop", url: "https://freetoolonline.com/games/neon-surge-loop.html", include: !1, tags: "games" },
    { title: "Arrow Dodge Arena", url: "https://freetoolonline.com/games/arrow-dodge-arena.html", include: !1, tags: "games" },
    { title: "Andromeda Star Shooter", url: "https://freetoolonline.com/games/andromeda-star-shooter.html", include: !1, tags: "games" },
    { title: "Pixel Spike Run", url: "https://freetoolonline.com/games/pixel-spike-run.html", include: !1, tags: "games" },
    { title: "Orbital Radius Shooter", url: "https://freetoolonline.com/games/orbital-radius-shooter.html", include: !1, tags: "games" },
    { title: "One Tap Platformer", url: "https://freetoolonline.com/games/one-tap-platformer.html", include: !1, tags: "games" },
    { title: "Neon Circuit Racer", url: "https://freetoolonline.com/games/neon-circuit-racer.html", include: !1, tags: "games" },
    { title: "Pixel Necromancer", url: "https://freetoolonline.com/games/pixel-necromancer.html", include: !1, tags: "games" },
    { title: "Thirteen Card Duel", url: "https://freetoolonline.com/games/thirteen-card-duel.html", include: !1, tags: "games" },
    { title: "Abyss Signal Diver", url: "https://freetoolonline.com/games/abyss-signal-diver.html", include: !1, tags: "games" },
    { title: "Inferno Soul Walker", url: "https://freetoolonline.com/games/inferno-soul-walker.html", include: !1, tags: "games" },
    { title: "Sketch Turf Battle", url: "https://freetoolonline.com/games/sketch-turf-battle.html", include: !1, tags: "games" },
    { title: "Glow Firefly Cat", url: "https://freetoolonline.com/games/glow-firefly-cat.html", include: !1, tags: "games" },
    { title: "Nova Star Barrage", url: "https://freetoolonline.com/games/nova-star-barrage.html", include: !1, tags: "games" },
    { title: "Pixel Realm RPG", url: "https://freetoolonline.com/games/pixel-realm-rpg.html", include: !1, tags: "games" },
    { title: "Neon Cat Chase", url: "https://freetoolonline.com/games/neon-cat-chase.html", include: !1, tags: "games" },
    { title: "Schematic Factory Line", url: "https://freetoolonline.com/games/schematic-factory-game.html", include: !1, tags: "games" },
    { title: "Space Grid Puzzle", url: "https://freetoolonline.com/games/space-grid-puzzle.html", include: !1, tags: "games" },
    { title: "Thirteen Step Escape", url: "https://freetoolonline.com/games/thirteen-step-escape.html", include: !1, tags: "games" },
    { title: "Floor Thirteen Horror", url: "https://freetoolonline.com/games/floor-thirteen-horror.html", include: !1, tags: "games" },
    { title: "Voxel FPS Arena", url: "https://freetoolonline.com/games/voxel-fps-arena.html", include: !1, tags: "games" },
    { title: "Lightning Math Battle", url: "https://freetoolonline.com/games/lightning-math-battle.html", include: !1, tags: "games" },
    { title: "Precision Bounce Loop", url: "https://freetoolonline.com/games/precision-bounce-loop.html", include: !1, tags: "games" },
    { title: "Vim Motion Academy", url: "https://freetoolonline.com/games/vim-motion-academy.html", include: !1, tags: "games" },
    { title: "Gravity Orbit Golf", url: "https://freetoolonline.com/games/gravity-orbit-golf.html", include: !1, tags: "games" },
    { title: "Species Life Battle", url: "https://freetoolonline.com/games/species-life-battle.html", include: !1, tags: "games" },
    { title: "Earth 3D Globe - Live Day & Night Map", url: "https://freetoolonline.com/space-3d/earth-3d-globe.html", include: !1, tags: "space-3d" },
    { title: "Moon Phases 3D Explorer", url: "https://freetoolonline.com/space-3d/moon-phases-3d.html", include: !1, tags: "space-3d" },
    { title: "Saturn Rings 3D Explorer", url: "https://freetoolonline.com/space-3d/saturn-rings.html", include: !1, tags: "space-3d" },
    { title: "Kepler Orbits 3D Explorer", url: "https://freetoolonline.com/space-3d/kepler-orbits.html", include: !1, tags: "space-3d" },
    { title: "Moon Calendar 3D Explorer", url: "https://freetoolonline.com/space-3d/moon-calendar-3d.html", include: !1, tags: "space-3d" },
    { title: "ISS Orbit Tracker 3D Explorer", url: "https://freetoolonline.com/space-3d/iss-orbit-tracker.html", include: !1, tags: "space-3d" },
    { title: "Lunar Eclipse 3D Explorer", url: "https://freetoolonline.com/space-3d/lunar-eclipse.html", include: !1, tags: "space-3d" },
    { title: "Planet Size Comparison 3D Explorer", url: "https://freetoolonline.com/space-3d/planet-size-comparison.html", include: !1, tags: "space-3d" },
    { title: "Star Lifecycle 3D Explorer", url: "https://freetoolonline.com/space-3d/star-lifecycle.html", include: !1, tags: "space-3d" },
    { title: "Exoplanet Transit 3D Explorer", url: "https://freetoolonline.com/space-3d/exoplanet-transit.html", include: !1, tags: "space-3d" },
    { title: "Tidal Locking 3D Explorer", url: "https://freetoolonline.com/space-3d/tidal-locking.html", include: !1, tags: "space-3d" },
    { title: "Asteroid Belt 3D Explorer", url: "https://freetoolonline.com/space-3d/asteroid-belt.html", include: !1, tags: "space-3d" },
    { title: "Comet Orbit 3D Explorer", url: "https://freetoolonline.com/space-3d/comet-orbit.html", include: !1, tags: "space-3d" },
    { title: "Seasons Earth 3D Explorer", url: "https://freetoolonline.com/space-3d/seasons-earth.html", include: !1, tags: "space-3d" },
    { title: "Retrograde Motion 3D Explorer", url: "https://freetoolonline.com/space-3d/retrograde-motion.html", include: !1, tags: "space-3d" },
    { title: "Milky Way Map 3D Explorer", url: "https://freetoolonline.com/space-3d/milky-way-map.html", include: !1, tags: "space-3d" },
    { title: "Lagrange Points 3D Explorer", url: "https://freetoolonline.com/space-3d/lagrange-points.html", include: !1, tags: "space-3d" },
    { title: "Neutron Star Pulsar 3D Explorer", url: "https://freetoolonline.com/space-3d/neutron-star-pulsar.html", include: !1, tags: "space-3d" },
    { title: "Gas Giant Atmosphere 3D Explorer", url: "https://freetoolonline.com/space-3d/gas-giant-atmosphere.html", include: !1, tags: "space-3d" },
    { title: "Orbital Resonance 3D Explorer", url: "https://freetoolonline.com/space-3d/orbital-resonance.html", include: !1, tags: "space-3d" },
    { title: "Stellar Magnitude Scale Explorer", url: "https://freetoolonline.com/space-3d/stellar-magnitude.html", include: !1, tags: "space-3d" },
    { title: "Parallax Distance 3D Explorer", url: "https://freetoolonline.com/space-3d/parallax-distance.html", include: !1, tags: "space-3d" },
    { title: "Ecliptic Zodiac 3D Explorer", url: "https://freetoolonline.com/space-3d/ecliptic-zodiac.html", include: !1, tags: "space-3d" },
    { title: "Gravity Well 3D Explorer", url: "https://freetoolonline.com/space-3d/gravity-well.html", include: !1, tags: "space-3d" },
    { title: "Constellation Sphere 3D Explorer", url: "https://freetoolonline.com/space-3d/constellation-sphere.html", include: !1, tags: "space-3d" },
    { title: "Black Body Radiation 3D Explorer", url: "https://freetoolonline.com/space-3d/black-body-radiation.html", include: !1, tags: "space-3d" },
    { title: "Sidereal vs Solar Day 3D Explorer", url: "https://freetoolonline.com/space-3d/sidereal-vs-solar-day.html", include: !1, tags: "space-3d" },
    { title: "Aurora 3D Explorer", url: "https://freetoolonline.com/space-3d/aurora.html", include: !1, tags: "space-3d" },
    { title: "Mars Terrain Explorer", url: "https://freetoolonline.com/space-3d/mars-terrain.html", include: !1, tags: "space-3d" },
    { title: "Redshift and Doppler Shift 3D Explorer", url: "https://freetoolonline.com/space-3d/redshift-doppler.html", include: !1, tags: "space-3d" },
    { title: "Hohmann Transfer 3D Explorer", url: "https://freetoolonline.com/space-3d/hohmann-transfer.html", include: !1, tags: "space-3d" },
    { title: "Binary Star System 3D Explorer", url: "https://freetoolonline.com/space-3d/binary-star-system.html", include: !1, tags: "space-3d" },
    { title: "Galilean Moons 3D Explorer", url: "https://freetoolonline.com/space-3d/galilean-moons.html", include: !1, tags: "space-3d" },
    { title: "Escape Velocity 3D Explorer", url: "https://freetoolonline.com/space-3d/escape-velocity.html", include: !1, tags: "space-3d" },
    { title: "Habitable Zone 3D Explorer", url: "https://freetoolonline.com/space-3d/habitable-zone.html", include: !1, tags: "space-3d" },
    { title: "Tides: Earth-Moon 3D Explorer", url: "https://freetoolonline.com/space-3d/tides-earth-moon.html", include: !1, tags: "space-3d" },
    { title: "Solar Wind Heliosphere 3D Explorer", url: "https://freetoolonline.com/space-3d/solar-wind-heliosphere.html", include: !1, tags: "space-3d" },
    { title: "Cosmic Distance Ladder 3D Explorer", url: "https://freetoolonline.com/space-3d/cosmic-distance-ladder.html", include: !1, tags: "space-3d" },
    { title: "Precession of the Equinoxes 3D Explorer", url: "https://freetoolonline.com/space-3d/precession-equinoxes.html", include: !1, tags: "space-3d" },
    { title: "HR Diagram 3D Explorer", url: "https://freetoolonline.com/space-3d/hr-diagram.html", include: !1, tags: "space-3d" },
    { title: "Sun Structure 3D Explorer", url: "https://freetoolonline.com/space-3d/sun-structure.html", include: !1, tags: "space-3d" },
    { title: "Orbital Velocity 3D Explorer", url: "https://freetoolonline.com/space-3d/orbital-velocity.html", include: !1, tags: "space-3d" },
    { title: "Earth Magnetosphere 3D Explorer", url: "https://freetoolonline.com/space-3d/earth-magnetosphere.html", include: !1, tags: "space-3d" },
    { title: "Sunspot Activity 3D Explorer", url: "https://freetoolonline.com/space-3d/sunspot-cycle.html", include: !1, tags: "space-3d" },
    { title: "Uranus Tilt 3D Explorer", url: "https://freetoolonline.com/space-3d/uranus-tilt.html", include: !1, tags: "space-3d" },
    { title: "Roche Limit 3D Explorer", url: "https://freetoolonline.com/space-3d/roche-limit.html", include: !1, tags: "space-3d" },
    { title: "Solar Analemma 3D Explorer", url: "https://freetoolonline.com/space-3d/solar-analemma.html", include: !1, tags: "space-3d" },
    { title: "Saturn Hexagon 3D Explorer", url: "https://freetoolonline.com/space-3d/saturn-hexagon.html", include: !1, tags: "space-3d" },
    { title: "Supernova Remnant 3D Explorer", url: "https://freetoolonline.com/space-3d/supernova-remnant.html", include: !1, tags: "space-3d" },
    { title: "Planetary Nebula 3D Explorer", url: "https://freetoolonline.com/space-3d/planetary-nebula.html", include: !1, tags: "space-3d" },
    { title: "Venus Retrograde Rotation 3D Explorer", url: "https://freetoolonline.com/space-3d/venus-retrograde-rotation.html", include: !1, tags: "space-3d" },
    { title: "Gravitational Slingshot 3D Explorer", url: "https://freetoolonline.com/space-3d/gravitational-slingshot.html", include: !1, tags: "space-3d" },
    { title: "Three-Body Problem 3D Explorer", url: "https://freetoolonline.com/space-3d/three-body-problem.html", include: !1, tags: "space-3d" },
    { title: "Meteor Shower Radiant 3D Explorer", url: "https://freetoolonline.com/space-3d/meteor-shower-radiant.html", include: !1, tags: "space-3d" },
    { title: "Kuiper Belt and Oort Cloud 3D Explorer", url: "https://freetoolonline.com/space-3d/kuiper-belt-oort-cloud.html", include: !1, tags: "space-3d" },
    { title: "Jupiter Magnetosphere 3D Explorer", url: "https://freetoolonline.com/space-3d/jupiter-magnetosphere.html", include: !1, tags: "space-3d" },
    { title: "Light Cone 3D Explorer", url: "https://freetoolonline.com/space-3d/light-cone.html", include: !1, tags: "space-3d" },
    { title: "Spacetime Curvature 3D Explorer", url: "https://freetoolonline.com/space-3d/spacetime-curvature.html", include: !1, tags: "space-3d" },
    { title: "Gravitational Waves 3D Explorer", url: "https://freetoolonline.com/space-3d/gravitational-waves.html", include: !1, tags: "space-3d" },
    { title: "Hill Sphere 3D Explorer", url: "https://freetoolonline.com/space-3d/hill-sphere.html", include: !1, tags: "space-3d" },
    { title: "Cepheid Variable Star 3D Explorer", url: "https://freetoolonline.com/space-3d/cepheid-variable.html", include: !1, tags: "space-3d" },
    { title: "Expanding Universe 3D Explorer", url: "https://freetoolonline.com/space-3d/expanding-universe.html", include: !1, tags: "space-3d" },
    { title: "Doppler Radial Velocity 3D Explorer", url: "https://freetoolonline.com/space-3d/doppler-radial-velocity.html", include: !1, tags: "space-3d" },
    { title: "Star Trails 3D Explorer", url: "https://freetoolonline.com/space-3d/star-trails.html", include: !1, tags: "space-3d" },
    { title: "Tidal Heating 3D Explorer", url: "https://freetoolonline.com/space-3d/tidal-heating.html", include: !1, tags: "space-3d" },
    { title: "Planetary Rings Comparison 3D Explorer", url: "https://freetoolonline.com/space-3d/planetary-rings-comparison.html", include: !1, tags: "space-3d" },
    { title: "N-Body Sandbox 3D Explorer", url: "https://freetoolonline.com/space-3d/n-body-sandbox.html", include: !1, tags: "space-3d" },
    { title: "Celestial Coordinate Systems 3D Explorer", url: "https://freetoolonline.com/space-3d/coordinate-systems-sky.html", include: !1, tags: "space-3d" },
    { title: "Cosmic Microwave Background 3D Explorer", url: "https://freetoolonline.com/space-3d/cmb-sky.html", include: !1, tags: "space-3d" },
    { title: "Stellar Nucleosynthesis 3D Explorer", url: "https://freetoolonline.com/space-3d/stellar-nucleosynthesis.html", include: !1, tags: "space-3d" },
    { title: "Moon Libration 3D Explorer", url: "https://freetoolonline.com/space-3d/moon-libration.html", include: !1, tags: "space-3d" },
    { title: "Tidal Disruption Event 3D Explorer", url: "https://freetoolonline.com/space-3d/tidal-disruption-event.html", include: !1, tags: "space-3d" },
    { title: "Sunspot Magnetic Loops 3D Explorer", url: "https://freetoolonline.com/space-3d/sunspot-magnetic-loops.html", include: !1, tags: "space-3d" },
    { title: "Gravitational Redshift 3D Explorer", url: "https://freetoolonline.com/space-3d/gravitational-redshift.html", include: !1, tags: "space-3d" },
    { title: "Cosmic Ray Air Shower 3D Explorer", url: "https://freetoolonline.com/space-3d/cosmic-ray-shower.html", include: !1, tags: "space-3d" },
    { title: "Stellar Parallax 3D Explorer", url: "https://freetoolonline.com/space-3d/stellar-parallax.html", include: !1, tags: "space-3d" },
    { title: "Einstein Ring 3D Explorer", url: "https://freetoolonline.com/space-3d/einstein-ring.html", include: !1, tags: "space-3d" },
    { title: "Galaxy Tidal Tails 3D Explorer", url: "https://freetoolonline.com/space-3d/tidal-tails.html", include: !1, tags: "space-3d" },
    { title: "Jupiter Trojan Asteroids 3D Explorer", url: "https://freetoolonline.com/space-3d/trojan-asteroids.html", include: !1, tags: "space-3d" },
    { title: "Solar Granulation 3D Explorer", url: "https://freetoolonline.com/space-3d/solar-granulation.html", include: !1, tags: "space-3d" },
    { title: "Kirkwood Gaps 3D Explorer", url: "https://freetoolonline.com/space-3d/kirkwood-gaps.html", include: !1, tags: "space-3d" },
    { title: "Equation of Time 3D Explorer", url: "https://freetoolonline.com/space-3d/equation-of-time.html", include: !1, tags: "space-3d" },
    { title: "Zodiacal Light 3D Explorer", url: "https://freetoolonline.com/space-3d/zodiacal-light.html", include: !1, tags: "space-3d" },
    { title: "Stellar Proper Motion 3D Explorer", url: "https://freetoolonline.com/space-3d/stellar-proper-motion.html", include: !1, tags: "space-3d" },
    { title: "Aberration of Starlight 3D Explorer", url: "https://freetoolonline.com/space-3d/aberration-of-starlight.html", include: !1, tags: "space-3d" },
    { title: "Planetary Conjunction 3D Explorer", url: "https://freetoolonline.com/space-3d/planetary-conjunction.html", include: !1, tags: "space-3d" },
    { title: "Planetary Oblateness 3D Explorer", url: "https://freetoolonline.com/space-3d/planetary-oblateness.html", include: !1, tags: "space-3d" },
    { title: "Coriolis Effect 3D Explorer", url: "https://freetoolonline.com/space-3d/coriolis-effect.html", include: !1, tags: "space-3d" },
    { title: "Earthshine 3D Explorer", url: "https://freetoolonline.com/space-3d/earthshine.html", include: !1, tags: "space-3d" },
    { title: "Roche Lobe Binary 3D Explorer", url: "https://freetoolonline.com/space-3d/roche-lobe-binary.html", include: !1, tags: "space-3d" },
    { title: "Foucault Pendulum 3D Explorer", url: "https://freetoolonline.com/space-3d/foucault-pendulum.html", include: !1, tags: "space-3d" },
    { title: "Magnetic Reconnection 3D Explorer", url: "https://freetoolonline.com/space-3d/magnetic-reconnection.html", include: !1, tags: "space-3d" },
    { title: "Apsidal Precession 3D Explorer", url: "https://freetoolonline.com/space-3d/apsidal-precession.html", include: !1, tags: "space-3d" },
    { title: "Synodic Lunar Month 3D Explorer", url: "https://freetoolonline.com/space-3d/synodic-lunar-month.html", include: !1, tags: "space-3d" },
    { title: "Earth-Moon Barycenter 3D Explorer", url: "https://freetoolonline.com/space-3d/earth-moon-barycenter.html", include: !1, tags: "space-3d" },
    { title: "Lunar Nodes and Eclipse Seasons 3D Explorer", url: "https://freetoolonline.com/space-3d/lunar-nodes-eclipse-seasons.html", include: !1, tags: "space-3d" },
    { title: "Venus Phases (Galileo) 3D Explorer", url: "https://freetoolonline.com/space-3d/venus-phases-galileo.html", include: !1, tags: "space-3d" },
    { title: "Shepherd Moons 3D Explorer", url: "https://freetoolonline.com/space-3d/shepherd-moons.html", include: !1, tags: "space-3d" },
    { title: "Comet Tail Types 3D Explorer", url: "https://freetoolonline.com/space-3d/comet-tail-types.html", include: !1, tags: "space-3d" },
    { title: "Protoplanetary Disk 3D Explorer", url: "https://freetoolonline.com/space-3d/protoplanetary-disk.html", include: !1, tags: "space-3d" },
    { title: "Lunar Occultation 3D Explorer", url: "https://freetoolonline.com/space-3d/occultation-lunar.html", include: !1, tags: "space-3d" },
    { title: "Van Allen Belts 3D Explorer", url: "https://freetoolonline.com/space-3d/van-allen-belts.html", include: !1, tags: "space-3d" },
    { title: "Circumbinary Planet 3D Explorer", url: "https://freetoolonline.com/space-3d/circumbinary-planet.html", include: !1, tags: "space-3d" },
    { title: "Debris Disk 3D Explorer", url: "https://freetoolonline.com/space-3d/debris-disk.html", include: !1, tags: "space-3d" },
    { title: "Brown Dwarf 3D Explorer", url: "https://freetoolonline.com/space-3d/brown-dwarf.html", include: !1, tags: "space-3d" },
    { title: "Kilonova 3D Explorer", url: "https://freetoolonline.com/space-3d/kilonova.html", include: !1, tags: "space-3d" },
    { title: "Carrington Event 3D Explorer", url: "https://freetoolonline.com/space-3d/carrington-event.html", include: !1, tags: "space-3d" },
    { title: "TRAPPIST-1 3D Explorer", url: "https://freetoolonline.com/space-3d/trappist-1.html", include: !1, tags: "space-3d" },
    { title: "Tabby's Star 3D Explorer", url: "https://freetoolonline.com/space-3d/tabbys-star.html", include: !1, tags: "space-3d" },
    { title: "'Oumuamua 3D Explorer", url: "https://freetoolonline.com/space-3d/oumuamua.html", include: !1, tags: "space-3d" },
    { title: "Betelgeuse's Great Dimming 3D Explorer", url: "https://freetoolonline.com/space-3d/betelgeuse-dimming.html", include: !1, tags: "space-3d" },
    { title: "Pillars of Creation 3D Explorer", url: "https://freetoolonline.com/space-3d/pillars-of-creation.html", include: !1, tags: "space-3d" },
    { title: "Pale Blue Dot 3D Explorer", url: "https://freetoolonline.com/space-3d/pale-blue-dot.html", include: !1, tags: "space-3d" },
    { title: "Wow! Signal 3D Explorer", url: "https://freetoolonline.com/space-3d/wow-signal.html", include: !1, tags: "space-3d" },
    { title: "Chelyabinsk Meteor 3D Explorer", url: "https://freetoolonline.com/space-3d/chelyabinsk-meteor.html", include: !1, tags: "space-3d" },
    { title: "Enceladus Geysers 3D Explorer", url: "https://freetoolonline.com/space-3d/enceladus-geysers.html", include: !1, tags: "space-3d" },
    { title: "Phobos Stickney Crater 3D Explorer", url: "https://freetoolonline.com/space-3d/phobos-stickney.html", include: !1, tags: "space-3d" },
    { title: "Vesta Rheasilvia Basin 3D Explorer", url: "https://freetoolonline.com/space-3d/vesta-rheasilvia.html", include: !1, tags: "space-3d" },
    { title: "Miranda Verona Rupes 3D Explorer", url: "https://freetoolonline.com/space-3d/miranda-verona-rupes.html", include: !1, tags: "space-3d" },
    { title: "Charon Serenity Chasma 3D Explorer", url: "https://freetoolonline.com/space-3d/charon-serenity-chasma.html", include: !1, tags: "space-3d" },
    { title: "Iapetus Equatorial Ridge 3D Explorer", url: "https://freetoolonline.com/space-3d/iapetus-equatorial-ridge.html", include: !1, tags: "space-3d" },
    { title: "Mimas Herschel Crater 3D Explorer", url: "https://freetoolonline.com/space-3d/mimas-herschel.html", include: !1, tags: "space-3d" },
    { title: "Hyperion Sponge Moon 3D Explorer", url: "https://freetoolonline.com/space-3d/hyperion-sponge.html", include: !1, tags: "space-3d" },
    { title: "Triton Cantaloupe Terrain 3D Explorer", url: "https://freetoolonline.com/space-3d/triton-cantaloupe.html", include: !1, tags: "space-3d" },
    { title: "Haumea Elongated Dwarf Planet 3D Explorer", url: "https://freetoolonline.com/space-3d/haumea-elongated.html", include: !1, tags: "space-3d" },
    { title: "Wormhole (Einstein-Rosen Bridge) 3D Explorer", url: "https://freetoolonline.com/space-3d/wormhole.html", include: !1, tags: "space-3d" },
    { title: "Satellite Orbit Classes 3D Explorer", url: "https://freetoolonline.com/space-3d/satellite-orbit-classes.html", include: !1, tags: "space-3d" },
    { title: "Dwarf Planet Size Comparison 3D Explorer", url: "https://freetoolonline.com/space-3d/dwarf-planet-comparison.html", include: !1, tags: "space-3d" },
    { title: "Sagittarius A* Star Orbit 3D Explorer", url: "https://freetoolonline.com/space-3d/sagittarius-a-star.html", include: !1, tags: "space-3d" },
    { title: "Impact Crater Formation 3D Explorer", url: "https://freetoolonline.com/space-3d/impact-crater-formation.html", include: !1, tags: "space-3d" },
    { title: "Moon Formation Giant Impact 3D Explorer", url: "https://freetoolonline.com/space-3d/moon-formation-giant-impact.html", include: !1, tags: "space-3d" },
    { title: "Dark Matter Rotation Curves 3D Explorer", url: "https://freetoolonline.com/space-3d/dark-matter-rotation-curves.html", include: !1, tags: "space-3d" },
    { title: "Axial Tilt Comparison 3D Explorer", url: "https://freetoolonline.com/space-3d/axial-tilt-comparison.html", include: !1, tags: "space-3d" },
    { title: "Milky Way - Andromeda Collision 3D Explorer", url: "https://freetoolonline.com/space-3d/andromeda-collision.html", include: !1, tags: "space-3d" },
    { title: "Geocentric vs Heliocentric 3D Explorer", url: "https://freetoolonline.com/space-3d/geocentric-vs-heliocentric.html", include: !1, tags: "space-3d" },
    { title: "Solar Eclipse 3D Explorer", url: "https://freetoolonline.com/space-3d/solar-eclipse.html", include: !1, tags: "space-3d" },
    { title: "Linux Online - Run Linux in Your Browser (Terminal & Desktop)", url: "https://freetoolonline.com/utility-tools/linux-online.html", include: !1, tags: "utility" },
    { title: "Retro FPS Online - Play a Classic Shooter in Your Browser (Freedoom)", url: "https://freetoolonline.com/games/retro-fps-online.html", include: !1, tags: "games" },
    // news-loop (2026-07-08): dated, source-cited updates. tags include the
    // affected cluster(s) so the article surfaces via tag-match on related
    // tool/guide pages, plus a bare "news" tag for future cross-links.
    { title: "JPEG XL Returns to Chrome and Firefox - What Changes for You", url: "https://freetoolonline.com/news/jpeg-xl-returns-chrome-firefox.html", include: !1, tags: "news,image-conversion,jpg,heic,webp" },
    { title: "WebP to JPG Converter", url: "https://freetoolonline.com/image-converter-tools/webp-to-jpg.html", include: !1, tags: "image-conversion" },
    { title: "Image to WebP Converter", url: "https://freetoolonline.com/image-converter-tools/image-to-webp.html", include: !1, tags: "image-conversion" },
    { title: "PNG to JPG Converter", url: "https://freetoolonline.com/image-converter-tools/png-to-jpg.html", include: !1, tags: "image-conversion" },
    { title: "Expense Tracker", url: "https://freetoolonline.com/utility-tools/expense-tracker.html", include: !1, tags: "utility" },
    { title: "Random Name Picker", url: "https://freetoolonline.com/utility-tools/random-name-picker.html", include: !1, tags: "utility" },
    { title: "Character Counter", url: "https://freetoolonline.com/developer-tools/character-counter.html", include: !1, tags: "developer" },
    { title: "Find and Replace Text", url: "https://freetoolonline.com/developer-tools/find-and-replace-text.html", include: !1, tags: "developer" },
    { title: "Image Format Converter", url: "https://freetoolonline.com/image-converter-tools/image-format-converter.html", include: !1, tags: "image-conversion" },
    { title: "Remove Audio from Video", url: "https://freetoolonline.com/video-tools/strip-audio-from-video.html", include: !1, tags: "video" },
    { title: "Rotate PDF", url: "https://freetoolonline.com/pdf-tools/rotate-pdf.html", include: !1, tags: "pdf" },
    { title: "Delete PDF Pages", url: "https://freetoolonline.com/pdf-tools/delete-pdf-pages.html", include: !1, tags: "pdf" },
    { title: "Add Watermark to PDF", url: "https://freetoolonline.com/pdf-tools/add-watermark-to-pdf.html", include: !1, tags: "pdf" },
    { title: "BMI Calculator", url: "https://freetoolonline.com/utility-tools/bmi-calculator.html", include: !1, tags: "utility" },
    { title: "Tip Calculator", url: "https://freetoolonline.com/utility-tools/tip-calculator.html", include: !1, tags: "utility" },
    { title: "Loan Calculator", url: "https://freetoolonline.com/utility-tools/loan-calculator.html", include: !1, tags: "utility" },
    { title: "Date Difference Calculator", url: "https://freetoolonline.com/utility-tools/date-difference-calculator.html", include: !1, tags: "utility" },
    { title: "Video Compressor", url: "https://freetoolonline.com/video-tools/video-compressor.html", include: !1, tags: "video" },
    { title: "Video Splitter", url: "https://freetoolonline.com/video-tools/video-splitter.html", include: !1, tags: "video" },
    { title: "Video Merger", url: "https://freetoolonline.com/video-tools/video-merger.html", include: !1, tags: "video" },
    { title: "Notepad / Notes", url: "https://freetoolonline.com/utility-tools/note-taking-app.html", include: !1, tags: "utility" },
    { title: "File Encryption Tool", url: "https://freetoolonline.com/developer-tools/file-encryption-tool.html", include: !1, tags: "developer" },
    { title: "Flashcards (Spaced Repetition)", url: "https://freetoolonline.com/utility-tools/flashcards-maker.html", include: !1, tags: "utility" },
    { title: "Document Scanner (to PDF)", url: "https://freetoolonline.com/image-tools/document-scanner.html", include: !1, tags: "image-editing" },
    { title: "JWT Decoder", url: "https://freetoolonline.com/developer-tools/jwt-decoder.html", include: !1, tags: "developer" },
    { title: "UUID Generator", url: "https://freetoolonline.com/developer-tools/uuid-generator.html", include: !1, tags: "developer" },
    { title: "Hash Generator (SHA-256/512)", url: "https://freetoolonline.com/developer-tools/hash-generator.html", include: !1, tags: "developer" },
    { title: "Text Case Converter", url: "https://freetoolonline.com/developer-tools/case-converter.html", include: !1, tags: "developer" },
    { title: "Image to Text (OCR)", url: "https://freetoolonline.com/image-tools/image-to-text-ocr.html", include: !1, tags: "image-editing" },
    { title: "Passport Photo Maker", url: "https://freetoolonline.com/image-tools/passport-photo-maker.html", include: !1, tags: "image-editing" },
    { title: "Age Calculator", url: "https://freetoolonline.com/utility-tools/age-calculator.html", include: !1, tags: "utility" },
    { title: "AI Photo Restoration", url: "https://freetoolonline.com/image-tools/photo-restoration.html", include: !1, tags: "image-editing" },
    { title: "JSON to TypeScript Interface Generator", url: "https://freetoolonline.com/developer-tools/json-to-typescript.html", include: !1, tags: "developer" },
    { title: "Markdown to HTML Previewer", url: "https://freetoolonline.com/developer-tools/markdown-to-html.html", include: !1, tags: "developer" },
    { title: "HTML to Markdown Converter", url: "https://freetoolonline.com/developer-tools/html-to-markdown.html", include: !1, tags: "developer" },
    { title: "Color Contrast Checker (WCAG)", url: "https://freetoolonline.com/developer-tools/wcag-contrast-checker.html", include: !1, tags: "developer" },
    { title: "SVG Optimizer & Minifier", url: "https://freetoolonline.com/developer-tools/svg-optimizer.html", include: !1, tags: "developer" },
    { title: "Speaker & Audio Channel Test", url: "https://freetoolonline.com/device-test-tools/speaker-test.html", include: !1, tags: "device-test" },
    { title: "Image EXIF Metadata Viewer", url: "https://freetoolonline.com/image-tools/image-exif-viewer.html", include: !1, tags: "image-editing" },
  ],
    currentTitle = $.trim($(".navPageName").text()),
    allCurrentTags = "",
    isAddedAll = !1,
    relatedToolsRoot = $(".relatedTools"),
    hasSsrRelatedTools = relatedToolsRoot && relatedToolsRoot.children().length > 0,
    currentRouteKey = (function () {
      try {
        var t = window.location.pathname || "",
          e = t.split("/"),
          l = e[e.length - 1] || "";
        return "" === l || "index.html" === l ? "/" : "/" + l.replace(/^\//, "");
      } catch (t) {
        return "";
      }
    })();

  function routeKeyFromUrl(t) {
    try {
      var e = new URL(t, window.location.origin).pathname || "",
        l = e.split("/"),
        o = l[l.length - 1] || "";
      return "" === o || "index.html" === o ? "/" : "/" + o.replace(/^\//, "");
    } catch (t) {
      return "";
    }
  }

  function isCurrentMapItem(t) {
    try {
      return !!currentRouteKey && routeKeyFromUrl(t.url) === currentRouteKey;
    } catch (t) {
      return !1;
    }
  }

  function getTagsFromCurrentPage(t) {
    for (var e = 0; e < urlMaps.length; e++) {
      if (isCurrentMapItem(urlMaps[e])) {
        var l = urlMaps[e].tags.split(",");
        if (!isAddedAll) {
          for (var o = 0; o < l.length; o++) {
            allCurrentTags =
              ("" !== allCurrentTags ? allCurrentTags + ", " : allCurrentTags) +
              '<a target="_blank" style="color: #4caf50" href="https://freetoolonline.com/tags.html?tag=' +
              l[o].toLowerCase() +
              '">#' +
              l[o].toLowerCase() +
              "</a>";
          }
        }
        isAddedAll = !0;
        return l;
      }
    }
    for (e = 0; e < urlMaps.length; e++) {
      if (urlMaps[e].title.toLowerCase() === t.toLowerCase()) {
        l = urlMaps[e].tags.split(",");
        if (!isAddedAll) {
          for (o = 0; o < l.length; o++) {
            allCurrentTags =
              ("" !== allCurrentTags ? allCurrentTags + ", " : allCurrentTags) +
              '<a target="_blank" style="color: #4caf50" href="https://freetoolonline.com/tags.html?tag=' +
              l[o].toLowerCase() +
              '">#' +
              l[o].toLowerCase() +
              "</a>";
          }
        }
        isAddedAll = !0;
        return l;
      }
    }
  }

  function addPagesHasTheSameTag(t, e) {
    if (!t || !e || !e.length) {
      return "";
    }

    for (var l = "", o = 0; o < t.length; o++) {
      for (var i = 0; i < e.length; i++) {
        if ("" !== t[o].toLowerCase() && "null" !== t[o].toLowerCase() && t[o].toLowerCase() === e[i].toLowerCase()) {
          l = l + " #" + t[o].toLowerCase();
        }
      }
    }

    return l;
  }

  var allTags = [],
    tagsCollection = [];

  function checkIfStringExistInList(t, e) {
    for (var l = 0; l < t.length; l++) {
      if (t[l].toLowerCase() === e.toLowerCase()) {
        return !0;
      }
    }
    return !1;
  }

  var searchStopWords = ["free", "tool", "tools", "online", "convert", "converter", "converters", "in", "editor", "maker", "by", "and", "to", "the", "a", "an", "for", "of", "with", "on", "vs"];

  function isSearchStopWord(t) {
    return searchStopWords.indexOf(t.toLowerCase()) > -1;
  }

  function getAllTags() {
    for (var t = 0; t < urlMaps.length; t++) {
      for (var e = urlMaps[t].tags.split(","), l = 0; l < e.length; l++) {
        "" === e[l] || checkIfStringExistInList(allTags, e[l]) || allTags.push(e[l]);
        void 0 === tagsCollection[e[l]] ? (tagsCollection[e[l]] = 1) : (tagsCollection[e[l]] = tagsCollection[e[l]] + 1);
      }
    }
  }

  function getParameterByName(t, e) {
    e || (e = window.location.href);
    t = t.replace(/[\[\]]/g, "\\$&");
    var l = new RegExp("[?&]" + t + "(=([^&#]*)|&|#|$)").exec(e);
    return l ? (l[2] ? decodeURIComponent(l[2].replace(/\+/g, " ")) : "") : null;
  }

  function getRandomInt(t, e) {
    return (t = Math.ceil(t)), (e = Math.floor(e)), Math.floor(Math.random() * (e - t + 1)) + t;
  }

  if ("" !== currentTitle) {
    if (currentTitle.toLowerCase() !== "Tags Collection".toLowerCase() && currentTitle.toLowerCase() !== "Tags cloud:".toLowerCase()) {
      var RELATED_GUIDES_MAX = 12, RELATED_TOOLS_MAX = 12, RELATED_NEWS_MAX = 6;
      // Language-independent relevance parity with SSR (page-renderer.mjs): the URL
      // slug is always English kebab-case even on localized /guides/<lang>/ routes,
      // so merge slug words into the (possibly non-English) title words. Without this
      // a localized page's title words match no English urlMaps title -> empty related
      // sections. Fallback path only (SSR populates first when present).
      var slugLeaf = (window.location.pathname.split("/").filter(function (s) { return s; }).pop() || "").replace(/\.html?$/i, "");
      var currentTitleWords = currentTitle.toLowerCase().replace(/,/g, "").split(" ");
      var slugWordsArr = slugLeaf.split("-").filter(function (s) { return s; });
      for (var sw = 0; sw < slugWordsArr.length; sw++) { if (currentTitleWords.indexOf(slugWordsArr[sw]) === -1) currentTitleWords.push(slugWordsArr[sw]); }
      for (var toolsList = "", guidesList = "", newsList = "", guidesCount = 0, toolsCount = 0, newsCount = 0, i = 0; i < urlMaps.length; i++) {
        var title = urlMaps[i].title;
        if (!urlMaps[i].include && !isCurrentMapItem(urlMaps[i])) {
          var matchedTags = addPagesHasTheSameTag((tags = urlMaps[i].tags.split(",")), (currentTags = getTagsFromCurrentPage(currentTitle)));
          if ("" !== matchedTags) {
            urlMaps[i].include = !0;
            var liTag = relatedLiHtml(localizeRelatedUrl(urlMaps[i].url), title, "#4caf50", "This page has the same tag(s): " + matchedTags, urlMaps[i].desc);
            if (isNewsRelatedUrl(urlMaps[i].url)) {
              newsCount < RELATED_NEWS_MAX && ((newsList += liTag), newsCount++);
            } else if (isGuideRelatedUrl(urlMaps[i].url)) {
              guidesCount < RELATED_GUIDES_MAX && ((guidesList += liTag), guidesCount++);
            } else {
              toolsCount < RELATED_TOOLS_MAX && ((toolsList += liTag), toolsCount++);
            }
          }
        }
      }

      for (i = 0; i < urlMaps.length; i++) {
        for (var firstMatchedWord = !1, j = 0; j < currentTitleWords.length; j++) {
          var word = currentTitleWords[j].toLowerCase();
          title = urlMaps[i].title;
          if (
            !urlMaps[i].include &&
            !isCurrentMapItem(urlMaps[i]) &&
            "free" !== word &&
            "tool" !== word &&
            "online" !== word &&
            "convert" !== word &&
            "converter" !== word &&
            "in" !== word &&
            "editor" !== word &&
            "maker" !== word &&
            "by" !== word &&
            "and" !== word &&
            title.toLowerCase().indexOf(word) > -1
          ) {
            if (firstMatchedWord) {
              urlMaps[i].include = !0;
              var liTitle = relatedLiHtml(localizeRelatedUrl(urlMaps[i].url), title, "#3b73af", "Go to " + title, urlMaps[i].desc);
              if (isNewsRelatedUrl(urlMaps[i].url)) {
                newsCount < RELATED_NEWS_MAX && ((newsList += liTitle), newsCount++);
              } else if (isGuideRelatedUrl(urlMaps[i].url)) {
                guidesCount < RELATED_GUIDES_MAX && ((guidesList += liTitle), guidesCount++);
              } else {
                toolsCount < RELATED_TOOLS_MAX && ((toolsList += liTitle), toolsCount++);
              }
            } else {
              firstMatchedWord = !0;
            }
          }
        }
      }

      var relatedUlOpen = '<ul style="margin-top: 0px;display: block;padding-inline-start: 40px;list-style-type: disc;">';
      if ("" !== toolsList) {
        if (!hasSsrRelatedTools) {
          relatedToolsRoot.html(relatedUlOpen + toolsList + "</ul>");
          "" !== allCurrentTags && relatedToolsRoot.after("<p>Tags: " + allCurrentTags + "</p>");
        } else {
          console.log("[related-tools] SSR detected; skipping client tools injection.");
        }
      }
      // Inject guides ONLY when the allowlist-gated .relatedGuides container is
      // present (SSR emitted it) and was not already SSR-populated.
      var guidesRoot = $(".relatedGuides"),
        hasSsrGuides = guidesRoot.length > 0 && guidesRoot.children().length > 0;
      if ("" !== guidesList && guidesRoot.length > 0 && !hasSsrGuides) {
        guidesRoot.html(relatedUlOpen + guidesList + "</ul>");
      }
      // news-loop (2026-07-08): same fallback pattern as guides - inject ONLY
      // when the .relatedNews container exists (SSR emitted it) and was not
      // already SSR-populated.
      var newsRoot = $(".relatedNews"),
        hasSsrNews = newsRoot.length > 0 && newsRoot.children().length > 0;
      if ("" !== newsList && newsRoot.length > 0 && !hasSsrNews) {
        newsRoot.html(relatedUlOpen + newsList + "</ul>");
      }
    } else {
      var rawTagFromQuery = getParameterByName("tag"),
        rawSearchQuery = getParameterByName("q"),
        tagFromQuery = rawTagFromQuery || rawSearchQuery;
      tagFromQuery && (tagFromQuery = tagFromQuery.trim());
      if (tagFromQuery && tagFromQuery.toLowerCase() === "hardwaretest") {
        tagFromQuery = "device-test";
        console.log("[related-tools] Alias tag hardwaretest -> device-test.");
      }

      var normalizedQuery = tagFromQuery ? tagFromQuery.toLowerCase() : "";

      // Home-search handoff: the homepage datalist suggests FULL page titles,
      // so a no-JS submit (or a legacy cached homepage without the inline
      // option-select handler) lands here with ?tag=<full title>. When the
      // query is the exact title of a known page, go straight to that page
      // instead of running the fuzzy tag search over its title words.
      // Guide datalist options carry a " (guide)" suffix - strip it first.
      var redirectedToExactTitle = !1,
        exactTitleQuery = normalizedQuery.replace(/\s*\(guide\)$/, "").trim();
      if ("" !== exactTitleQuery) {
        for (i = 0; i < urlMaps.length; i++) {
          if (urlMaps[i].title.toLowerCase() === exactTitleQuery) {
            console.log("[related-tools] Query is the exact title of " + urlMaps[i].url + "; redirecting.");
            redirectedToExactTitle = !0;
            window.location.replace(localizeRelatedUrl(urlMaps[i].url));
            break;
          }
        }
      }

      // Token hygiene: trim punctuation off token edges and drop tokens that
      // are punctuation-only. Without this a title-style query such as
      // "resize image online - jpg, png & webp image resizer" produced junk
      // tokens ("-", "&", "jpg,") and "-" substring-matched nearly every
      // hyphenated title on the site (operator-caught 2026-07-03).
      var cleanSearchToken = function (t) {
        return t.replace(/^[^a-z0-9]+/, "").replace(/[^a-z0-9]+$/, "");
      };
      var queryTokens = normalizedQuery
        ? normalizedQuery
            .split(/\s+/)
            .map(cleanSearchToken)
            .filter(function (t) {
              return "" !== t && !isSearchStopWord(t);
            })
        : [];

      normalizedQuery &&
        0 === queryTokens.length &&
        (queryTokens = [cleanSearchToken(normalizedQuery)].filter(function (t) {
          return "" !== t;
        }));
      console.log("[related-tools] Tag search query:", tagFromQuery);
      console.log("[related-tools] Tag search tokens:", queryTokens);

      list = "";
      if ("" !== normalizedQuery && !redirectedToExactTitle && queryTokens.length > 0) {
        // Score every candidate so the closest pages render first: full-phrase
        // title match >> exact tag hits >> per-token title hits. Multi-word
        // queries cap at the best 20 rows; single-word queries are the
        // canonical tag-browse lists (the "#zip"-style links on every tool
        // page) and stay uncapped.
        var TAG_RESULTS_MAX = 20,
          scoredMatches = [];
        for (i = 0; i < urlMaps.length; i++) {
          var tags, currentTags, matchedTags, titleLower;
          title = urlMaps[i].title;
          if (!urlMaps[i].include && !isCurrentMapItem(urlMaps[i])) {
            matchedTags = addPagesHasTheSameTag((tags = urlMaps[i].tags.split(",")), (currentTags = queryTokens));
            titleLower = title.toLowerCase();
            var matchedTagCount = "" === matchedTags ? 0 : matchedTags.split(" #").length - 1,
              matchedTitleTokens = 0;
            for (var q = 0; q < queryTokens.length; q++) {
              titleLower.indexOf(queryTokens[q]) > -1 && matchedTitleTokens++;
            }
            var score = (titleLower.indexOf(normalizedQuery) > -1 ? 8 : 0) + 3 * matchedTagCount + 2 * matchedTitleTokens;
            if (score > 0) {
              urlMaps[i].include = !0;
              scoredMatches.push({ map: urlMaps[i], matchedTags: matchedTags, score: score, order: i });
            }
          }
        }
        scoredMatches.sort(function (a, b) {
          return b.score - a.score || a.order - b.order;
        });
        var totalMatches = scoredMatches.length,
          capApplies = queryTokens.length > 1 && totalMatches > TAG_RESULTS_MAX;
        capApplies && (scoredMatches = scoredMatches.slice(0, TAG_RESULTS_MAX));
        for (i = 0; i < scoredMatches.length; i++) {
          var matched = scoredMatches[i],
            matchColor = "" !== matched.matchedTags ? "#4caf50" : "#3b73af",
            matchTitle = "" !== matched.matchedTags ? "This tool has the same tag(s): " + matched.matchedTags : 'Title matches "' + escRelDesc(normalizedQuery) + '"';
          list =
            list +
            '<li class="d-inline"><a title="' +
            matchTitle +
            '" style="color: ' +
            matchColor +
            ';" href="' +
            localizeRelatedUrl(matched.map.url) +
            '">' +
            matched.map.title +
            "</a></li>";
        }
        // Render matches inside the same padded, bulleted <ul> the Related
        // Tools sections use. They previously landed as bare <li> nodes
        // directly in the .tags-collection div, which drew the bullets flush
        // against the container's left edge (operator-caught 2026-07-03).
        // escRelDesc: the query text is URL-controlled - never inject it raw.
        "" !== list &&
          (list =
            "<p>Tools matching:<b> " +
            (normalizedQuery.indexOf(" ") === -1 ? "#" : "") +
            escRelDesc(normalizedQuery) +
            "</b>" +
            (capApplies ? " (showing the " + TAG_RESULTS_MAX + " closest of " + totalMatches + " matches)" : "") +
            "</p>" +
            '<ul style="margin-top: 0px;display: block;padding-inline-start: 40px;list-style-type: disc;">' +
            list +
            "</ul>",
          $(".tags-collection").html(list));
      }

      getAllTags();
      var wordsList = [],
        allTagsList = "";
      for (i = 0; i < allTags.length; i++) {
        var item = {
          text: allTags[i],
          weight: tagsCollection[allTags[i]],
          link: "https://freetoolonline.com/tags.html?tag=" + allTags[i],
        };
        getRandomInt(0, allTags.length) % 2 == 0 && (item.html = { class: "vertical" });
        wordsList.push(item);
      }
      wordsList.length > 0 &&
        ((allTagsList = (currentTitle.toLowerCase() !== "Tags cloud:".toLowerCase() ? "<p>Tags cloud:</p>" : "") + '<div id="tags-cloud"></div>'),
        $(".alltags-collection").html(allTagsList),
        $.ajax({
          url: "https://dkbg1jftzfsd2.cloudfront.net/script/lib/jquery/jqcloud/jqcloud.css",
          dataType: "text",
          success: function (t) {
            $(".alltags-collection").append("<style>" + t + "</style>");
            loadScript("https://dkbg1jftzfsd2.cloudfront.net/script/lib/jquery/jqcloud/jqcloud-1.0.4.min.js", function () {
              $("#tags-cloud").jQCloud(wordsList, {
                width: $("#tags-cloud").width(),
                height: $("#tags-cloud").height() / 2,
                delayedMode: allTags.length > 50,
                shape: !1,
                encodeURI: !0,
                removeOverflowing: !0,
              });
            });
          },
        }));
    }
  }
} catch (t) {
  console.log(t);
}
