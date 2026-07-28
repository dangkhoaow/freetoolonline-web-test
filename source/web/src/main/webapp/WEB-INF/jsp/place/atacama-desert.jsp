<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.freetool.web.PageRenderer" %>
<%
  String slug = "atacamadesert";
  String title = PageRenderer.getCMSFragment(request, slug, "BODYTITLE", "Atacama Desert 3D Explorer");
  String description = PageRenderer.getCMSFragment(request, slug, "BODYDESC", "");
  String keywords = PageRenderer.getCMSFragment(request, slug, "BODYKW", "");
  String bodyHtml = PageRenderer.getCMSFragment(request, slug, "BODYHTML", "");
  String bodyWelcome = PageRenderer.getCMSFragment(request, slug, "BODYWELCOME", "");
  String faqHtml = PageRenderer.getCMSFragment(request, slug, "FAQ", "");
  String bodyJs = PageRenderer.getCMSFragment(request, slug, "BODYJS", "");
%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %></title>
  <meta name="description" content="<%= description %>">
  <meta name="keywords" content="<%= keywords %>">
  <%@ include file="/WEB-INF/jsp/shared/meta-canonical.jsp" %>
  <%@ include file="/WEB-INF/jsp/shared/meta-og.jsp" %>
  <%@ include file="/WEB-INF/jsp/shared/head-styles.jsp" %>
</head>
<body>
  <%@ include file="/WEB-INF/jsp/shared/top-page-banner-ad.jsp" %>
  <%@ include file="/WEB-INF/jsp/shared/l-menu.jsp" %>
  <main class="w3-container w3-center page-content">
    <%= bodyWelcome %>
    <div class="page-section"><%= bodyHtml %></div>
    <div class="page-section faq"><%= faqHtml %></div>
  </main>
  <%@ include file="/WEB-INF/jsp/shared/footer.jsp" %>
  <%= bodyJs %>
</body>
</html>
