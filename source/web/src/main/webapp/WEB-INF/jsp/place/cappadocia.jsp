<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="description" content="Explore Cappadocia's fairy chimneys and Ihlara Valley in an interactive 3D landscape">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cappadocia 3D Explorer</title>
<link rel="stylesheet" href="/static/css/w3.css">
<link rel="stylesheet" href="/static/css/theme.css">
<link rel="stylesheet" href="/static/css/t3d-shell.css">
</head>
<body>
<jsp:include page="../../resources/view/top-page-banner-ad.html" />
<div class="w3-main">
  <jsp:include page="../../resources/view/l-menu.html" />
  <div class="page-container">
    <article class="page-section">
      <h1>Cappadocia 3D Explorer - Fairy Chimneys & Ihlara Valley</h1>
      <%= CMS.load("BODYWELCOMEcappadocia.html") %>
    </article>
    <article class="page-section">
      <%= CMS.load("BODYHTMLcappadocia.html") %>
      <script>
        <%= CMS.load("BODYJScappadocia.html") %>
      </script>
    </article>
    <article class="page-section faq">
      <%= CMS.load("FAQcappadocia.html") %>
    </article>
    <jsp:include page="../../resources/view/related-tools-dynamic.html" />
    <jsp:include page="../../resources/view/footer.html" />
  </div>
</div>
</body>
</html>