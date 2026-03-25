<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<freetoolonline:page 
	browserTitle='${pageBodyTitle}' 
	keyword='${pageBodyKeyword}' 
	description='${pageBodyDesc}'>
	
	<freetoolonline:loading/>
	
	<c:choose>
		<c:when test="${not empty localDev and true eq localDev}">
			<link rel="stylesheet" type="text/css" href="/cdn/style/utility/camera-test.css" />
		</c:when>    
		<c:otherwise>
			<link rel="stylesheet" type="text/css" href="https://dkbg1jftzfsd2.cloudfront.net/style/utility/camera-test.css?v=${AppVersion}" />
		</c:otherwise>
	</c:choose>
	
	<!-- BODYHTML -->
	${pageBodyHTML}
	
	<freetoolonline:welcome welcomeTest='${pageBodyWelcome}'/>
	<freetoolonline:share-btns></freetoolonline:share-btns>
	
	<!-- BODYJS -->
	${pageBodyJS}

</freetoolonline:page>