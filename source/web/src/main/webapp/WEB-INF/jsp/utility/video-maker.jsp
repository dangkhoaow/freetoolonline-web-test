<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@ taglib uri='http://java.sun.com/jsp/jstl/functions' prefix='fn' %>
<freetoolonline:page 
	customStyle='${pageStyle}'
	browserTitle='${pageBodyTitle}' 
	keyword='${pageBodyKeyword}' 
	description='${pageBodyDesc}'>
	
	<div class='step step1 w3-row w3-container'>
		<div class='w3-half uploadImgSection'>
			<freetoolonline:upload/>
		</div>
		<div class='w3-half'>
			<freetoolonline:upload-second/>
		</div>		
	</div>
	
	<!-- BODYHTML -->
	${pageBodyHTML}

	<freetoolonline:welcome welcomeTest='${pageBodyWelcome}'/>
	<freetoolonline:share-btns></freetoolonline:share-btns>
	
	<!-- BODYJS -->	
	${pageBodyJS}

	<freetoolonline:upload-startup multiple='true' fileType='${pageBodyFileType}'/>
	<freetoolonline:upload-startup-second multiple='false' fileType='${pageBodyFileType2}'/>
</freetoolonline:page>