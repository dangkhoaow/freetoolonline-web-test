<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<freetoolonline:page
	customStyle='${pageStyle}'
	browserTitle='${pageBodyTitle}'
	keyword='${pageBodyKeyword}'
	description='${pageBodyDesc}'>
	<freetoolonline:loading/>
	${pageBodyHTML}
	<freetoolonline:share-btns></freetoolonline:share-btns>
</freetoolonline:page>
