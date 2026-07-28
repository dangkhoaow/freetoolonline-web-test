<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.io.*" %>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= request.getAttribute("pageTitle") %></title>
    <meta name="description" content="<%= request.getAttribute("pageDescription") %>">
    <meta name="keywords" content="<%= request.getAttribute("pageKeywords") %>">
    <link rel="canonical" href="<%= request.getAttribute("canonicalUrl") %>">
    <script>
      var BASE_PATH = '<%= request.getAttribute("basePath") %>';
      var web = {}; 
    </script>
  </head>
  <body>
    <header id="headerContainer"></header>
    <main>
      <div id="mainContent">
        <%= request.getAttribute("bodyTitle") %>
        <%= request.getAttribute("bodyHtml") %>
        <%= request.getAttribute("bodyJs") %>
        <%= request.getAttribute("bodyWelcome") %>
        <%= request.getAttribute("faq") %>
      </div>
    </main>
    <footer id="footerContainer"></footer>
    <script src="/static/script/app.js"></script>
  </body>
</html>
