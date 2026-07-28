<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title><%= request.getAttribute("pageTitle") %></title>
    <meta charset="utf-8"/>
    <meta name="description" content="<%= request.getAttribute("pageDesc") %>"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="keywords" content="<%= request.getAttribute("pageKw") %>"/>
    <link rel="canonical" href="<%= request.getAttribute("pageCanonical") %>"/>
    <link rel="stylesheet" href="<%= request.getAttribute("staticPath") %>/w3.css"/>
    <link rel="stylesheet" href="<%= request.getAttribute("staticPath") %>/w3-colors.css"/>
    <link rel="stylesheet" href="<%= request.getAttribute("staticPath") %>/style.css"/>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .page-section { background: #fff; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); margin: 16px 0; padding: 16px; }
        .byline { font-size: 0.9em; color: #666; }
    </style>
</head>
<body>
    <%= request.getAttribute("headerHtml") %>
    <main class="w3-container" style="max-width:900px; margin:0 auto; padding:16px;">
        <%= request.getAttribute("bodyWelcome") %>
        <%= request.getAttribute("bodyHtml") %>
        <%= request.getAttribute("bodyJs") %>
        <%= request.getAttribute("faq") %>
    </main>
    <%= request.getAttribute("footerHtml") %>
    <script src="<%= request.getAttribute("staticPath") %>/script/related-tools.js"></script>
    <script>doAfterPageRendered && doAfterPageRendered();</script>
</body>
</html>
