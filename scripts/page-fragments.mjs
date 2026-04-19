import { DEFAULT_SHORTEN_DOMAIN } from './site-data.mjs';

export const DEFAULT_PAGE_SVG_LOGO = `<svg viewBox="0 0 932.18 932.18" xmlns="http://www.w3.org/2000/svg"><g fill="#fff"><path d="m60.2 341.54c4.9 16.8 11.7 33 20.3 48.2l-24.5 30.9c-8 10.1-7.1 24.5 1.9 33.6l42.2 42.2c9.1 9.1 23.5 9.899 33.6 1.899l30.7-24.3c15.8 9.101 32.6 16.2 50.1 21.2l4.6 39.5c1.5 12.8 12.3 22.4 25.1 22.4h59.7c12.8 0 23.6-9.601 25.1-22.4l4.4-38.1c18.8-4.9 36.8-12.2 53.7-21.7l29.7 23.5c10.1 8 24.5 7.1 33.6-1.9l42.2-42.2c9.1-9.1 9.9-23.5 1.9-33.6l-23.1-29.3c9.6-16.601 17.1-34.3 22.1-52.8l35.6-4.1c12.801-1.5 22.4-12.3 22.4-25.1v-59.7c0-12.8-9.6-23.6-22.4-25.1l-35.1-4.1c-4.801-18.3-12-35.8-21.199-52.2l21.6-27.3c8-10.1 7.1-24.5-1.9-33.6l-42.1-42.1c-9.1-9.1-23.5-9.9-33.6-1.9l-26.5 21c-17.2-10.1-35.601-17.8-54.9-23l-4-34.3c-1.5-12.8-12.3-22.4-25.1-22.4h-59.7c-12.8 0-23.6 9.6-25.1 22.4l-4 34.3c-19.8 5.3-38.7 13.3-56.3 23.8l-27.5-21.8c-10.1-8-24.5-7.1-33.6 1.9l-42.2 42.2c-9.1 9.1-9.9 23.5-1.9 33.6l23 29.1c-9.2 16.6-16.2 34.3-20.8 52.7l-36.8 4.2c-12.8 1.5-22.4 12.3-22.4 25.1v59.7c0 12.8 9.6 23.6 22.4 25.1l38.799 4.501zm216.3-161.5c54.4 0 98.7 44.3 98.7 98.7s-44.3 98.7-98.7 98.7c-54.399 0-98.7-44.3-98.7-98.7s44.3-98.7 98.7-98.7z"/><path d="m866.7 356.24-31.5-26.6c-9.699-8.2-24-7.8-33.199 0.9l-17.4 16.3c-14.699-7.1-30.299-12.1-46.4-15l-4.898-24c-2.5-12.4-14-21-26.602-20l-41.1 3.5c-12.6 1.1-22.5 11.4-22.9 24.1l-0.799 24.4c-15.801 5.7-30.701 13.5-44.301 23.3l-20.799-13.8c-10.602-7-24.701-5-32.9 4.7l-26.6 31.7c-8.201 9.7-7.801 24 0.898 33.2l18.201 19.399c-6.301 14.2-10.801 29.101-13.4 44.4l-26 5.3c-12.4 2.5-21 14-20 26.601l3.5 41.1c1.1 12.6 11.4 22.5 24.1 22.9l28.1 0.899c5.102 13.4 11.801 26.101 19.9 38l-15.699 23.7c-7 10.6-5 24.7 4.699 32.9l31.5 26.6c9.701 8.2 24 7.8 33.201-0.9l20.6-19.3c13.5 6.3 27.699 11 42.299 13.8l5.701 28.2c2.5 12.4 14 21 26.6 20l41.1-3.5c12.6-1.1 22.5-11.399 22.9-24.1l0.9-27.601c15-5.3 29.199-12.5 42.299-21.399l22.701 15c10.6 7 24.699 5 32.9-4.7l26.6-31.5c8.199-9.7 7.799-24-0.9-33.2l-18.301-19.399c6.701-14.2 11.602-29.2 14.4-44.601l25-5.1c12.4-2.5 21-14 20-26.601l-3.5-41.1c-1.1-12.6-11.4-22.5-24.1-22.9l-25.1-0.8c-5.201-14.6-12.201-28.399-20.9-41.2l13.699-20.6c7.201-10.598 5.201-24.798-4.5-32.998zm-154.9 237.6c-44.4 3.801-83.602-29.3-87.301-73.699-3.801-44.4 29.301-83.601 73.699-87.301 44.4-3.8 83.602 29.301 87.301 73.7 3.801 44.401-29.301 83.601-73.699 87.3z"/><path d="m204 704.44c-12.6 1.3-22.3 11.899-22.4 24.6l-0.3 25.3c-0.2 12.7 9.2 23.5 21.8 25.101l18.6 2.399c3.1 11.301 7.5 22.101 13.2 32.301l-12 14.8c-8 9.899-7.4 24.1 1.5 33.2l17.7 18.1c8.9 9.1 23.1 10.1 33.2 2.3l14.899-11.5c10.5 6.2 21.601 11.101 33.2 14.5l2 19.2c1.3 12.6 11.9 22.3 24.6 22.4l25.301 0.3c12.699 0.2 23.5-9.2 25.1-21.8l2.3-18.2c12.601-3.101 24.601-7.8 36-14l14 11.3c9.9 8 24.101 7.4 33.201-1.5l18.1-17.7c9.1-8.899 10.1-23.1 2.301-33.2l-10.702-13.901c6.6-11 11.701-22.7 15.201-35l16.6-1.7c12.6-1.3 22.299-11.9 22.4-24.6l0.299-25.301c0.201-12.699-9.199-23.5-21.799-25.1l-16.201-2.1c-3.1-12.2-7.699-24-13.699-35l10.1-12.4c8-9.9 7.4-24.1-1.5-33.2l-17.699-18.1c-8.9-9.101-23.102-10.101-33.201-2.3l-12.101 9.3c-11.399-6.9-23.6-12.2-36.399-15.8l-1.601-15.7c-1.3-12.601-11.899-22.3-24.6-22.4l-25.3-0.3c-12.7-0.2-23.5 9.2-25.101 21.8l-2 15.601c-13.199 3.399-25.899 8.6-37.699 15.399l-12.5-10.2c-9.9-8-24.101-7.399-33.201 1.5l-18.2 17.801c-9.1 8.899-10.1 23.1-2.3 33.199l10.7 13.801c-6.2 11-11.1 22.699-14.3 35l-17.499 1.8zm163.3-28.601c36.3 0.4 65.399 30.301 65 66.601-0.4 36.3-30.301 65.399-66.601 65-36.3-0.4-65.399-30.3-65-66.601 0.401-36.299 30.301-65.399 66.601-65z"/></g></svg>`;

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function unwrapStyleBlock(value) {
  const text = String(value ?? '').trim();
  const start = text.match(/^<style[^>]*>/i);
  const end = text.match(/<\/style>\s*$/i);
  if (start && end) {
    return text.replace(/^<style[^>]*>/i, '').replace(/<\/style>\s*$/i, '').trim();
  }
  return text;
}

export function renderExpression(name, ctx) {
  const key = String(name ?? '').trim();
  const map = {
    pageBodyTitle: ctx.pageBodyTitle,
    pageBodyDesc: ctx.pageBodyDesc,
    pageBodyKeyword: ctx.pageBodyKeyword,
    pageBodyHTML: ctx.pageBodyHTML,
    pageBodyJS: ctx.pageBodyJS,
    pageBodyWelcome: encodeWelcomeContent(ctx.pageBodyWelcome),
    pageBodyFileType: ctx.pageBodyFileType,
    pageBodyFileType2: ctx.pageBodyFileType2,
    pageFaq: ctx.pageFaq,
    pageStyle: ctx.pageStyle,
    pageBrowserTitle: ctx.pageBrowserTitle,
    pageHasSettings: ctx.pageHasSettings ? 'true' : 'false',
    PrivacyContent: ctx.privacyContent,
    shortenDomain: ctx.shortenDomain,
    pageUrl: ctx.pageUrl,
    pageName: ctx.pageName,
  };
  return Object.prototype.hasOwnProperty.call(map, key) ? map[key] ?? '' : '${' + key + '}';
}

export function replaceExpressions(text, ctx) {
  return String(text ?? '').replace(/\$\{([^}]+)\}/g, (_, key) => renderExpression(key, ctx));
}

function encodeWelcomeContent(value) {
  return `b64:${Buffer.from(String(value ?? ''), 'utf8').toString('base64')}`;
}

function decodeWelcomeContent(value) {
  const text = String(value ?? '');
  if (!text.startsWith('b64:')) {
    return text;
  }

  try {
    return Buffer.from(text.slice(4), 'base64').toString('utf8');
  } catch {
    return text;
  }
}

export function renderLoadingTag() {
  // The .loading-tmp overlay is shown during page hydration. Previously each
  // page's own content was responsible for dismissing it (hub BODYHTMLs had
  // a trailing <script>; tool pages relied on downstream base-script.js;
  // guide pages had no dismiss logic). That divergence caused the April 2026
  // /guides/ incident — guide pages stayed stuck on the overlay forever.
  // Category A fix: embed the dismiss script inline in the loading-tag so
  // every page — tool, hub, guide, or any future kind — dismisses the
  // overlay uniformly on DOMContentLoaded.
  return `<style>.loading-tmp { line-height: 60px; text-align: center; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #ffffff; } .loading-tmp>i.fa-cog { font-size: 40px; opacity: .4; display: block; margin-top: 20px }</style><div class="loading-tmp"><i class="fa fa-cog fa-spin"></i><span style="color: #455a64;position: relative;top: -15px;">Initializing, please wait a moment</span></div><script>(function(){function h(){var o=document.querySelector('.loading-tmp');if(o){o.style.display='none';}}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',h);}else{h();}})();</script>`;
}

export function renderDownloadTag() {
  return `<div class='w3-row downloadContainer'><a id='downloadLink' target='_blank' href='#' style="margin: 10px 0">Click here to download</a></div>`;
}

export function renderWelcomeTag(content) {
  return `<div class='w3-container welcomeTag'><div class='w3-row'><div class='w3-container'>${decodeWelcomeContent(content)}</div></div></div>`;
}

export function renderShareButtons(ctx) {
  const shareUrl = `${ctx.shortenDomain || DEFAULT_SHORTEN_DOMAIN}${ctx.pageUrl}`;
  const escapedShareUrl = escapeHtml(shareUrl);
  return `<style>.shareBtn { padding: 3px 5px 3px!important; font-size: 11px!important; width: 55px; color: #202124; text-align: center; text-decoration: none; border-radius: 2px; border: 1px solid #ccd0d5!important }.shareBtn span { font-family: 'Google Sans',Roboto,Arial,sans-serif!important }.shareBtns { float: left; line-height: 9px; height: 22px; padding: 0!important; overflow: hidden }.shareBtns .fb, .shareBtns .tt, .shareBtns .li, .shareBtns .rd{ color: #fff }.shareBtns .fb { background-color: #0035a1; border-color: #003cb4 !important; }.shareBtns .tt { background-color: #007acd; border-color: #0083dc !important; }.shareBtns .li { background-color: #0064aa; border-color: #0066af !important; }.shareBtns .rd { background-color: #d53900; border-color: #cd3903 !important; }</style><div class='w3-row w3-col w3-container tagsTag'><div class='w3-row w3-col'><div class='w3-container shareBtns' style="margin-top: 5px"><a target="_blank" href="https://facebook.com/sharer.php?u=${escapedShareUrl}" class="fa shareBtn fa-facebook fb">&nbsp;&nbsp;<span>Share</span></a><a target="_blank" href="https://twitter.com/intent/tweet?url=${escapedShareUrl}" class="fa shareBtn fa-twitter tt">&nbsp;&nbsp;<span>Tweet</span></a><a target="_blank" href="http://www.linkedin.com/shareArticle?mini=true&url=${escapedShareUrl}" class="fa shareBtn fa-linkedin li">&nbsp;&nbsp;<span>Share</span></a><a target="_blank" href="http://www.reddit.com/submit?url=${escapedShareUrl}&title=Post%20to%20Reddit%20via%20${escapedShareUrl}" class="fa shareBtn fa-reddit rd">&nbsp;&nbsp;<span>Post</span></a></div></div></div>`;
}

export function renderUploadTag(ctx, appVersion) {
  return `<link rel="stylesheet" href="https://dkbg1jftzfsd2.cloudfront.net/style/upload-style.css?v=${escapeHtml(appVersion)}" /><script type="text/javascript" defer src="https://dkbg1jftzfsd2.cloudfront.net/script/upload-controls.js?v=${escapeHtml(appVersion)}"></script><div class='w3-container uploadContainer'><div class='w3-row'><div class='w3-container'><div class="target fs-upload-element fs-upload fs-light fs-upload-disabled"><div class="fs-upload-target">Finding optimal server, please wait a second</div></div></div><div class="w3-container"><div class="filelists"><ol class="filelist queue"></ol></div></div></div></div><div class='w3-row w3-container'><div class='w3-container'><span style='display: none;color: red;' class='errorMsgAction'></span></div></div>`;
}

export function renderUploadSecondTag() {
  return `<script>var onBeforeSendSecond = function(){}, onQueuedSecond = function(){}, onStartSecond = function(){}, onCompleteSecond = function(){}, onFileStartSecond = function(){}, onFileProgressSecond = function(){}, onFileCompleteSecond = function(){}, onFileErrorSecond = function(){}, initUploaderLoadSecond = function(){}, initUploaderSecond = function(){}, buildInputObjBeforeSendSecond = function(){};function uploadHandlersSecond(){buildInputObjBeforeSendSecond = function(inputObj){return inputObj;};onBeforeSendSecond = function(formData, file) {var inputObj = {};inputObj["id"] = web.id;inputObj["fileExtFilter"] = $('#fileTypeSecond').val();inputObj["pageName"] = pageName;inputObj["includeProcess"] = "false";inputObj["name"] = file.name;inputObj = buildInputObjBeforeSendSecond(inputObj);if (checkBeforeSet(web, inputObj, 'uploaderPrivIp')) {inputObj.uploaderPrivIp = web.uploaderPrivIp;}if (checkBeforeSet(web, inputObj, 'uploaderUrl')) {inputObj.uploaderUrl = web.uploaderUrl;}if (checkBeforeSet(web, inputObj, 'downloaderUrl')) {inputObj.downloaderUrl = web.downloaderUrl;}formData.append("json", JSON.stringify(inputObj));return formData;};onQueuedSecond = function(e, files) {var html = '';for (var i = 0; i < files.length; i++) {html += '<li data-index="' + files[i].index + '"><span class="content"><span class="file">' + files[i].name + '</span><span class="cancel">Cancel</span><span class="progress">Queued</span></span><span class="bar"></span></li>';}$(this).parents("div").find(".filelistSecond.queueSecond").append(html);};onStartSecond = function(e, files) {$(this).parents("div").find(".filelistSecond.queueSecond").find("li").find(".progress").not('.done').text("Waiting");};onCompleteSecond = function(e) {if (web.localUpload) {} else {var $step2 = $('.step2');$(this).parents("div").find(".progress").show();if(web.fileInfoResult.length > 0){$step2.show();} else {if (clickDelSecond) {if (!callingAjax){clickDelSecond = !clickDelSecond;}} else {$('.errorMsgActionSecond').text('Error has occured').show();}}}};onFileStartSecond = function(e, file) {var process = $(this).parents("div").find(".filelistSecond.queueSecond").find("li[data-index=" + file.index + "]").find(".progress");if(process.text().indexOf('Failed') < 0){process.text("0%");}};onFileProgressSecond = function(e, file, percent) {var $file = $(this).parents("div").find(".filelistSecond.queueSecond").find("li[data-index=" + file.index + "]");if(percent == '100'){$file.find(".progress").text('Processing');} else {$file.find(".progress").text(percent + "%");}$file.find(".bar").css("width", percent + "%");};onFileCompleteSecond = function(e, file, response) {$('.showDetailToggleSecond').show();var $item = $(this).parents("div").find(".filelistSecond.queueSecond").find("li[data-index=" + file.index + "]").find(".progress"), $process = $item.find(".progress");if (web.localUpload) {web.fileInfoResult.push(file.file);$process.addClass('done');$('.uploadedFiles').text(parseInt($('.uploadedFiles').text()) + 1);if($('.showDetailToggle').text() === 'Show detail'){$item.hide();}isFileCompleteIsDone = true;} else {response = response.trim();var textStatus = 'N/A', itemObj;if(response !== ''){$('.uploadedFilesSecond').text(parseInt($('.uploadedFilesSecond').text()) + 1);textStatus = 'Done';try{itemObj = JSON.parse(response);web.fileInfoResult.push(itemObj);} catch(e){textStatus = 'Failed';}} else {textStatus = 'Failed';}$process.text(textStatus).addClass('done');if($('.showDetailToggleSecond').text() === 'show detail' && typeof itemObj != 'undefined' && itemObj){$item.parent().parent().hide();}isFileCompleteIsDone = true;return itemObj;}};onFileErrorSecond = function(e, file, error, xhr, ajaxOptions) {$(this).parents("div").find(".filelistSecond.queueSecond").find("li[data-index=" + file.index + "]").addClass("error").find(".progress").text(error === 'size' ? "Error: File is too big": (error === 'maxfiles' ? "Error: Exceeded max files" : (error === 'invalid-file-ext' ? "Error: Invalid file extension" : (error === 'empty-file' ? "Error: Empty file" : "Failed")))).addClass('done');$(".targetSecond").hide();};};</script><div class='w3-container uploadContainerSecond'><div class='w3-row'><div class='w3-container'><div class="targetSecond fs-upload-element fs-upload fs-light fs-upload-disabled"><div class="fs-upload-target">Initializing, please wait a second</div></div></div><div class='w3-container'><div class="filelistsSecond"><ol class="filelistSecond queueSecond"></ol></div></div></div></div><div class='w3-row w3-container'><div class='w3-container'><span style='display: none;color: red;' class='errorMsgActionSecond'></span></div></div>`;
}

export function renderUploadStartupTag(multiple, fileType, ctx) {
  const resolvedMultiple = String(multiple ?? 'false');
  const resolvedFileType = String(fileType ?? '');
  return `<input type='hidden' id='maxFiles' value=''/><input type='hidden' id='multiple' value='${escapeHtml(resolvedMultiple)}'/><input type='hidden' id='fileType' value='${escapeHtml(resolvedFileType)}'/><input type='hidden' id='hasUploadFunc'/><script>var originalUploadText = "";function loadUploadWrapperScript(callback){uploadHandlers();typeof uploadHandlersSecond === "function" ? uploadHandlersSecond() : "";typeof loadUploadHandlersByPage === "function" ? loadUploadHandlersByPage() : "";loadScript('https://dkbg1jftzfsd2.cloudfront.net/script/lib/jquery/formstone-core-upload-1.1.3.min.190820.js?v=' + APP_VERSION, function(){typeof loadUpload2WrapperScript === "function" ? loadUpload2WrapperScript() : "";var includeProcess = false;try {var includeProcessFromConfig = JSON.parse(onBeforeSend($('<form></form>'), {file: ""}).text().substring('json'.length)).includeProcess;includeProcess = typeof includeProcessFromConfig !== "undefined" && includeProcessFromConfig;} catch (e){}initUploaderLoad = function(uploadUrl, maxFileUploadParallel){$('.target > .fs-upload-target').remove();$(".target").upload({maxSize: parseInt(web.maxFileSizeMb) * 1024 * 1024,beforeSend: onBeforeSend,action: uploadUrl,maxFiles: (includeProcess == true || includeProcess === 'true') ? ($('#maxFiles').val(web.maxFileToUpload) || $('.maxFiles b').text(web.maxFileToUpload) || web.maxFileToUpload) : ($('#maxFiles').val(maxFileToUploadFromServer) || $('.maxFiles b').text(maxFileToUploadFromServer) || maxFileToUploadFromServer),chunked: true,multiple: '${escapeHtml(resolvedMultiple)}' == 'true' || '${escapeHtml(resolvedMultiple)}' == 'TRUE',accept: '${escapeHtml(resolvedFileType)}',maxQueue: (includeProcess == true || includeProcess === "true") ? parseInt(maxFileUploadParallel) : 10}).on("start.upload", onStart).on("complete.upload", onComplete).on("filestart.upload", onFileStart).on("fileprogress.upload", onFileProgress).on("filecomplete.upload", onFileComplete).on("fileerror.upload", onFileError).on("queued.upload", onQueued);};initUploader = function(){initUploaderLoad(mainUploaderUrl + uploadPath, web.maxFileUploadParallel);if(web.id == null){$(".target").upload("disable");originalUploadText = $('.fs-upload-target').text();$('.fs-upload-target').text('Finding optimal server, please wait a second');}$('.upload-button').on('click', function (){$('#file')[0].click();});};initUploader();getPageSettings(popularUploaderFromPageId);});};</script>`;
}

export function renderUploadStartupSecondTag(multiple, fileType) {
  const resolvedMultiple = String(multiple ?? 'false');
  const resolvedFileType = String(fileType ?? '');
  return `<input type='hidden' id='multipleSecond' value='${escapeHtml(resolvedMultiple)}'/><input type='hidden' id='fileTypeSecond' value='${escapeHtml(resolvedFileType)}'/><script>function loadUpload2WrapperScript(){initUploaderLoadSecond = function(uploadUrl, maxFileUploadParallel){$('.targetSecond > .fs-upload-target').remove();$(".targetSecond").upload({maxSize: parseInt(web.maxFileSizeMb) * 1024 * 1024,beforeSend: onBeforeSendSecond,action: uploadUrl + "?t=" + getCurrentLongMills(),multiple: '${escapeHtml(resolvedMultiple)}' == 'true' || '${escapeHtml(resolvedMultiple)}' == 'TRUE',accept: '${escapeHtml(resolvedFileType)}',maxQueue: parseInt(maxFileUploadParallel)}).on("start.upload", onStartSecond).on("complete.upload", onCompleteSecond).on("filestart.upload", onFileStartSecond).on("fileprogress.upload", onFileProgressSecond).on("filecomplete.upload", onFileCompleteSecond).on("fileerror.upload", onFileErrorSecond).on("queued.upload", onQueuedSecond);};initUploaderSecond = function(){initUploaderLoadSecond(mainUploaderUrl + uploadPath, web.maxFileUploadParallel);if(web.id == null){$(".targetSecond").upload("disable");$('.fs-upload-target').text('Initializing, please wait a second');}$('.upload-button').on('click', function (){$('#file')[0].click();});$('.showDetailToggleSecond').on('click', function(){if($('.showDetailToggleSecond').text() === 'show detail'){$('.uploadContainerSecond').find('.filelistsSecond').find('li').show();$('.showDetailToggleSecond').text('hide detail');} else {$('.uploadContainerSecond').find('.filelistsSecond').find('li').each(function(){if($(this).find('.progress').text() !== 'Uploaded, please wait for processing' && $(this).find('.progress').text().indexOf('Failed') == -1 && $(this).find('.progress').text().indexOf('Error') == -1){$(this).hide();}});$('.showDetailToggleSecond').text('show detail');}});};initUploaderSecond();};</script>`;
}

export function renderBaseScript(ctx) {
  const randomStringValue = JSON.stringify(String(ctx.randomString ?? ''));
  // Absolute path (with basePath prefix) so module-loader.js resolves
  // correctly at any URL depth (e.g., /guides/<slug>.html, /vi/<slug>.html).
  // Was relative — broke at new URL depths (April 2026 /guides/ incident).
  const basePath = String(ctx.basePath ?? '');
  const moduleLoaderUrlJs = JSON.stringify(`${basePath}/script/module-loader.js?v=${encodeURIComponent(String(ctx.appVersion ?? ''))}`);
  return `<script type="text/javascript" defer src="https://dkbg1jftzfsd2.cloudfront.net/script/utils.js?v=${escapeHtml(ctx.appVersion)}"></script><script>var getRootPath = function(){return ${JSON.stringify(`${ctx.apiOrigin}`)};};var unsplashKey = ${JSON.stringify(ctx.unsplashKey ?? '')};var randomString = function(){var b = ${randomStringValue};return b ? b.split(";")[Math.floor(Math.random() * b.split(";").length)] : "";};var web = {};web.id = null;web.fileInfoResult = [];web.fileTypeInBlackList = '';web.maxFileUploadParallel = 1;web.maxFileSizeMb = null;web.minsToDelFile = 1;web.folderUpload = false;var getAvailabelId = function(){}, parseGetIdRes = function(){}, lookAnotherAZ = function(){}, processUnHeathyLogic = function(){}, getAvailabelWs = function(){}, myAccFunc = function(){}, openMenu = function(){}, toggleMenu = function(){}, showHideMenu = function(){}, initPageCompomentsAndEvent = function(){}, focusCurrentMenu = function(){}, fixIOSOverplayScrolling = function(){}, checkIfGetRating = function(){}, loadPageBG = function(){}, w_winds = 0, scrollEvn = function(){}, callAjax = function(){}, callAjaxSlient = function(){}, loadForInfosPage = function(){}, loadRelatedTools = function(){}, doStuffWhenOnload = function(){}, clickDel = false, clickDelSecond = false, callingAjax = false, isLoadAds = false, loadAds = function(){}, disableAds = function(){}, loadCookieConsent = function(){}, ajaxErrorHandler = function(){}, loadStarRating = function(){}, getTimeToDelFileInfo = function(){}, getPageSettings = function(){}, toTop = function(){}, scrollToContent = function(){}, getServerDone = false, hasUpload = false, hasGetServer = ${JSON.stringify(Boolean(ctx.pageUrl))}, backendDownText = '', notAuthHtml = '', maxFileToUploadFromServer = 0;var mainUploaderUrl = null, localDev = false, ioInfos = eval(${JSON.stringify(ctx.ioInfos ?? '[]')}), getAlterUploaderDelayMs = parseInt(${JSON.stringify(String(ctx.getAlterUploaderDelayMs ?? '100'))}, 10), uploaderErrorCounts = 0, availableUploaders = [], mainWsUrl = null, secondWsUrl = [], allWsUrl = [], requestedSecondWs = [], heathyWsesState = [], firstWsResultIdx = -1, firstWsResult = null, heathCheckTimeOutMillis = 0, uploadPath = 'uploadfile', processPath = 'ajax/process', pageName = ${JSON.stringify(ctx.pageName)}, bgsList = eval(${JSON.stringify(ctx.bgsCollection ?? '[]')}), APP_VERSION = ${JSON.stringify(ctx.appVersion)}, IO_VERSION = ${JSON.stringify(ctx.ioVersion)};function startScripts(){w_winds = $(window).width();backendDownText = BE_DOWN;notAuthHtml = NOT_AUTH;String.prototype.format = function(){var t = arguments;return this.replace(/{(\\d+)}/g, function(e, n){return "undefined" != typeof t[n] ? t[n] : e})}, String.format = function(t){var e = Array.prototype.slice.call(arguments, 1);return t.replace(/{(\\d+)}/g, function(t, n){return "undefined" != typeof e[n] ? e[n] : t})}, $(function() {});$.fn.scrollStopped = function(callback) {var that = this, $this = $(that);$this.scroll(function(ev) {clearTimeout($this.data('scrollTimeout'));$this.data('scrollTimeout', setTimeout(callback.bind(that), 250, ev));});};loadScript(localDev ? '/cdn/script/module-loader.js' : ${moduleLoaderUrlJs}, function(){});loadScript(localDev ? '/cdn/script/base-script.js' : 'https://dkbg1jftzfsd2.cloudfront.net/script/base-script.js?v=' + APP_VERSION, function(){initPageCompomentsAndEvent = function(callback){if (typeof doAfterPageRendered === "function") { doAfterPageRendered(); }if (typeof doAfterJqueryUILoadDatePicker === "function") {loadDeferredStyle('https://dkbg1jftzfsd2.cloudfront.net/style/lib/jquery-ui.min.css');loadScript('https://dkbg1jftzfsd2.cloudfront.net/script/lib/jquery/jquery-ui/1.12.1/datepicker/jquery-ui.min.js', function(){doAfterJqueryUILoadDatePicker();});}if (typeof doAfterJqueryUILoadToolTip === "function") {loadDeferredStyle('https://dkbg1jftzfsd2.cloudfront.net/style/lib/jquery-ui.min.css');loadScript('https://dkbg1jftzfsd2.cloudfront.net/script/lib/jquery/jquery-ui/1.12.1/tooltip/jquery-ui.min.js', function(){doAfterJqueryUILoadToolTip();});}if (typeof doAfterJqueryUILoadAutoComplete === "function") {loadDeferredStyle('https://dkbg1jftzfsd2.cloudfront.net/style/lib/jquery-ui.min.css');loadScript('https://dkbg1jftzfsd2.cloudfront.net/script/lib/jquery/jquery-ui/1.12.1/autocomplete/jquery-ui.min.js', function(){doAfterJqueryUILoadAutoComplete();});}if (typeof doAfterJqueryUILoadFull === "function") {loadDeferredStyle('https://dkbg1jftzfsd2.cloudfront.net/style/lib/jquery-ui.min.css');loadScript('https://dkbg1jftzfsd2.cloudfront.net/script/lib/jquery/jquery-ui/1.11.0/jquery-ui.min.js', function(){doAfterJqueryUILoadFull();});}typeof callback === "function" ? callback() : "";};initPageCompomentsAndEvent();});};</script>`;
}

