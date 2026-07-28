/* knowledge-graph.js - homepage knowledge explorer client (2026-07-08).
 *
 * Loaded lazily by the inline loader in the homepage BODYHTML, desktop
 * viewports (>= 1024px) only, AFTER the vendored 3d-force-graph UMD bundle
 * (window.ForceGraph3D) from the ftol-vm-assets CDN. Fetches the build-time
 * graph at <base>/data/knowledge-graph.json (nodes {id,n,g,t,v}; links as
 * [srcIdx, tgtIdx] pairs) and renders the Obsidian-style 3D topic map next
 * to the server-rendered directory tree.
 *
 * Failure of anything here degrades to the tree alone - the tree is plain
 * server HTML and never depends on this file.
 */
(function () {
  "use strict";

  var host = document.getElementById("knowledge-explorer");
  var pane = document.querySelector(".ke-graph-pane");
  var mount = document.getElementById("ke-graph");
  var hint = document.getElementById("ke-graph-hint");
  var card = document.getElementById("ke-node-card");
  var tree = document.getElementById("ke-tree");
  if (!host || !pane || !mount || typeof window.ForceGraph3D !== "function") { return; }

  var base = host.getAttribute("data-base") || "";

  var GROUP_COLORS = {
    home: "#58a6ff",
    zip: "#ff7b72",
    "image-conversion": "#ffa657",
    "image-editing": "#d2a8ff",
    pdf: "#f85149",
    developer: "#79c0ff",
    video: "#ff9bce",
    "device-test": "#56d364",
    utility: "#e3b341",
    games: "#f778ba",
    "space-3d": "#76e3ea",
    news: "#ffd33d",
    guides: "#c9d1d9",
    "guide-en": "#c9d1d9",
    "guide-pt": "#8b949e",
    "guide-es": "#8b949e",
    "guide-vi": "#8b949e",
    "guide-id": "#8b949e",
    "guide-de": "#8b949e",
    page: "#6e7681"
  };
  var LEGEND = [
    ["zip", "ZIP"], ["image-conversion", "Image convert"], ["image-editing", "Image edit"],
    ["pdf", "PDF"], ["developer", "Developer"], ["device-test", "Device tests"],
    ["video", "Video"], ["utility", "Utility"], ["games", "Games"],
    ["space-3d", "Space 3D"], ["guides", "Guides"], ["news", "News"], ["page", "Pages"]
  ];
  var LOCALE_LABELS = { en: "English", pt: "Portuguese", es: "Spanish", vi: "Vietnamese", id: "Indonesian", de: "German" };
  var TYPE_LABELS = { home: "Home page", hub: "Topic overview", tool: "Tool", guide: "Guide", news: "News article", page: "Site page" };

  // The graph pane is ALWAYS dark (a map viewport, matching the Obsidian
  // reference), independent of the site's light/dark toggle.
  function bgColor() { return "#0d1117"; }
  function linkBaseColor() { return "rgba(139,148,158,0.3)"; }
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function kindLabel(node) {
    if (node.t === "guide") {
      var loc = (node.g || "").replace("guide-", "");
      return "Guide - " + (LOCALE_LABELS[loc] || loc.toUpperCase());
    }
    return TYPE_LABELS[node.t] || "Page";
  }
  // The staging deploy rewrites internal hrefs (and data-ke with them) to
  // absolute URLs under the subpath; graph node ids stay clean route paths.
  // Normalize any data-ke value back to the route-path form for lookups.
  function routeFromKe(value) {
    var p = String(value || "");
    try { p = new URL(p, window.location.href).pathname; } catch (e) { /* keep raw */ }
    if (base && p.indexOf(base) === 0) { p = p.slice(base.length); }
    return p || "/";
  }

  fetch(base + "/data/knowledge-graph.json", { credentials: "omit" })
    .then(function (res) {
      if (!res.ok) { throw new Error("HTTP " + res.status); }
      return res.json();
    })
    .then(init)
    .catch(function () {
      if (hint) { hint.textContent = "The 3D map could not load here. The directory on the left lists every page."; }
    });

  function init(data) {
    var nodes = data.nodes.map(function (n) {
      return { id: n.id, name: n.n, group: n.g, type: n.t, val: n.v };
    });
    var links = data.links.map(function (pair) {
      return { source: nodes[pair[0]].id, target: nodes[pair[1]].id };
    });

    // Adjacency for hover/tree highlighting.
    var nodeById = {};
    nodes.forEach(function (n) { nodeById[n.id] = n; });
    var neighbors = {};
    links.forEach(function (l) {
      (neighbors[l.source] = neighbors[l.source] || []).push(l);
      (neighbors[l.target] = neighbors[l.target] || []).push(l);
    });

    // The tree enhancements never depend on WebGL - build them first so a
    // machine without a GL context still gets the full guide directory.
    buildLazyGuideFolders(nodes);

    var graph;
    try {
      graph = createGraph(nodes, links, nodeById, neighbors);
    } catch (e) {
      if (hint) { hint.hidden = false; hint.textContent = "The 3D map could not load here. The directory on the left lists every page."; }
    }
  }

  function createGraph(nodes, links, nodeById, neighbors) {
    var highlightNodes = new Set();
    var highlightLinks = new Set();
    var selectedNode = null;

    var graph = new window.ForceGraph3D(mount, { controlType: "orbit" })
      .width(pane.clientWidth)
      .height(pane.clientHeight)
      .backgroundColor(bgColor())
      .showNavInfo(false)
      .nodeLabel(function (n) {
        return '<div style="max-width:280px;font:12px sans-serif;padding:2px 4px">' +
          "<b>" + escapeHtml(n.name) + "</b><br>" + escapeHtml(kindLabel(n)) + "</div>";
      })
      .nodeColor(function (n) {
        if (highlightNodes.size && !highlightNodes.has(n.id)) {
          return "rgba(110,118,129,0.25)";
        }
        return GROUP_COLORS[n.group] || "#8b949e";
      })
      .nodeVal(function (n) { return n.val; })
      .nodeOpacity(0.9)
      .nodeResolution(10)
      .linkColor(function (l) {
        return highlightLinks.has(l) ? "#a371f7" : linkBaseColor();
      })
      .linkWidth(function (l) { return highlightLinks.has(l) ? 1.4 : 0; })
      .linkOpacity(0.35)
      .warmupTicks(60)
      .cooldownTime(8000)
      .onNodeHover(function (n) {
        setHighlight(n ? n.id : null);
        pane.style.cursor = n ? "pointer" : "";
      })
      .onNodeClick(handleNodeClick)
      .onBackgroundClick(function () {
        selectedNode = null;
        setHighlight(null);
        if (card) { card.hidden = true; }
      });

    graph.graphData({ nodes: nodes, links: links });

    var fitted = false;
    graph.onEngineStop(function () {
      if (!fitted) { fitted = true; graph.zoomToFit(600, 40); }
    });
    if (hint) { hint.textContent = ""; hint.hidden = true; }

    function refreshStyles() {
      // Re-setting the accessors forces 3d-force-graph to re-evaluate them.
      graph.nodeColor(graph.nodeColor());
      graph.linkColor(graph.linkColor());
      graph.linkWidth(graph.linkWidth());
    }

    function setHighlight(nodeId) {
      highlightNodes.clear();
      highlightLinks.clear();
      var anchor = nodeId || (selectedNode && selectedNode.id);
      if (anchor && neighbors[anchor]) {
        highlightNodes.add(anchor);
        neighbors[anchor].forEach(function (l) {
          highlightLinks.add(l);
          highlightNodes.add(typeof l.source === "object" ? l.source.id : l.source);
          highlightNodes.add(typeof l.target === "object" ? l.target.id : l.target);
        });
      } else if (anchor) {
        highlightNodes.add(anchor);
      }
      refreshStyles();
    }

    var lastClick = { id: null, at: 0 };
    function handleNodeClick(n) {
      var now = Date.now();
      if (lastClick.id === n.id && now - lastClick.at < 450) {
        window.location.href = base + n.id;
        return;
      }
      lastClick = { id: n.id, at: now };
      selectedNode = n;
      setHighlight(n.id);
      // Fly the camera to a comfortable distance from the node.
      var dist = 90;
      var ratio = 1 + dist / Math.hypot(n.x || 1, n.y || 1, n.z || 1);
      graph.cameraPosition(
        { x: (n.x || 1) * ratio, y: (n.y || 1) * ratio, z: (n.z || 1) * ratio },
        n,
        900
      );
      if (card) {
        card.innerHTML =
          "<b>" + escapeHtml(n.name) + "</b>" +
          '<span class="ke-node-kind">' + escapeHtml(kindLabel(n)) + "</span>" +
          '<a href="' + escapeHtml(base + n.id) + '">Open this page</a>' +
          ' <span class="ke-node-kind" style="display:inline">- or double-click the dot</span>';
        card.hidden = false;
      }
    }

    // Legend chips (pointer-events none; informational only).
    var legend = document.createElement("div");
    legend.className = "ke-legend";
    LEGEND.forEach(function (pair) {
      var chip = document.createElement("span");
      chip.style.setProperty("--ke-dot", GROUP_COLORS[pair[0]] || "#8b949e");
      chip.appendChild(document.createTextNode(pair[1]));
      legend.appendChild(chip);
    });
    pane.appendChild(legend);

    // Keep canvas sized with the pane.
    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        graph.width(pane.clientWidth).height(pane.clientHeight);
      }).observe(pane);
    }

    // Pause rendering while scrolled out of view (WebGL is not free).
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { graph.resumeAnimation(); }
          else { graph.pauseAnimation(); }
        });
      }, { threshold: 0.05 }).observe(pane);
    }

    // --- Tree coupling: hovering a tree link highlights its dot. ---
    if (tree) {
      tree.addEventListener("mouseover", function (ev) {
        var a = ev.target && ev.target.closest ? ev.target.closest("a[data-ke]") : null;
        if (!a) { return; }
        var route = routeFromKe(a.getAttribute("data-ke"));
        if (nodeById[route]) { setHighlight(route); }
      });
      tree.addEventListener("mouseout", function (ev) {
        var a = ev.target && ev.target.closest ? ev.target.closest("a[data-ke]") : null;
        if (a) { setHighlight(null); }
      });
    }

    return graph;
  }

  // --- Lazy guide folders: build one folder per locale, fill its list on
  // first open (keeps ~1.6k anchors out of the DOM until asked for).
  // Independent of WebGL - runs even when the 3D graph cannot. ---
  function buildLazyGuideFolders(nodes) {
    var guidesFolder = tree ? tree.querySelector("details[data-ke-lazy-guides]") : null;
    if (!guidesFolder) { return; }
    var slot = guidesFolder.querySelector(".ke-lazy-slot");
    var spec = guidesFolder.getAttribute("data-ke-lazy-guides") || "";
    if (!slot || !spec) { return; }
    spec.split(",").forEach(function (part) {
      var locale = part.split(":")[0];
      var count = part.split(":")[1] || "";
      if (!locale) { return; }
      var d = document.createElement("details");
      d.className = "ke-folder";
      var s = document.createElement("summary");
      s.innerHTML = escapeHtml(LOCALE_LABELS[locale] || locale.toUpperCase()) +
        ' <span class="ke-count">' + escapeHtml(count) + "</span>";
      d.appendChild(s);
      var filled = false;
      d.addEventListener("toggle", function () {
        if (filled || !d.open) { return; }
        filled = true;
        var ul = document.createElement("ul");
        ul.className = "ke-list";
        nodes
          .filter(function (n) { return n.group === "guide-" + locale; })
          .sort(function (a, b) { return a.name.localeCompare(b.name); })
          .forEach(function (n) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = base + n.id;
            a.setAttribute("data-ke", n.id);
            a.textContent = n.name;
            li.appendChild(a);
            ul.appendChild(li);
          });
        d.appendChild(ul);
      });
      slot.appendChild(d);
    });
  }
})();
