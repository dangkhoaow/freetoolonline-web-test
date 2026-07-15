<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<freetoolonline:page 
	browserTitle='${pageBodyTitle}' 
	keyword='${pageBodyKeyword}' 
	description='${pageBodyDesc}'>
	
	<freetoolonline:loading/>
	
	<!-- BODYHTML -->
	${pageBodyHTML}
	
</freetoolonline:page>
