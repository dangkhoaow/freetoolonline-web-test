<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@ page language='java' pageEncoding='UTF-8'%>
<%@ page contentType='text/html;charset=UTF-8' %>
<freetoolonline:page 
	customStyle='${pageStyle}'
	browserTitle='${pageBodyTitle}'  
	keyword='${pageBodyKeyword}' 
	description='${pageBodyDesc}'
	lang="vi">
	
	<!-- BODYHTML -->
	${pageBodyHTML}

	<freetoolonline:share-btns></freetoolonline:share-btns>

	<!-- BODYJS -->
	${pageBodyJS}

</freetoolonline:page>