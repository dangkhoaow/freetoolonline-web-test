<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@ taglib uri='http://java.sun.com/jsp/jstl/functions' prefix='fn' %>
<freetoolonline:page 
	browserTitle='${pageBodyTitle}' 
	keyword='${pageBodyKeyword}' 
	description='${pageBodyDesc}'
	customStyle='${pageStyle}'>
	
	<freetoolonline:loading/>
	
	<div class='w3-container'>
		<!-- BODYHTML -->
		${pageBodyHTML}
		
		<div class='step step2 w3-container'>
			<freetoolonline:download/>
			<p>The generating process has completed.</p>
		</div>
	</div>
	
	<freetoolonline:welcome welcomeTest='${pageBodyWelcome}'/>
	<freetoolonline:share-btns></freetoolonline:share-btns>
	
	<!-- BODYJS -->
	${pageBodyJS}

</freetoolonline:page>