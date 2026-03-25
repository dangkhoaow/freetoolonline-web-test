<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@ taglib uri='http://java.sun.com/jsp/jstl/functions' prefix='fn' %>
<freetoolonline:page 
	browserTitle='${pageBodyTitle}' 
	keyword='${pageBodyKeyword}' 
	description='${pageBodyDesc}'>
	
	<div class='step step1 w3-container'>
		<freetoolonline:upload/>
	</div>
	
	<div class='step step2'>
		<!-- BODYHTML -->
		${pageBodyHTML}
		
		<div class='step step3 w3-container'>
			<p>The flattening pdf process has completed.</p>
			<freetoolonline:download/>
		</div>
	</div>
	
	<freetoolonline:welcome welcomeTest='${pageBodyWelcome}'/>
	<freetoolonline:share-btns></freetoolonline:share-btns>
		
	<!-- BODYJS -->
	${pageBodyJS}
	
	<freetoolonline:upload-startup multiple='false' fileType='${pageBodyFileType}'/>
</freetoolonline:page>