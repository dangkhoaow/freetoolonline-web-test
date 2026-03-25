<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<freetoolonline:page 
	customStyle='${pageStyle}'
	browserTitle='${pageBodyTitle}' 
	keyword='${pageBodyKeyword}' 
	description='${pageBodyDesc}'>
	
	<freetoolonline:loading/>

	<!-- BODYHTML -->
	${pageBodyHTML}
	
	<freetoolonline:welcome welcomeTest='${pageBodyWelcome}'/>
	<freetoolonline:share-btns></freetoolonline:share-btns>
	
	<!-- BODYJS -->
	${pageBodyJS}
	

</freetoolonline:page>