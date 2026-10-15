/* FtolCropBox - an on-picture crop rectangle in the style of a phone photo editor, shared by
 * /video-tools/video-cropper.html and /video-tools/video-merger.html.
 *
 *   var box = FtolCropBox.create(hostEl, { srcW: 1920, srcH: 1080, onChange: fn });
 *
 * hostEl must exactly cover the picture as it is shown (any CSS size); the box is laid out in
 * percentages of it, so it follows resizes on its own. All rectangles are in SOURCE pixels of
 * the shown picture ({ x, y, w, h }, integers, inside 0..srcW x 0..srcH).
 *
 * Interaction: drag inside the box to move it, drag one of the 4 corners or 4 edges to resize
 * it. With an aspect ratio set, corners keep the ratio from the opposite corner and edges keep
 * it around the box's centre line. Arrow keys move the focused box, Alt/Option + arrows resize it
 * from the right/bottom edge (Shift = 10x). A plain tap passes through to the page.
 * onChange(rect, phase) fires with phase 'drag' while dragging and 'end' when a change is done.
 * No dependencies; ASCII only.
 */
(function (root) {
    'use strict';
    if (root.FtolCropBox) return;

    var CSS = '' +
        '.fcb-layer{position:absolute;inset:0;pointer-events:none;z-index:2}' +
        // The dimmed outside is a shadow on its own clipped layer, so the handles (which reach
        // past the picture's edge) are never clipped.
        '.fcb-clip{position:absolute;inset:0;overflow:hidden;pointer-events:none}' +
        '.fcb-shade{position:absolute;box-shadow:0 0 0 200vmax rgba(0,0,0,.55)}' +
        '.fcb-box{position:absolute;box-sizing:border-box;border:1px solid rgba(255,255,255,.95);' +
            'pointer-events:auto;cursor:move;touch-action:none;outline:none}' +
        '.fcb-box:focus-visible{border-color:#7cc4ff;box-shadow:inset 0 0 0 2px #7cc4ff}' +
        '.fcb-passive .fcb-box{pointer-events:none;cursor:default}' +
        // A box over the whole picture cannot move, so a swipe on it scrolls the page.
        '.fcb-full .fcb-box{touch-action:pan-y pinch-zoom;cursor:default}' +
        '.fcb-passive .fcb-h{display:none}' +
        '.fcb-grid{position:absolute;inset:0;opacity:0;transition:opacity .15s;pointer-events:none}' +
        '.fcb-dragging .fcb-grid,.fcb-box:focus-visible .fcb-grid{opacity:1}' +
        '.fcb-grid i{position:absolute;background:rgba(255,255,255,.55)}' +
        '.fcb-grid i:nth-child(1),.fcb-grid i:nth-child(2){top:0;bottom:0;width:1px}' +
        '.fcb-grid i:nth-child(1){left:33.333%}.fcb-grid i:nth-child(2){left:66.666%}' +
        '.fcb-grid i:nth-child(3),.fcb-grid i:nth-child(4){left:0;right:0;height:1px}' +
        '.fcb-grid i:nth-child(3){top:33.333%}.fcb-grid i:nth-child(4){top:66.666%}' +
        '.fcb-h{position:absolute;width:30px;height:30px;touch-action:none;z-index:1}' +
        '.fcb-h::after{content:"";position:absolute;border:0 solid #fff}' +
        '.fcb-nw{left:-15px;top:-15px;cursor:nwse-resize}.fcb-ne{right:-15px;top:-15px;cursor:nesw-resize}' +
        '.fcb-sw{left:-15px;bottom:-15px;cursor:nesw-resize}.fcb-se{right:-15px;bottom:-15px;cursor:nwse-resize}' +
        '.fcb-nw::after,.fcb-ne::after,.fcb-sw::after,.fcb-se::after{width:18px;height:18px}' +
        '.fcb-nw::after{left:12px;top:12px;border-left-width:4px;border-top-width:4px}' +
        '.fcb-ne::after{right:12px;top:12px;border-right-width:4px;border-top-width:4px}' +
        '.fcb-sw::after{left:12px;bottom:12px;border-left-width:4px;border-bottom-width:4px}' +
        '.fcb-se::after{right:12px;bottom:12px;border-right-width:4px;border-bottom-width:4px}' +
        '.fcb-n,.fcb-s{left:50%;margin-left:-15px;cursor:ns-resize}.fcb-n{top:-15px}.fcb-s{bottom:-15px}' +
        '.fcb-e,.fcb-w{top:50%;margin-top:-15px;cursor:ew-resize}.fcb-e{right:-15px}.fcb-w{left:-15px}' +
        '.fcb-n::after,.fcb-s::after{left:7px;width:16px;height:0;border-top-width:4px}' +
        '.fcb-n::after{top:13px}.fcb-s::after{bottom:13px}' +
        '.fcb-e::after,.fcb-w::after{top:7px;height:16px;width:0;border-left-width:4px}' +
        '.fcb-e::after{right:13px}.fcb-w::after{left:13px}' +
        '@media (pointer:coarse){.fcb-h{width:44px;height:44px}' +
            '.fcb-nw{left:-22px;top:-22px}.fcb-ne{right:-22px;top:-22px}.fcb-sw{left:-22px;bottom:-22px}.fcb-se{right:-22px;bottom:-22px}' +
            '.fcb-nw::after{left:19px;top:19px}.fcb-ne::after{right:19px;top:19px}.fcb-sw::after{left:19px;bottom:19px}.fcb-se::after{right:19px;bottom:19px}' +
            '.fcb-n,.fcb-s{margin-left:-22px}.fcb-n{top:-22px}.fcb-s{bottom:-22px}.fcb-e,.fcb-w{margin-top:-22px}.fcb-e{right:-22px}.fcb-w{left:-22px}' +
            '.fcb-n::after,.fcb-s::after{left:14px}.fcb-n::after{top:20px}.fcb-s::after{bottom:20px}' +
            '.fcb-e::after,.fcb-w::after{top:14px}.fcb-e::after{right:20px}.fcb-w::after{left:20px}}';

    var HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

    function injectCss() {
        if (document.getElementById('fcb-style')) return;
        var s = document.createElement('style');
        s.id = 'fcb-style';
        s.textContent = CSS;
        document.head.appendChild(s);
    }

    function clamp(x, a, b) { return Math.min(b, Math.max(a, x)); }

    // The largest w x h with w / h = aspect that fits inside maxW x maxH.
    function fitAspect(aspect, maxW, maxH) {
        var w = maxW, h = w / aspect;
        if (h > maxH) { h = maxH; w = h * aspect; }
        return { w: w, h: h };
    }

    // Rounds a float rect to whole pixels inside the frame without growing it past the frame.
    function roundRect(r, W, H) {
        var x = clamp(Math.round(r.x), 0, W - 1), y = clamp(Math.round(r.y), 0, H - 1);
        var w = clamp(Math.round(r.w), 1, W - x), h = clamp(Math.round(r.h), 1, H - y);
        return { x: x, y: y, w: w, h: h };
    }

    // A rect of the given aspect, as large as fits inside the frame, centred on (cx, cy) and
    // slid back inside the frame where needed.
    function aspectRectAt(aspect, W, H, cx, cy) {
        var s = fitAspect(aspect, W, H);
        var x = clamp(cx - s.w / 2, 0, W - s.w), y = clamp(cy - s.h / 2, 0, H - s.h);
        return { x: x, y: y, w: s.w, h: s.h };
    }

    function create(host, opts) {
        opts = opts || {};
        injectCss();
        var st = {
            W: Math.max(1, opts.srcW || 1), H: Math.max(1, opts.srcH || 1),
            aspect: opts.aspect || null, interactive: opts.interactive !== false,
            minPx: opts.minPx || 16, onChange: opts.onChange || function () {}, drag: null
        };
        st.rect = opts.rect ? roundRect(opts.rect, st.W, st.H) : { x: 0, y: 0, w: st.W, h: st.H };

        var layer = document.createElement('div');
        layer.className = 'fcb-layer';
        var box = document.createElement('div');
        box.className = 'fcb-box';
        box.tabIndex = 0;
        box.setAttribute('role', 'group');
        box.setAttribute('aria-roledescription', 'crop area');
        box.setAttribute('aria-label', opts.label || 'Crop area. Drag to move, drag a corner or edge to resize. Arrow keys move it; Alt or Option with the arrow keys resizes it.');
        box.innerHTML = '<div class="fcb-grid" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' +
            HANDLES.map(function (h) { return '<div class="fcb-h fcb-' + h + '" data-h="' + h + '" aria-hidden="true"></div>'; }).join('');
        var clip = document.createElement('div');
        clip.className = 'fcb-clip';
        var shade = document.createElement('div');
        shade.className = 'fcb-shade';
        clip.appendChild(shade);
        layer.appendChild(clip);
        layer.appendChild(box);
        host.appendChild(layer);

        function minW() { return Math.min(st.W, Math.max(2, st.minPx)); }
        function minH() { return Math.min(st.H, Math.max(2, st.minPx)); }

        function paint() {
            var r = st.rect;
            [box, shade].forEach(function (el) {
                el.style.left = (r.x / st.W * 100) + '%';
                el.style.top = (r.y / st.H * 100) + '%';
                el.style.width = (r.w / st.W * 100) + '%';
                el.style.height = (r.h / st.H * 100) + '%';
            });
            layer.classList.toggle('fcb-passive', !st.interactive);
            layer.classList.toggle('fcb-full', r.x === 0 && r.y === 0 && r.w === st.W && r.h === st.H);
        }

        function emit(phase) { try { st.onChange({ x: st.rect.x, y: st.rect.y, w: st.rect.w, h: st.rect.h }, phase); } catch (e) { /* caller bug */ } }

        function setRect(r, silent) {
            st.rect = roundRect(r, st.W, st.H);
            paint();
            if (!silent) emit('end');
        }

        // Resize from handle h given the pointer at (px, py) in source pixels.
        function resizeTo(h, px, py, s0) {
            var W = st.W, H = st.H, a = st.aspect, mw = minW(), mh = minH();
            var L = s0.x, T = s0.y, R = s0.x + s0.w, B = s0.y + s0.h;
            var r;
            if (!a) {
                if (h.indexOf('w') >= 0) L = clamp(px, 0, R - mw);
                if (h.indexOf('e') >= 0) R = clamp(px, L + mw, W);
                if (h.indexOf('n') >= 0) T = clamp(py, 0, B - mh);
                if (h.indexOf('s') >= 0) B = clamp(py, T + mh, H);
                r = { x: L, y: T, w: R - L, h: B - T };
            } else if (h.length === 2) {
                // Corner: the opposite corner stays put; the ratio holds.
                var ax = h.indexOf('w') >= 0 ? R : L, ay = h.indexOf('n') >= 0 ? B : T;
                var sx = h.indexOf('w') >= 0 ? -1 : 1, sy = h.indexOf('n') >= 0 ? -1 : 1;
                var availW = sx > 0 ? W - ax : ax, availH = sy > 0 ? H - ay : ay;
                // Signed reach: past the fixed corner the box holds its minimum size.
                var w = Math.max(0, sx * (px - ax)), hh = Math.max(0, sy * (py - ay));
                w = Math.max(w, hh * a); // follow the pointer's larger reach
                var minWA = Math.max(mw, mh * a);
                w = clamp(w, Math.min(minWA, availW, availH * a), Math.min(availW, availH * a));
                hh = w / a;
                r = { x: sx > 0 ? ax : ax - w, y: sy > 0 ? ay : ay - hh, w: w, h: hh };
            } else {
                // Edge: that edge follows the pointer, the other dimension keeps the ratio
                // around the box's centre line, slid back inside the frame if needed.
                var cx = s0.x + s0.w / 2, cy = s0.y + s0.h / 2;
                if (h === 'e' || h === 'w') {
                    var ex = h === 'e' ? L : R;
                    var w2 = h === 'e' ? px - ex : ex - px;
                    var maxW2 = Math.min(h === 'e' ? W - ex : ex, H * a);
                    w2 = clamp(w2, Math.min(Math.max(mw, mh * a), maxW2), maxW2);
                    var h2 = w2 / a;
                    r = { x: h === 'e' ? ex : ex - w2, y: clamp(cy - h2 / 2, 0, H - h2), w: w2, h: h2 };
                } else {
                    var ey = h === 's' ? T : B;
                    var h3 = h === 's' ? py - ey : ey - py;
                    var maxH3 = Math.min(h === 's' ? H - ey : ey, W / a);
                    h3 = clamp(h3, Math.min(Math.max(mh, mw / a), maxH3), maxH3);
                    var w3 = h3 * a;
                    r = { x: clamp(cx - w3 / 2, 0, W - w3), y: h === 's' ? ey : ey - h3, w: w3, h: h3 };
                }
            }
            return r;
        }

        function toSrc(e) {
            var b = host.getBoundingClientRect();
            return { x: (e.clientX - b.left) / Math.max(1, b.width) * st.W, y: (e.clientY - b.top) / Math.max(1, b.height) * st.H };
        }

        function onDown(e) {
            if (!st.interactive || (e.button !== undefined && e.button !== 0)) return;
            st.justDragged = false;
            var t = e.target.closest ? e.target.closest('.fcb-h') : null;
            if (t) {
                // A box too small on screen to show an uncovered middle (big touch handles):
                // a press inside the box moves it; only the handle part outside resizes.
                var br = box.getBoundingClientRect(), hs = t.offsetWidth || 44;
                if ((br.width < 2 * hs || br.height < 2 * hs) &&
                    e.clientX > br.left && e.clientX < br.right && e.clientY > br.top && e.clientY < br.bottom) t = null;
            }
            var p = toSrc(e);
            st.drag = { h: t ? t.getAttribute('data-h') : 'move', p0: p, s0: { x: st.rect.x, y: st.rect.y, w: st.rect.w, h: st.rect.h }, id: e.pointerId, moved: false, cx: e.clientX, cy: e.clientY };
            try { box.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
            layer.classList.add('fcb-dragging');
            e.preventDefault();
            e.stopPropagation();
            try { box.focus({ preventScroll: true }); } catch (err2) { /* ignore */ }
        }
        function onMove(e) {
            var d = st.drag;
            if (!d || e.pointerId !== d.id) return;
            e.preventDefault();
            // A tap's few pixels of jitter is not a drag (the tap must still reach the page).
            if (!d.moved && Math.abs(e.clientX - d.cx) < 4 && Math.abs(e.clientY - d.cy) < 4) return;
            var p = toSrc(e), r;
            if (d.h === 'move') {
                r = { x: clamp(d.s0.x + p.x - d.p0.x, 0, st.W - d.s0.w), y: clamp(d.s0.y + p.y - d.p0.y, 0, st.H - d.s0.h), w: d.s0.w, h: d.s0.h };
            } else {
                // Keep the grab offset so the handle does not jump to the pointer.
                var gx = (d.h.indexOf('w') >= 0 ? d.s0.x : (d.h.indexOf('e') >= 0 ? d.s0.x + d.s0.w : 0)) - d.p0.x;
                var gy = (d.h.indexOf('n') >= 0 ? d.s0.y : (d.h.indexOf('s') >= 0 ? d.s0.y + d.s0.h : 0)) - d.p0.y;
                r = resizeTo(d.h, p.x + gx, p.y + gy, d.s0);
            }
            st.rect = roundRect(r, st.W, st.H);
            d.moved = true;
            paint();
            emit('drag');
        }
        function onUp(e) {
            var d = st.drag;
            if (!d || (e && e.pointerId !== d.id)) return;
            st.drag = null;
            st.justDragged = d.moved;
            layer.classList.remove('fcb-dragging');
            var r = st.rect, s0 = d.s0;
            if (r.x !== s0.x || r.y !== s0.y || r.w !== s0.w || r.h !== s0.h) emit('end');
        }
        function onKey(e) {
            if (!st.interactive) return;
            var k = e.key, step = Math.max(1, Math.round(Math.min(st.W, st.H) / 100)) * (e.shiftKey ? 10 : 1);
            var dx = k === 'ArrowLeft' ? -step : (k === 'ArrowRight' ? step : 0);
            var dy = k === 'ArrowUp' ? -step : (k === 'ArrowDown' ? step : 0);
            if (!dx && !dy) return;
            e.preventDefault();
            var r = st.rect;
            if (e.altKey) {
                // Alt (Option) + arrows resize from the right / bottom edge, keeping a fixed shape.
                var s0 = { x: r.x, y: r.y, w: r.w, h: r.h };
                setRect(dx ? resizeTo('e', r.x + r.w + dx, 0, s0) : resizeTo('s', 0, r.y + r.h + dy, s0));
                return;
            }
            setRect({ x: clamp(r.x + dx, 0, st.W - r.w), y: clamp(r.y + dy, 0, st.H - r.h), w: r.w, h: r.h });
        }

        box.addEventListener('pointerdown', onDown);
        box.addEventListener('pointermove', onMove);
        box.addEventListener('pointerup', onUp);
        box.addEventListener('pointercancel', onUp);
        box.addEventListener('lostpointercapture', onUp);
        box.addEventListener('keydown', onKey);
        // Only a click that ends a drag is swallowed; a plain tap reaches the page (the merger's
        // preview plays or pauses on a tap).
        box.addEventListener('click', function (e) { if (st.justDragged) e.stopPropagation(); st.justDragged = false; });
        paint();

        return {
            el: box,
            getRect: function () { return { x: st.rect.x, y: st.rect.y, w: st.rect.w, h: st.rect.h }; },
            setRect: function (r, silent) { setRect(r, silent); },
            getSource: function () { return { w: st.W, h: st.H }; },
            // New picture size (e.g. after a rotation); rect = the new rect in its pixels.
            setSource: function (w, h, rect) {
                st.W = Math.max(1, Math.round(w)); st.H = Math.max(1, Math.round(h));
                st.rect = roundRect(rect || { x: 0, y: 0, w: st.W, h: st.H }, st.W, st.H);
                paint();
            },
            // aspect = width / height, or null for a free crop. Re-fits the box (the largest box
            // of that ratio around the current centre) unless keepRect is set.
            setAspect: function (aspect, silent, keepRect) {
                st.aspect = aspect && isFinite(aspect) && aspect > 0 ? aspect : null;
                if (st.aspect && !keepRect) {
                    var r = st.rect;
                    setRect(aspectRectAt(st.aspect, st.W, st.H, r.x + r.w / 2, r.y + r.h / 2), silent);
                }
            },
            getAspect: function () { return st.aspect; },
            reset: function (silent) { st.aspect = null; setRect({ x: 0, y: 0, w: st.W, h: st.H }, silent); },
            setInteractive: function (on) { st.interactive = !!on; if (!on) st.drag = null; paint(); },
            isFull: function () { var r = st.rect; return r.x === 0 && r.y === 0 && r.w === st.W && r.h === st.H; },
            destroy: function () { if (layer.parentNode) layer.parentNode.removeChild(layer); }
        };
    }

    root.FtolCropBox = { create: create, fitAspect: fitAspect, aspectRectAt: aspectRectAt, roundRect: roundRect };
})(typeof window !== 'undefined' ? window : this);
