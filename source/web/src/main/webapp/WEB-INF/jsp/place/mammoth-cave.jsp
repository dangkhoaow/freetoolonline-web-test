<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/jsp/common/header.jsp" %>
<main>
  <% request.setAttribute("slug", "mammothcave"); %>
  <div class="w3-container w3-margin-top">
    <%= renderPageTitle(request.getAttribute("slug").toString(), config.getServletContext().getRealPath("")) %>
    <div class="w3-content" style="max-width: 1200px;">
      <%= renderBodyHTML(request.getAttribute("slug").toString(), config.getServletContext().getRealPath("")) %>
      <%= renderBodyWelcome(request.getAttribute("slug").toString(), config.getServletContext().getRealPath("")) %>
      <%= renderFAQ(request.getAttribute("slug").toString(), config.getServletContext().getRealPath("")) %>
    </div>
  </div>
  <%= renderBodyJS(request.getAttribute("slug").toString(), config.getServletContext().getRealPath("")) %>
</main>
<%@ include file="/WEB-INF/jsp/common/footer.jsp" %>
