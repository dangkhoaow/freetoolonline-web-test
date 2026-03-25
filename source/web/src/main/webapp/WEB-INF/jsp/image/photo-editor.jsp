<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@ taglib uri='http://java.sun.com/jsp/jstl/functions' prefix='fn' %>
<%@ taglib uri='http://java.sun.com/jsp/jstl/core' prefix='c' %>
<c:set var="basedHostWithRootPath" value="${workingDomain}" />

<freetoolonline:page 
	browserTitle='${pageBodyTitle}' 
	keyword='${pageBodyKeyword}' 
	description='${pageBodyDesc}'
	customStyle='${pageStyle}'>
	
	<freetoolonline:loading/>
	
	<!-- BODYHTML -->
	${pageBodyHTML}
	
	<freetoolonline:welcome welcomeTest='${pageBodyWelcome}'/>
	<freetoolonline:share-btns></freetoolonline:share-btns>
	
	<!-- BODYJS -->
	${pageBodyJS}
	
</freetoolonline:page>