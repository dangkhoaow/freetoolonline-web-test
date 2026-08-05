<%@ taglib tagdir='/WEB-INF/tags/' prefix='freetoolonline' %>
<%@ taglib uri='http://java.sun.com/jsp/jstl/functions' prefix='fn' %>
<freetoolonline:page
customStyle='${pageStyle}'
browserTitle='${pageBodyTitle}'
keyword='${pageBodyKeyword}'
description='${pageBodyDesc}'>

<freetoolonline:loading/>
${pageBodyHTML}
<freetoolonline:welcome welcomeTest='${pageBodyWelcome}'/>
<freetoolonline:share-btns></freetoolonline:share-btns>
${pageBodyJS}
</freetoolonline:page>
