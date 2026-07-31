<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="com.freetool.PageRenderer" %>

<% 
  String slug = "pamir-plateau";
  String title = PageRenderer.loadCMSFragment(request.getServletContext(), "BODYTITLE" + PageRenderer.slugToCMS(slug) + ".txt", "Pamir Plateau 3D Explorer");
  String description = PageRenderer.loadCMSFragment(request.getServletContext(), "BODYDESC" + PageRenderer.slugToCMS(slug) + ".txt", "");
  String bodyHTML = PageRenderer.loadCMSFragment(request.getServletContext(), "BODYHTML" + PageRenderer.slugToCMS(slug) + ".html", "");
  String bodyWelcome = PageRenderer.loadCMSFragment(request.getServletContext(), "BODYWELCOME" + PageRenderer.slugToCMS(slug) + ".html", "");
  String bodyJS = PageRenderer.loadCMSFragment(request.getServletContext(), "BODYJS" + PageRenderer.slugToCMS(slug) + ".html", "");
  String faq = PageRenderer.loadCMSFragment(request.getServletContext(), "FAQ" + PageRenderer.slugToCMS(slug) + ".html", "");
%>

<% 
  if ("true".equals(request.getServletContext().getInitParameter("exportStatic"))) {
    out.print("<!-- BODYTITLE:" + slug + " -->\n" + title + "\n");
    out.print("<!-- BODYDESC:" + slug + " -->\n" + description + "\n");
    out.print("<!-- BODYHTML:" + slug + " -->\n" + bodyHTML + "\n");
    out.print("<!-- BODYWELCOME:" + slug + " -->\n" + bodyWelcome + "\n");
    out.print("<!-- BODYJS:" + slug + " -->\n" + bodyJS + "\n");
    out.print("<!-- FAQ:" + slug + " -->\n" + faq + "\n");
  }
%>

<h1><%= title %></h1>
<%= bodyHTML %>
<div class="w3-row page-section" style="margin-top: 32px;">
  <%= bodyWelcome %>
</div>
<div style="margin-top: 32px;">
  <%= bodyJS %>
</div>
<%= faq %>
