<!DOCTYPE html>
<html lang="en" itemscope itemtype="https://schema.org/WebApplication">
<%@ include file="../../../static/view/header.html" %>
<meta itemprop="applicationCategory" content="EducationalApplication" />
<meta itemprop="operatingSystem" content="Any" />
<title>${title}</title>
<meta name="description" content="${metaDescription}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${metaDescription}" />
<meta property="og:image" content="${siteUrl}/og-image-default.png" />
<meta property="og:url" content="${pageUrl}" />
<meta name="robots" content="index, follow" />

<body class="w3-white" style="margin:0;padding:0;">
<%@ include file="../../../static/view/top-page-banner-ad.html" %>

<div class="w3-container w3-padding-16">
  <div class="w3-row-padding">
    <div class="w3-col l8 m12">
      <%@ include file="../../../static/view/CMS/BODYHTMLiovolcanoesrealtime.html" %>
    </div>
    <div class="w3-col l4 m12 w3-padding-16">
      <%@ include file="../../../static/view/related-tools.html" %>
    </div>
  </div>
</div>

<%@ include file="../../../static/view/CMS/BODYWELCOMEiovolcanoesrealtime.html" %>

<div class="w3-container w3-padding-16">
  <%@ include file="../../../static/view/CMS/FAQiovolcanoesrealtime.html" %>
</div>

<%@ include file="../../../static/view/bottom-page-banner-ad.html" %>
<%@ include file="../../../static/view/footer.html" %>
</body>
</html>