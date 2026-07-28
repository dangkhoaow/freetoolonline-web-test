<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${pageContext.request.requestURL}">
    <meta property="og:site_name" content="FreeToolOnline">
    <meta name="description" content="${empty BODYDESC ? 'FreeToolOnline' : BODYDESC}">
    <title>${empty BODYTITLE ? 'Ceres Cryovolcanism Explorer' : BODYTITLE}</title>
    <link rel="canonical" href="https://freetoolonline.com/space-3d/ceres-cryovolcanism.html">
    <link rel="stylesheet" href="/static/css/w3-bundle.min.css">
    <script>
      var BASE_PATH = '${empty pageContext.request.contextPath ? "/" : pageContext.request.contextPath}';
      window.TOOL_ROUTE = '/space-3d/ceres-cryovolcanism.html';
      window.BODY_CONTENT_FRAG = BASE_PATH + 'static/view/CMS/BODYHTMLcerescryovolcanism.html';
      window.BODY_WELCOME_FRAG = BASE_PATH + 'static/view/CMS/BODYWELCOMEcerescryovolcanism.html';
      window.BODY_FAQ_FRAG = BASE_PATH + 'static/view/CMS/FAQcerescryovolcanism.html';
      window.BODY_JS_FRAG = BASE_PATH + 'static/view/CMS/BODYJScerescryovolcanism.html';
      window.BODY_STYLE_FRAG = null;
    </script>
  </head>
  <body><%@ include file="/WEB-INF/jsp/common-header-nav.jsp"%><%@ include file="/WEB-INF/jsp/page-loader-shell.jsp"%></body>
</html>
