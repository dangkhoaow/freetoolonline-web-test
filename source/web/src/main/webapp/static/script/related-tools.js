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
    { title: "Online Stopwatch", url: "https://freetoolonline.com/utility-tools/stopwatch.html", include: !1, tags: "utility" },
    { title: "Online Alarm Clock", url: "https://freetoolonline.com/utility-tools/online-alarm-clock.html", include: !1, tags: "utility" },
    { title: "Wheel Spinner (Wheel of Names)", url: "https://freetoolonline.com/utility-tools/wheel-spinner.html", include: !1, tags: "utility" },
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
      var RELATED_GUIDES_MAX = 12, RELATED_TOOLS_MAX = 12;
      // Language-independent relevance parity with SSR (page-renderer.mjs): the URL
      // slug is always English kebab-case even on localized /guides/<lang>/ routes,
      // so merge slug words into the (possibly non-English) title words. Without this
      // a localized page's title words match no English urlMaps title -> empty related
      // sections. Fallback path only (SSR populates first when present).
      var slugLeaf = (window.location.pathname.split("/").filter(function (s) { return s; }).pop() || "").replace(/\.html?$/i, "");
      var currentTitleWords = currentTitle.toLowerCase().replace(/,/g, "").split(" ");
      var slugWordsArr = slugLeaf.split("-").filter(function (s) { return s; });
      for (var sw = 0; sw < slugWordsArr.length; sw++) { if (currentTitleWords.indexOf(slugWordsArr[sw]) === -1) currentTitleWords.push(slugWordsArr[sw]); }
      for (var toolsList = "", guidesList = "", guidesCount = 0, toolsCount = 0, i = 0; i < urlMaps.length; i++) {
        var title = urlMaps[i].title;
        if (!urlMaps[i].include && !isCurrentMapItem(urlMaps[i])) {
          var matchedTags = addPagesHasTheSameTag((tags = urlMaps[i].tags.split(",")), (currentTags = getTagsFromCurrentPage(currentTitle)));
          if ("" !== matchedTags) {
            urlMaps[i].include = !0;
            var liTag = relatedLiHtml(localizeRelatedUrl(urlMaps[i].url), title, "#4caf50", "This page has the same tag(s): " + matchedTags, urlMaps[i].desc);
            if (isGuideRelatedUrl(urlMaps[i].url)) {
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
              if (isGuideRelatedUrl(urlMaps[i].url)) {
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
    } else {
      var rawTagFromQuery = getParameterByName("tag"),
        rawSearchQuery = getParameterByName("q"),
        tagFromQuery = rawTagFromQuery || rawSearchQuery;
      tagFromQuery && (tagFromQuery = tagFromQuery.trim());
      if (tagFromQuery && tagFromQuery.toLowerCase() === "hardwaretest") {
        tagFromQuery = "device-test";
        console.log("[related-tools] Alias tag hardwaretest -> device-test.");
      }

      var normalizedQuery = tagFromQuery ? tagFromQuery.toLowerCase() : "",
        queryTokens = normalizedQuery
          ? normalizedQuery.split(/\s+/).filter(function (t) {
              return "" !== t && !isSearchStopWord(t);
            })
          : [];

      normalizedQuery && 0 === queryTokens.length && (queryTokens = [normalizedQuery]);
      console.log("[related-tools] Tag search query:", tagFromQuery);
      console.log("[related-tools] Tag search tokens:", queryTokens);

      list = "";
      if ("" !== normalizedQuery) {
        for (i = 0; i < urlMaps.length; i++) {
          var tags,
            currentTags,
            matchedTags,
            titleLower,
            titleMatch;
          title = urlMaps[i].title;
          if (!urlMaps[i].include && !isCurrentMapItem(urlMaps[i])) {
            matchedTags = addPagesHasTheSameTag((tags = urlMaps[i].tags.split(",")), (currentTags = queryTokens));
            titleLower = title.toLowerCase();
            titleMatch =
              titleLower.indexOf(normalizedQuery) > -1 ||
              queryTokens.some(function (t) {
                return titleLower.indexOf(t) > -1;
              });

            if ("" !== matchedTags || titleMatch) {
              var matchColor = "" !== matchedTags ? "#4caf50" : "#3b73af",
                matchLabel = "" !== matchedTags ? matchedTags : ' "' + normalizedQuery + '"',
                matchTitle = "" !== matchedTags ? "This tool has the same tag(s): " + matchedTags : "Title matches" + matchLabel;

              urlMaps[i].include = !0;
              list =
                list +
                '<li class="d-inline"><a title="' +
                matchTitle +
                '" style="color: ' +
                matchColor +
                ';" href="' +
                localizeRelatedUrl(urlMaps[i].url) +
                '">' +
                title +
                "</a></li>";
            }
          }
        }
        "" !== list &&
          (list = "<p>Tools matching:<b> " + (normalizedQuery.indexOf(" ") === -1 ? "#" : "") + normalizedQuery + "</b></p>" + list,
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
