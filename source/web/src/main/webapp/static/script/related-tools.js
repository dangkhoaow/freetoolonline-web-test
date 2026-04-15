try {
  var urlMaps = [
    { title: "ZIP Tools", url: "https://freetoolonline.com/zip-tools.html", include: !1, tags: "zip,pdf" },
    { title: "Get JPEG Compression Level", url: "https://freetoolonline.com/get-jpeg-compression-level.html", include: !1, tags: "jpg,compress,quality,image-editing" },
    { title: "Base64 To Image", url: "https://freetoolonline.com/base64-to-image.html", include: !1, tags: "image-conversion,base64" },
    { title: "Convert Time In Millisecond To Date", url: "https://freetoolonline.com/convert-time-in-millisecond-to-date.html", include: !1, tags: "millis,utility" },
    { title: "Convert GIF To Images Frame", url: "https://freetoolonline.com/extract-gif-to-image-frames.html", include: !1, tags: "image-conversion,split,gif" },
    { title: "Convert HEIC to JPG online", url: "https://freetoolonline.com/heic-to-jpg.html", include: !1, tags: "image-conversion,jpg,pdf,ai" },
    { title: "Image Converter Tools", url: "https://freetoolonline.com/image-converter-tools.html", include: !1, tags: "image-conversion" },
    { title: "Convert Images to PDF", url: "https://freetoolonline.com/images-to-pdf.html", include: !1, tags: "pdf" },
    { title: "Image To Base64", url: "https://freetoolonline.com/image-to-base64.html", include: !1, tags: "image-conversion,base64,jpg,png" },
    { title: "MD5 converter", url: "https://freetoolonline.com/md5-converter.html", include: !1, tags: "md5,developer" },
    { title: "Convert PDF to HTML online", url: "https://freetoolonline.com/pdf-to-html.html", include: !1, tags: "pdf" },
    { title: "Convert PDF To Images", url: "https://freetoolonline.com/pdf-to-images.html", include: !1, tags: "pdf" },
    { title: "Convert PDF to TEXT online", url: "https://freetoolonline.com/pdf-to-text.html", include: !1, tags: "pdf" },
    { title: "QR Code Generator", url: "https://freetoolonline.com/qr-code-generator.html", include: !1, tags: "qrcode,generator,utility" },
    { title: "SVG to PNG and WEBP Converter", url: "https://freetoolonline.com/svg-to-png.html", include: !1, tags: "image-conversion,pagespeed,png,jpg,webp" },
    { title: "PNG to SVG by Interpolation algorithm", url: "https://freetoolonline.com/png-to-svg.html", include: !1, tags: "image-conversion,jpg,png,interpolation" },
    { title: "Text To HTML Editor", url: "https://freetoolonline.com/text-html-editor.html", include: !1, tags: "editor,text,html,developer" },
    { title: "All Video Converter", url: "https://freetoolonline.com/video-converter.html", include: !1, tags: "video,resize,trim,cut" },
    { title: "Get Current Time In Millisecond", url: "https://freetoolonline.com/get-time-in-millisecond.html", include: !1, tags: "millis,utility" },
    { title: "Remove Zip Password", url: "https://freetoolonline.com/remove-zip-password.html", include: !1, tags: "password,zip" },
    { title: "UnZip File, Extract, Decompress Zip", url: "https://freetoolonline.com/unzip-file.html", include: !1, tags: "zip,unzip" },
    { title: "Compress, Zip File and Folder", url: "https://freetoolonline.com/zip-file.html", include: !1, tags: "compress,zip" },
    { title: "Compress JPEG by AI", url: "https://freetoolonline.com/compress-image.html", include: !1, tags: "compress,jpg,ai,image-editing" },
    { title: "Insights Image Optimizer", url: "https://freetoolonline.com/insights-image-optimizer.html", include: !1, tags: "pagespeed,jpg,png,compress,image-editing" },
    { title: "Image Cropper And Rotator", url: "https://freetoolonline.com/crop-image.html", include: !1, tags: "crop,jpg,png,image-editing" },
    { title: "FFmpeg Online", url: "https://freetoolonline.com/ffmpeg-online.html", include: !1, tags: "video,ffmpeg,execute" },
    { title: "GIF Maker and Gif Editor", url: "https://freetoolonline.com/gif-maker.html", include: !1, tags: "split,gif,maker,resize,trim,cut,editor,image-editing" },
    { title: "ImageMagick Online", url: "https://freetoolonline.com/imagemagick-online.html", include: !1, tags: "imagemagick,execute,image-editing" },
    { title: "Resize JPG and PNG by BiInterpolation Algorithm", url: "https://freetoolonline.com/resize-image.html", include: !1, tags: "resize,jpg,png,interpolation,image-editing" },
    { title: "Compose, Create PDF By Editor", url: "https://freetoolonline.com/compose-pdf.html", include: !1, tags: "editor,pdf" },
    { title: "Encrypt, Protect PDF By Password", url: "https://freetoolonline.com/protect-pdf-by-password.html", include: !1, tags: "pdf,password" },
    { title: "Flatten Pdf", url: "https://freetoolonline.com/flatten-pdf.html", include: !1, tags: "pdf,compress" },
    { title: "Join Multiple PDF Files To One File", url: "https://freetoolonline.com/join-pdf-from-multiple-files.html", include: !1, tags: "pdf" },
    { title: "PDF Validator, PreFlight", url: "https://freetoolonline.com/preflight-pdf.html", include: !1, tags: "pdf,validation" },
    { title: "Remove PDF Password", url: "https://freetoolonline.com/remove-pdf-password.html", include: !1, tags: "pdf,password" },
    { title: "Split PDF By Range, Start And End Page", url: "https://freetoolonline.com/split-pdf-by-range.html", include: !1, tags: "pdf,split" },
    { title: "Split PDF To Single PDF Pages", url: "https://freetoolonline.com/split-pdf-to-each-pages.html", include: !1, tags: "pdf,split" },
    { title: "Camera Test", url: "https://freetoolonline.com/camera-test.html", include: !1, tags: "hardwaretest" },
    { title: "CSS Gradient Animator Generator", url: "https://freetoolonline.com/css-gradient-generator.html", include: !1, tags: "generator,css,developer" },
    { title: "CSS Minifier", url: "https://freetoolonline.com/css-minifier.html", include: !1, tags: "pagespeed,minifier,css,developer" },
    { title: "CSS UnMinifier", url: "https://freetoolonline.com/css-unminifier.html", include: !1, tags: "beautifier,css,developer" },
    { title: "JavaScript Minifier", url: "https://freetoolonline.com/js-minifier.html", include: !1, tags: "pagespeed,minifier,javascript,developer" },
    { title: "JSON Parser By Tree View", url: "https://freetoolonline.com/json-parser.html", include: !1, tags: "beautifier,parser,javascript,json,developer" },
    { title: "JavaScript UnMinifier", url: "https://freetoolonline.com/js-unminifier.html", include: !1, tags: "beautifier,javascript,developer" },
    { title: "Keyboard Test", url: "https://freetoolonline.com/keyboard-test.html", include: !1, tags: "hardwaretest" },
    { title: "LCD Test", url: "https://freetoolonline.com/lcd-test.html", include: !1, tags: "hardwaretest" },
    { title: "Microphone Test", url: "https://freetoolonline.com/microphone-test.html", include: !1, tags: "hardwaretest" },
    { title: "Text Diff", url: "https://freetoolonline.com/text-diff.html", include: !1, tags: "compare,text,developer" },
    { title: "Video And SlideShow Maker", url: "https://freetoolonline.com/video-maker.html", include: !1, tags: "video,maker,editor" },
    { title: "Total Photo Editor", url: "https://freetoolonline.com/photo-editor.html", include: !1, tags: "png,jpg,editor,image-editing" },
    { title: "Đo nồng độ cồn trực tuyến", url: "https://freetoolonline.com/do-nong-do-con-truc-tuyen.html", include: !1, tags: "utility,alcohol,calculator" },
    { title: "Chuyển đổi sang Tiếq Việt mới trực tuyến", url: "https://freetoolonline.com/cong-cu-chuyen-doi-chu-quoc-ngu-tieng-viet-thanh-tieq-viet-kieu-moi.html", include: !1, tags: "utility,vietnamese,tieqviet" },
    { title: "Image Tools", url: "https://freetoolonline.com/image-tools.html", include: !1, tags: "image-editing" },
    { title: "PDF Tools", url: "https://freetoolonline.com/pdf-tools.html", include: !1, tags: "pdf,zip" },
    { title: "Developer Tools", url: "https://freetoolonline.com/developer-tools.html", include: !1, tags: "developer" },
    { title: "Video Tools", url: "https://freetoolonline.com/video-tools.html", include: !1, tags: "video" },
    { title: "Device Test Tools", url: "https://freetoolonline.com/device-test-tools.html", include: !1, tags: "hardwaretest" },
    { title: "Utility Tools", url: "https://freetoolonline.com/utility-tools.html", include: !1, tags: "utility" }
  ],
    currentTitle = $.trim($(".navPageName").text()),
    allCurrentTags = "",
    isAddedAll = !1,
    relatedToolsRoot = $(".relatedTools"),
    hasSsrRelatedTools = relatedToolsRoot && relatedToolsRoot.children().length > 0;

  function getTagsFromCurrentPage(t) {
    for (var e = 0; e < urlMaps.length; e++) {
      if (urlMaps[e].title.toLowerCase() === t.toLowerCase()) {
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
      for (var currentTitleWords = currentTitle.toLowerCase().replace(/,/g, "").split(" "), list = "", i = 0; i < urlMaps.length; i++) {
        var title = urlMaps[i].title;
        if (!urlMaps[i].include && title.toLowerCase() !== currentTitle.toLowerCase()) {
          var matchedTags = addPagesHasTheSameTag((tags = urlMaps[i].tags.split(",")), (currentTags = getTagsFromCurrentPage(currentTitle)));
          if ("" !== matchedTags) {
            urlMaps[i].include = !0;
            list =
              list +
              '<li class="d-inline"><a title="This tool has the same tag(s): ' +
              matchedTags +
              '" style="color: #4caf50;" href="' +
              urlMaps[i].url +
              '">' +
              title +
              "</a></li>";
          }
        }
      }

      for (i = 0; i < urlMaps.length; i++) {
        for (var firstMatchedWord = !1, j = 0; j < currentTitleWords.length; j++) {
          var word = currentTitleWords[j].toLowerCase();
          title = urlMaps[i].title;
          if (
            !urlMaps[i].include &&
            title.toLowerCase() !== currentTitle.toLowerCase() &&
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
              list =
                list +
                '<li class="d-inline"><a title="Go to ' +
                title +
                '" style="color: #3b73af;" href="' +
                urlMaps[i].url +
                '">' +
                title +
                "</a></li>";
            } else {
              firstMatchedWord = !0;
            }
          }
        }
      }

      if ("" !== list) {
        list = '<ul style="margin-top: 0px;display: block;padding-inline-start: 40px;list-style-type: disc;">' + list + "</ul>";
        if (!hasSsrRelatedTools) {
          relatedToolsRoot.html(list);
          "" !== allCurrentTags && relatedToolsRoot.after("<p>Tags: " + allCurrentTags + "</p>");
        } else {
          console.log("[related-tools] SSR detected; skipping client injection.");
        }
      }
    } else {
      var tagFromQuery = getParameterByName("tag");
      list = "";
      if ("" !== tagFromQuery && tagFromQuery) {
        for (i = 0; i < urlMaps.length; i++) {
          var tags,
            currentTags,
            matchedTags;
          title = urlMaps[i].title;
          if (!urlMaps[i].include && title.toLowerCase() !== currentTitle.toLowerCase()) {
            matchedTags = addPagesHasTheSameTag((tags = urlMaps[i].tags.split(",")), (currentTags = [tagFromQuery]));
            if ("" !== matchedTags) {
              urlMaps[i].include = !0;
              list =
                list +
                '<li class="d-inline"><a title="' +
                title +
                '" style="color: #4caf50;" href="' +
                urlMaps[i].url +
                '">' +
                title +
                "</a></li>";
            }
          }
        }
        "" !== list && (list = "<p>Tools have the tag:<b> #" + tagFromQuery + "</b></p>" + list, $(".tags-collection").html(list));
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
