<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.time.LocalDateTime, java.time.format.DateTimeFormatter" %>
<% request.setAttribute("pageName", "salar-de-uyuni"); %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${cmsFragments.BODYTITLE != null ? cmsFragments.BODYTITLE : "Salar de Uyuni 3D Explorer"}</title>
  <meta name="description" content="${cmsFragments.BODYDESC != null ? cmsFragments.BODYDESC : 'Explore the world\'s largest salt flat in 3D'}">
  <meta name="keywords" content="${cmsFragments.BODYKW != null ? cmsFragments.BODYKW : 'salt flat,bolivia,3d explorer'}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta property="og:title" content="${cmsFragments.BODYTITLE}">
  <meta property="og:description" content="${cmsFragments.BODYDESC}">
  <meta property="og:image" content="/img/share-cards/salar-de-uyuni.png">
  <meta property="og:url" content="https://freetoolonline.com/places-3d/salar-de-uyuni.html">
  <link rel="canonical" href="https://freetoolonline.com/places-3d/salar-de-uyuni.html">
  <link rel="stylesheet" href="/css/w3.css">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <div class="w3-container" style="max-width: 1200px; margin: 0 auto;">
    <h1>${cmsFragments.BODYTITLE}</h1>
    ${cmsFragments.BODYHTML}
    ${cmsFragments.BODYWELCOME}
    ${cmsFragments.FAQ}
  </div>
  ${cmsFragments.BODYJS}
</body>
</html>