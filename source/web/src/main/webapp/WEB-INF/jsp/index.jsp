<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@ page language='java' pageEncoding='UTF-8'%>
<%@ page contentType='text/html;charset=UTF-8' %>
<freetoolonline:page 
	browserTitle='${pageBodyTitle}' 
	description='${pageBodyDesc}'
	customStyle='${pageStyle}'>
	
	<!-- BODYHTML -->
	${pageBodyHTML}
	
	<freetoolonline:welcome welcomeTest='${pageBodyWelcome}'/>
	
	<freetoolonline:share-btns></freetoolonline:share-btns>
 
</freetoolonline:page>