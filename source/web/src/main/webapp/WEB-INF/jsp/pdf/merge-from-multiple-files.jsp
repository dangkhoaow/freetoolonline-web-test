<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@ taglib uri='http://java.sun.com/jsp/jstl/functions' prefix='fn' %>
<freetoolonline:page 
	browserTitle='${pageBodyTitle}' 
	keyword='${pageBodyKeyword}' 
	description='${pageBodyDesc}'>
	
	<div class='step step1 w3-container'>
		<freetoolonline:upload/>
	</div>
	
	<div class='step step2 w3-container'>
		<!-- BODYHTML -->
		${pageBodyHTML}
		
		<div class='w3-row step step3 w3-container'>
			<freetoolonline:download/>
			<p>The merging process has completed.</p>
		</div>
		<br/>
	</div>
	
	<freetoolonline:welcome welcomeTest='${pageBodyWelcome}'/>
	<freetoolonline:share-btns></freetoolonline:share-btns>

	<!-- BODYJS -->	
	${pageBodyJS}

	<freetoolonline:upload-startup multiple='true' fileType='${pageBodyFileType}'/>
</freetoolonline:page>