<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="slug" value="sondoong" />
<jsp:include page="/WEB-INF/jsp/head.jsp">
  <jsp:param name="slug" value="${slug}" />
</jsp:include>
<main>
  <div class="page-content">
    <div class="page-section">
      <jsp:include page="/WEB-INF/jsp/bodyhtml.jsp">
        <jsp:param name="slug" value="${slug}" />
      </jsp:include>
    </div>
    <div class="page-section welcome">
      <jsp:include page="/WEB-INF/jsp/bodywelcome.jsp">
        <jsp:param name="slug" value="${slug}" />
      </jsp:include>
    </div>
    <div class="page-section faq">
      <jsp:include page="/WEB-INF/jsp/faq.jsp">
        <jsp:param name="slug" value="${slug}" />
      </jsp:include>
    </div>
  </div>
</main>
<jsp:include page="/WEB-INF/jsp/foot.jsp" />
