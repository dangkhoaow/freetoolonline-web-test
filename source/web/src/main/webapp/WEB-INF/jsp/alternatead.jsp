<%--
  /alternatead.html — AdSense alternate-ad iframe target.
  This page is loaded INSIDE an iframe by the AdSense fallback mechanism when no ad fills.
  - meta robots="noindex, nofollow" is INTENTIONAL (this is not a content URL).
  - empty title + missing meta description are INTENTIONAL (ad-tag compatibility).
  - missing JSON-LD is INTENTIONAL (not a content page).
  Listed in scripts/site-data.mjs SPECIAL_ROUTES so that R13 site-wide-audit excludes it.
  Do NOT add SEO content to this page; it is owned by the ad system, not the SEO surface.
--%>
<html>
<head>
<title></title>
</head>
<body>

<a href="${url}" target="_top"><img src="https://dkbg1jftzfsd2.cloudfront.net/image/ad/${img}.jpg"/></a>

</body>
</html>
