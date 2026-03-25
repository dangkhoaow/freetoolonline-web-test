<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<freetoolonline:page 
	customStyle='${pageStyle}'
	browserTitle='${pageBodyTitle}' 
	keyword='${pageBodyKeyword}' 
	description='${pageBodyDesc}'>
	
	<freetoolonline:loading/>
	
	<!-- BODYHTML -->
	${pageBodyHTML}
	
	<!-- BODYJS -->
	${pageBodyJS}


	<freetoolonline:welcome welcomeTest='${pageBodyWelcome}'/>
	<freetoolonline:share-btns></freetoolonline:share-btns>
</freetoolonline:page>