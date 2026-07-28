<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.*" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta property="og:type" content="website">
  <meta property="og:image" content="/img/og/mount-fuji_og.png">
  <meta property="twitter:image" content="/img/twitter/mount-fuji_twitter.png">
  <link rel="icon" type="image/svg+xml" href="/img/icons/mount-fuji_icon.svg">
  <link rel="apple-touch-icon" href="/img/icons/mount-fuji_apple.png">
  <jsp:include page="../fragments/page-head.jsp" />
</head>
<body class="w3-light-gray">
  <jsp:include page="../fragments/top-nav-v3.jsp" />
  <jsp:include page="../fragments/top-page-banner-ad.jsp" />
  <div class="w3-row w3-padding-top" id="page-container">
    <div class="w3-col m10 l8 w3-margin-auto">
      <h1 id="page-title"></h1>
      <div id="page-content"></div>
    </div>
  </div>
  <jsp:include page="../fragments/footer.jsp" />
  <script type="module" src="/script/page-load.js"></script>
  <script src="/vendor/three/three.min.js"></script>
</body>
</html>
