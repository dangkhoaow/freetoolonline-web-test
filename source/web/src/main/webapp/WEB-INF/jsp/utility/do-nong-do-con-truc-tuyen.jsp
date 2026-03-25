<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@ page language='java' pageEncoding='UTF-8'%>
<%@ page contentType='text/html;charset=UTF-8' %>

<freetoolonline:page 
	lang="vi"
	customStyle='${pageStyle}'
	browserTitle='${pageBodyTitle}' 
	keyword='${pageBodyKeyword}' 
	description='${pageBodyDesc}'>

	<!-- BODYHTML -->
	${pageBodyHTML}	

	<freetoolonline:share-btns></freetoolonline:share-btns>

	<!-- BODYJS -->
	${pageBodyJS}
 
</freetoolonline:page>