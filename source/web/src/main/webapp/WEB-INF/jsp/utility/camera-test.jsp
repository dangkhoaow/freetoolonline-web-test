<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<freetoolonline:page 
	browserTitle='${pageBodyTitle}' 
	keyword='${pageBodyKeyword}' 
	description='${pageBodyDesc}'>
	
	<freetoolonline:loading/>

	<link rel="stylesheet" type="text/css" href="https://dkbg1jftzfsd2.cloudfront.net/style/utility/camera-test.css?v=${AppVersion}" />
	
	<!-- BODYHTML -->
	${pageBodyHTML}
	
	<freetoolonline:welcome welcomeTest='${pageBodyWelcome}'/>
	<freetoolonline:share-btns></freetoolonline:share-btns>
	
	<!-- BODYJS -->
	${pageBodyJS}

</freetoolonline:page>