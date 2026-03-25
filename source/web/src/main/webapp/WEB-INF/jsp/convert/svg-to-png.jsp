<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@ taglib uri='http://java.sun.com/jsp/jstl/functions' prefix='fn' %>
<freetoolonline:page 
	browserTitle='${pageBodyTitle}' 
	keyword='${pageBodyKeyword}' 
	description='${pageBodyDesc}'>
	
	<freetoolonline:upload/>
	
	<div class='w3-container downloadC w3-hide'>
	    <freetoolonline:download/>
	</div>
	
	<!-- BODYHTML -->
	${pageBodyHTML}
	
	<freetoolonline:welcome welcomeTest='${pageBodyWelcome}'/>
	<freetoolonline:share-btns></freetoolonline:share-btns>

	<!-- BODYJS -->
	${pageBodyJS}

	<freetoolonline:upload-startup multiple='true' fileType='${pageBodyFileType}'/>
</freetoolonline:page>