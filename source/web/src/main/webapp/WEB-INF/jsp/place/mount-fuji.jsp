<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
    <title><c:out value="${param.title}"/></title>
    <meta charset="UTF-8">
    <meta name="description" content="<c:out value="${param.desc}"/>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<div class="page-wrapper">
    <div class="page-body">
        <c:out value="${param.body}" escapeXml="false"/>
    </div>
</div>
</body>
</html>
