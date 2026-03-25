<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@ taglib uri='http://java.sun.com/jsp/jstl/core' prefix='c' %>
<freetoolonline:page 
	customStyle='${pageStyle}'
	hasSettings='${pageHasSettings}'
	browserTitle='${pageBrowserTitle}' 
	pageTitle='${pageBodyTitle}'
	keyword='${pageBodyKeyword}' 
	description='${pageBodyDesc}'>
	
	<div class='step step1 w3-container'>
		<freetoolonline:upload/>
	</div>
	<div class='step step3 downloadBtnContainer w3-container'>
		<div class='w3-container'>
			<freetoolonline:download/>
		</div>
	</div>

	<!-- BODYHTML -->
	${pageBodyHTML}					

	<freetoolonline:welcome welcomeTest='${pageBodyWelcome}'/>
	<freetoolonline:share-btns></freetoolonline:share-btns>
	
	<!-- BODYJS -->
	${pageBodyJS}
	
	<freetoolonline:upload-startup multiple='true' fileType='${pageBodyFileType}'/>
</freetoolonline:page>