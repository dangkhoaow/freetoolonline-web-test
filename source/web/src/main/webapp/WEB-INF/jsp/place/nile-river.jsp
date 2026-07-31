<%@ page import="com.freetoollib.PageFragments" %><%
    String slug = "nileriver";
    String title = "Nile River 3D Explorer";
    String description = "Explore the 6,650 km Nile River in a 3D interactive explorer. Discover the world's longest river flowing from Lake Victoria to the Mediterranean, the lifeblood of Egypt and Sudan.";

    PageFragments.RenderParams params = new PageFragments.RenderParams();
    params.setSlug(slug);
    params.setTitle(title);
    params.setDescription(description);
    params.setCMSBodyHtml("nileriver");
    params.setCMSBodyWelcome("nileriver");
    params.setCMSBodyJS("nileriver");
    params.setCMSFAQ("nileriver");
    params.setCluster("places-3d");

    PageFragments.render(request, response, params);
%>
