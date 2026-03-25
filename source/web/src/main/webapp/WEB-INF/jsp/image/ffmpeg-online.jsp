<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@ taglib uri='http://java.sun.com/jsp/jstl/functions' prefix='fn' %>
<freetoolonline:page 
	customStyle='${pageStyle}'
	browserTitle='${pageBodyTitle}' 
	keyword='${pageBodyKeyword}' 
	description='${pageBodyDesc}'>

	<div class='step step1 w3-container'>
		<freetoolonline:upload/>
	</div>
	
	<!-- BODYHTML -->
	${pageBodyHTML}
	
	<div class='step step3 w3-container'>
        <freetoolonline:download/>
        <p>The executing process has completed. Command out below:</p>
        <textarea id='consoleOut' disabled="disabled" style='height: 250px;background-color: #fff !important;'></textarea>
    </div>
    <br/>
	
	<freetoolonline:welcome welcomeTest='${pageBodyWelcome}'/>
	<freetoolonline:share-btns></freetoolonline:share-btns>
	
	<!-- BODYJS -->
	${pageBodyJS}
	 
	<freetoolonline:upload-startup multiple='false' fileType='${pageBodyFileType}'/>
</freetoolonline:page>