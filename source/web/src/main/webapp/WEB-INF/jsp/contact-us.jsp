<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<freetoolonline:page browserTitle='${pageBodyTitle}' description='${pageBodyDesc}'
	customStyle='${pageStyle}'>
  	<!-- The Contact Section -->
  	<freetoolonline:loading/>
	<!-- BODYHTML -->
	${pageBodyHTML}
</freetoolonline:page>