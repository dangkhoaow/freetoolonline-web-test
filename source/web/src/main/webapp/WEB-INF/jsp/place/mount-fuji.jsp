<%@ page pageEncoding="UTF-8" %>
<%@ page import="java.io.*" %>
<% 
  String title = "Mount Fuji: Japan's Sacred Volcanic Peak - 3D Explorer";
  String description = "Explore Mount Fuji, Japan's iconic 3,776 m volcanic cone with perfect symmetry, snow cap, and forested slopes. Interactive 3D visualization of Japan's most sacred mountain.";
%>
<jsp:include page="/WEB-INF/jsp/header.jsp">
  <jsp:param name="title" value="<%= title %>" />
  <jsp:param name="description" value="<%= description %>" />
  <jsp:param name="route" value="/places-3d/mount-fuji.html" />
</jsp:include>

<div class="page-wrapper">
  <div id="main-content">
    <!-- BODYHTML -->
    <jsp:include page="/resources/view/CMS/BODYHTMLmountfuji.html" />
    
    <!-- BODYWELCOME -->
    <jsp:include page="/resources/view/CMS/BODYWELCOMEmountfuji.html" />
    
    <!-- FAQ -->
    <jsp:include page="/resources/view/CMS/FAQmountfuji.html" />
  </div>
</div>

<script src="/vendor/three/three.min.js"></script>
<script src="/vendor/three/OrbitControls.js"></script>
<!-- BODYJS -->
<script>
<jsp:include page="/resources/view/CMS/BODYJSmountfuji.html" />
</script>

<jsp:include page="/WEB-INF/jsp/footer.jsp" />