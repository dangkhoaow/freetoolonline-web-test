const SEO_CLUSTER_GROUPS = [
  {
    cluster: 'zip',
    hubRoute: '/zip-tools.html',
    hubLabel: 'Back to ZIP Tools',
    routes: ['/zip-file.html', '/unzip-file.html', '/remove-zip-password.html'],
  },
  {
    cluster: 'image-editing',
    hubRoute: '/image-tools.html',
    hubLabel: 'Back to Image Tools',
    routes: [
      '/compress-image.html',
      '/resize-image.html',
      '/crop-image.html',
      '/photo-editor.html',
      '/gif-maker.html',
      '/insights-image-optimizer.html',
      '/get-jpeg-compression-level.html',
      '/imagemagick-online.html',
    '/image-tools/steganography.html', '/image-tools/background-remover.html', '/image-tools/document-scanner.html', '/image-tools/image-to-text-ocr.html', '/image-tools/passport-photo-maker.html', '/image-tools/photo-restoration.html'],
  },
  {
    cluster: 'image-conversion',
    hubRoute: '/image-converter-tools.html',
    hubLabel: 'Back to Image Converters',
    // Cycle 20260520-8 cleanup: /hd-video-converter.html moved to video cluster (it's a VIDEO
    // converter with ffmpeg audio-bitrate options, not an image converter). It was mis-clustered
    // here so the axis_F scanner flagged its template paragraph as a 1.0 jaccard duplicate of
    // /image-format-converter.html's same template paragraph. Re-tagged in related-tools.js
    // commit 765e1d8 + moved here.
    // Cycle 20260521-12 cleanup: /image-format-converter.html removed entirely (silent stub).
    routes: ['/heic-to-jpg.html', '/svg-to-png.html', '/png-to-svg.html', '/image-to-base64.html', '/base64-to-image.html', '/extract-gif-to-image-frames.html', '/image-converter-tools/audio-converter.html', '/image-converter-tools/png-to-webp.html', '/image-converter-tools/jpg-to-webp.html', '/image-converter-tools/webp-to-png.html', '/image-converter-tools/webp-to-jpg.html', '/image-converter-tools/image-to-webp.html', '/image-converter-tools/png-to-jpg.html', '/image-converter-tools/image-format-converter.html'],
  },
  {
    cluster: 'pdf',
    hubRoute: '/pdf-tools.html',
    hubLabel: 'Back to PDF Tools',
    routes: ['/compose-pdf.html', '/split-pdf-by-range.html', '/split-pdf-to-each-pages.html', '/join-pdf-from-multiple-files.html', '/protect-pdf-by-password.html', '/remove-pdf-password.html', '/preflight-pdf.html', '/flatten-pdf.html', '/pdf-to-text.html', '/pdf-to-images.html', '/pdf-to-html.html', '/images-to-pdf.html', '/pdf-tools/pdf-filler-form-editor.html', '/pdf-tools/rotate-pdf.html', '/pdf-tools/delete-pdf-pages.html', '/pdf-tools/add-watermark-to-pdf.html'],
  },
  {
    cluster: 'developer',
    hubRoute: '/developer-tools.html',
    hubLabel: 'Back to Developer Tools',
    // Cycle 20260520-8 P.B cleanup: 5 dupe json-formatter variants + chatgpt-json-tree-viewer
    // removed. They were 301-aliased to /json-formatter.html in commit 8f159ad. Their orphan
    // presence here made cluster-narrative axis_F detect false-positive paragraph_jaccard 1.0.
    // Cycle 20260521-12 semantic-dedup cleanup: '/json-formatter.html' removed
    // (was semantic duplicate of /json-parser.html which is titled "JSON Parser
    // & Formatter (Tree View)" and already covers pretty-print + validate + tree).
    routes: ['/json-parser.html', '/css-minifier.html', '/css-unminifier.html', '/js-minifier.html', '/js-unminifier.html', '/text-diff.html', '/md5-converter.html', '/css-gradient-generator.html', '/text-html-editor.html', '/developer-tools/regex-tester.html', '/developer-tools/color-picker.html', '/developer-tools/data-visualizer.html', '/developer-tools/code-editor.html', '/developer-tools/code-formatter-beautifier.html', '/developer-tools/word-counter.html', '/developer-tools/sort-text-lines.html', '/developer-tools/remove-duplicate-lines.html', '/developer-tools/reverse-text.html', '/developer-tools/text-repeater.html', '/developer-tools/base64-encoder.html', '/developer-tools/url-decoder.html', '/developer-tools/character-counter.html', '/developer-tools/find-and-replace-text.html', '/developer-tools/file-encryption-tool.html', '/developer-tools/jwt-decoder.html', '/developer-tools/uuid-generator.html', '/developer-tools/hash-generator.html', '/developer-tools/case-converter.html', '/developer-tools/json-to-typescript.html'],
  },
  {
    cluster: 'video',
    hubRoute: '/video-tools.html',
    hubLabel: 'Back to Video Tools',
    routes: ['/video-converter.html', '/video-maker.html', '/ffmpeg-online.html', '/hd-video-converter.html', '/video-tools/video-trimmer.html', '/video-tools/video-to-gif.html', '/video-tools/audio-trimmer.html', '/video-tools/strip-audio-from-video.html', '/video-tools/video-compressor.html', '/video-tools/video-splitter.html', '/video-tools/video-merger.html'],
  },
  {
    cluster: 'device-test',
    hubRoute: '/device-test-tools.html',
    hubLabel: 'Back to Device Test Tools',
    routes: ['/microphone-test.html', '/camera-test.html', '/lcd-test.html', '/keyboard-test.html', '/device-test-tools/screen-recorder.html', '/device-test-tools/gpu-test.html'],
  },
  {
    cluster: 'utility',
    hubRoute: '/utility-tools.html',
    hubLabel: 'Back to Utility Tools',
    routes: ['/file-compressor.html', '/convert-time-in-millisecond-to-date.html', '/get-time-in-millisecond.html', '/qr-code-generator.html', '/do-nong-do-con-truc-tuyen.html', '/cong-cu-chuyen-doi-chu-quoc-ngu-tieng-viet-thanh-tieq-viet-kieu-moi.html', '/utility-tools/todo-list.html', '/utility-tools/unit-converter.html', '/utility-tools/font-generator.html', '/utility-tools/private-ai-chat.html', '/utility-tools/analog-clock.html', '/utility-tools/digital-clock.html', '/utility-tools/countdown-timer.html', '/utility-tools/stopwatch.html', '/utility-tools/online-alarm-clock.html', '/utility-tools/wheel-spinner.html', '/utility-tools/dice-roller.html', '/utility-tools/coin-flip.html', '/utility-tools/random-number-picker.html', '/utility-tools/name-shuffler.html', '/utility-tools/yes-or-no-wheel.html', '/utility-tools/password-generator.html', '/utility-tools/voice-recorder.html', '/utility-tools/text-to-speech.html', '/utility-tools/speech-to-text.html', '/utility-tools/habit-tracker.html', '/utility-tools/grocery-list.html', '/utility-tools/qr-code-scanner.html', '/utility-tools/percentage-calculator.html', '/utility-tools/linux-online.html', '/utility-tools/expense-tracker.html', '/utility-tools/pomodoro-timer.html', '/utility-tools/random-name-picker.html', '/utility-tools/bmi-calculator.html', '/utility-tools/tip-calculator.html', '/utility-tools/loan-calculator.html', '/utility-tools/date-difference-calculator.html', '/utility-tools/note-taking-app.html', '/utility-tools/flashcards-maker.html', '/utility-tools/age-calculator.html'],
  },
  // Phase 16 P16.G3 - register the /guides/* cluster. Cycle B activates the
  // full route list now that P16.G1 ships /guides.html. resolveHubBacklink
  // returns { href: '/guides.html', label: 'Back to All Guides' } for every
  // route in this list, which causes (a) the renderer's breadcrumb chain to
  // become Home > All Guides > <guide title> and (b) site-data.mjs::
  // appendHubBacklink to auto-append "<- Back to All Guides" to each
  // guide's BODYHTML (or BODYWELCOME if present). Append-only at the
  // markup level - the existing guide BODYHTML/BODYWELCOME files are not
  // edited; the renderer adds the backlink at build time.
  // fire-23 (2026-07-04) - two NEW reader categories, both with non-'-tools'
  // hubs (the /guides.html precedent): browser GAMES and 3D SPACE visualizations.
  // Riding the June-2026 in-browser game trend. Routes are appended per build
  // by seo-tool-page-builder/scripts/lib/patch-seo-clusters.mjs, same as the
  // 8 tool clusters. Hub detection for these non-'-tools' hubs goes through
  // isHubRoute() below - do NOT add endsWith('-tools.html') checks elsewhere.
  {
    cluster: 'games',
    hubRoute: '/games.html',
    hubLabel: 'Back to Games',
    routes: ['/games/snake-classic.html', '/games/retro-tank-battle.html', '/games/garden-defense.html', '/games/voxel-world-builder.html', '/games/sky-gates-flight.html', '/games/city-time-machine.html', '/games/2048-game.html', '/games/city-drive-3d.html', '/games/retro-fps-online.html', '/games/retro-highway-racer.html', '/games/hover-racing.html', '/games/retro-arcade-shooter.html', '/games/marble-maze.html', '/games/asteroid-blaster.html', '/games/hex-puzzle-blocks.html', '/games/procedural-horde-game.html', '/games/chili-blast-shooter.html', '/games/pixel-pipeline-reflex.html', '/games/medieval-wall-defense.html', '/games/cyber-slide-puzzle.html', '/games/starlight-breaker.html', '/games/night-swarm-survivor.html', '/games/neon-tower-rush.html', '/games/cyber-neon-maze.html', '/games/serpentine-3d.html', '/games/neural-particle-life.html', '/games/neon-surge-loop.html', '/games/arrow-dodge-arena.html', '/games/andromeda-star-shooter.html', '/games/pixel-spike-run.html', '/games/orbital-radius-shooter.html', '/games/species-life-battle.html', '/games/gravity-orbit-golf.html', '/games/one-tap-platformer.html', '/games/neon-circuit-racer.html', '/games/pixel-necromancer.html', '/games/thirteen-card-duel.html', '/games/abyss-signal-diver.html', '/games/inferno-soul-walker.html', '/games/sketch-turf-battle.html', '/games/glow-firefly-cat.html', '/games/nova-star-barrage.html', '/games/pixel-realm-rpg.html', '/games/neon-cat-chase.html', '/games/schematic-factory-game.html', '/games/space-grid-puzzle.html', '/games/thirteen-step-escape.html', '/games/floor-thirteen-horror.html', '/games/voxel-fps-arena.html', '/games/lightning-math-battle.html', '/games/precision-bounce-loop.html', '/games/vim-motion-academy.html', '/games/globe-siege.html', '/games/void-trader.html', '/games/layer-flip-platformer.html', '/games/violence-town.html', '/games/claudicus-quest.html', '/games/neon-energy-arena.html', '/games/mono-minefield-grid.html', '/games/space-pi-defense.html', '/games/mono-paddle-duel.html', '/games/head-soccer-arena.html', '/games/idle-capitalist-loop.html', '/games/mono-stack-blocks.html', '/games/mono-grid-duel.html', '/games/pipe-rotate-puzzle.html', '/games/black-hole-square.html', '/games/pixel-park-puzzle.html', '/games/wash-the-cat.html', '/games/ritual-catacombs.html', '/games/potion-brew-shop.html', '/games/cat-typing-race.html', '/games/unlucky-crossing.html', '/games/mystic-card-paw.html', '/games/cat-hop-cloud.html', '/games/herd-cats-home.html', '/games/seasonal-witchcat.html', '/games/desk-cat-coder.html', '/games/boing-cat-platformer.html', '/games/darkline-paws.html', '/games/mor-chess-2.html', '/games/black-cat-hot-tin-roof.html', '/games/machine-guard-corps.html', '/games/solo-battlefield.html', '/games/feast-night.html', '/games/rune-keeper.html', '/games/bounce-back.html', '/games/classic-pong.html', '/games/thirteen-hours.html', '/games/quantum-shift.html', '/games/roller-maze-escape.html', '/games/thirteen-case-files.html', '/games/googol-stopping-game.html', '/games/bangbang-artillery.html', '/games/rock-paper-neural.html'],
  },
  {
    cluster: 'space-3d',
    hubRoute: '/space-3d.html',
    hubLabel: 'Back to Space 3D',
    routes: ['/space-3d/solar-system.html', '/space-3d/black-hole.html', '/space-3d/galaxy.html', '/space-3d/earth-3d-globe.html', '/space-3d/moon-phases-3d.html', '/space-3d/saturn-rings.html', '/space-3d/kepler-orbits.html', '/space-3d/moon-calendar-3d.html', '/space-3d/iss-orbit-tracker.html', '/space-3d/lunar-eclipse.html', '/space-3d/solar-eclipse.html', '/space-3d/planet-size-comparison.html', '/space-3d/star-lifecycle.html', '/space-3d/exoplanet-transit.html', '/space-3d/tidal-locking.html', '/space-3d/asteroid-belt.html', '/space-3d/comet-orbit.html', '/space-3d/seasons-earth.html', '/space-3d/retrograde-motion.html', '/space-3d/milky-way-map.html', '/space-3d/lagrange-points.html', '/space-3d/neutron-star-pulsar.html', '/space-3d/gas-giant-atmosphere.html', '/space-3d/orbital-resonance.html', '/space-3d/stellar-magnitude.html', '/space-3d/parallax-distance.html', '/space-3d/redshift-doppler.html', '/space-3d/ecliptic-zodiac.html', '/space-3d/gravity-well.html', '/space-3d/constellation-sphere.html', '/space-3d/black-body-radiation.html', '/space-3d/sidereal-vs-solar-day.html', '/space-3d/aurora.html', '/space-3d/mars-terrain.html', '/space-3d/hohmann-transfer.html', '/space-3d/binary-star-system.html', '/space-3d/galilean-moons.html', '/space-3d/escape-velocity.html', '/space-3d/habitable-zone.html', '/space-3d/tides-earth-moon.html', '/space-3d/solar-wind-heliosphere.html', '/space-3d/cosmic-distance-ladder.html', '/space-3d/precession-equinoxes.html', '/space-3d/hr-diagram.html', '/space-3d/sun-structure.html', '/space-3d/orbital-velocity.html', '/space-3d/earth-magnetosphere.html', '/space-3d/sunspot-cycle.html', '/space-3d/uranus-tilt.html', '/space-3d/roche-limit.html', '/space-3d/solar-analemma.html', '/space-3d/saturn-hexagon.html', '/space-3d/supernova-remnant.html', '/space-3d/planetary-nebula.html', '/space-3d/venus-retrograde-rotation.html', '/space-3d/gravitational-slingshot.html', '/space-3d/three-body-problem.html', '/space-3d/meteor-shower-radiant.html', '/space-3d/kuiper-belt-oort-cloud.html', '/space-3d/jupiter-magnetosphere.html', '/space-3d/light-cone.html', '/space-3d/spacetime-curvature.html', '/space-3d/gravitational-waves.html', '/space-3d/hill-sphere.html', '/space-3d/cepheid-variable.html', '/space-3d/expanding-universe.html', '/space-3d/doppler-radial-velocity.html', '/space-3d/star-trails.html', '/space-3d/tidal-heating.html', '/space-3d/planetary-rings-comparison.html', '/space-3d/n-body-sandbox.html', '/space-3d/coordinate-systems-sky.html', '/space-3d/cmb-sky.html', '/space-3d/stellar-nucleosynthesis.html', '/space-3d/moon-libration.html', '/space-3d/tidal-disruption-event.html', '/space-3d/sunspot-magnetic-loops.html', '/space-3d/gravitational-redshift.html', '/space-3d/cosmic-ray-shower.html', '/space-3d/stellar-parallax.html', '/space-3d/einstein-ring.html', '/space-3d/tidal-tails.html', '/space-3d/trojan-asteroids.html', '/space-3d/solar-granulation.html', '/space-3d/kirkwood-gaps.html', '/space-3d/equation-of-time.html', '/space-3d/zodiacal-light.html', '/space-3d/stellar-proper-motion.html', '/space-3d/aberration-of-starlight.html', '/space-3d/planetary-conjunction.html', '/space-3d/planetary-oblateness.html', '/space-3d/coriolis-effect.html', '/space-3d/earthshine.html', '/space-3d/roche-lobe-binary.html', '/space-3d/foucault-pendulum.html', '/space-3d/magnetic-reconnection.html', '/space-3d/apsidal-precession.html', '/space-3d/synodic-lunar-month.html', '/space-3d/earth-moon-barycenter.html', '/space-3d/lunar-nodes-eclipse-seasons.html', '/space-3d/venus-phases-galileo.html', '/space-3d/shepherd-moons.html', '/space-3d/comet-tail-types.html', '/space-3d/protoplanetary-disk.html', '/space-3d/occultation-lunar.html', '/space-3d/van-allen-belts.html', '/space-3d/circumbinary-planet.html', '/space-3d/debris-disk.html', '/space-3d/brown-dwarf.html', '/space-3d/kilonova.html', '/space-3d/carrington-event.html', '/space-3d/trappist-1.html', '/space-3d/tabbys-star.html', '/space-3d/oumuamua.html', '/space-3d/betelgeuse-dimming.html', '/space-3d/pillars-of-creation.html', '/space-3d/pale-blue-dot.html', '/space-3d/wow-signal.html', '/space-3d/chelyabinsk-meteor.html', '/space-3d/enceladus-geysers.html', '/space-3d/phobos-stickney.html', '/space-3d/vesta-rheasilvia.html', '/space-3d/miranda-verona-rupes.html', '/space-3d/charon-serenity-chasma.html', '/space-3d/iapetus-equatorial-ridge.html', '/space-3d/mimas-herschel.html', '/space-3d/hyperion-sponge.html', '/space-3d/wormhole.html', '/space-3d/satellite-orbit-classes.html', '/space-3d/triton-cantaloupe.html', '/space-3d/dwarf-planet-comparison.html', '/space-3d/haumea-elongated.html', '/space-3d/sagittarius-a-star.html', '/space-3d/impact-crater-formation.html', '/space-3d/axial-tilt-comparison.html', '/space-3d/moon-formation-giant-impact.html', '/space-3d/andromeda-collision.html', '/space-3d/geocentric-vs-heliocentric.html'],
  },
  // dinosaur-loop (2026-07-15) - third non-'-tools' reader category: procedural
  // 3D DINOSAUR viewers (rotate / walk-cycle / size-vs-human / clickable body
  // parts, no win-lose). Distinct reader-task from space-3d (astronomy) and
  // /games (win-lose). Hub detection via isHubRoute() (non-'-tools' hubRoute).
  // Routes appended per fire by the dinosaur-3d-discovery-loop runbook.
  {
    cluster: 'dinosaur-3d',
    hubRoute: '/dinosaur-3d.html',
    hubLabel: 'Back to Dinosaurs 3D',
    routes: ['/dinosaur-3d/tyrannosaurus-rex.html', '/dinosaur-3d/mosasaurus.html', '/dinosaur-3d/velociraptor.html', '/dinosaur-3d/triceratops.html', '/dinosaur-3d/spinosaurus.html', '/dinosaur-3d/stegosaurus.html', '/dinosaur-3d/brachiosaurus.html', '/dinosaur-3d/ankylosaurus.html', '/dinosaur-3d/parasaurolophus.html', '/dinosaur-3d/pteranodon.html', '/dinosaur-3d/allosaurus.html', '/dinosaur-3d/acrocanthosaurus.html', '/dinosaur-3d/giganotosaurus.html', '/dinosaur-3d/diplodocus.html', '/dinosaur-3d/apatosaurus.html', '/dinosaur-3d/carnotaurus.html', '/dinosaur-3d/dilophosaurus.html', '/dinosaur-3d/iguanodon.html', '/dinosaur-3d/pachycephalosaurus.html', '/dinosaur-3d/gallimimus.html', '/dinosaur-3d/therizinosaurus.html', '/dinosaur-3d/deinonychus.html', '/dinosaur-3d/utahraptor.html', '/dinosaur-3d/baryonyx.html', '/dinosaur-3d/plesiosaurus.html', '/dinosaur-3d/pachyrhinosaurus.html', '/dinosaur-3d/ground-sloth.html', '/dinosaur-3d/ichthyosaurus.html', '/dinosaur-3d/edmontosaurus.html', '/dinosaur-3d/protoceratops.html', '/dinosaur-3d/ceratosaurus.html', '/dinosaur-3d/brontosaurus.html', '/dinosaur-3d/megalosaurus.html', '/dinosaur-3d/microraptor.html', '/dinosaur-3d/majungasaurus.html', '/dinosaur-3d/cryolophosaurus.html', '/dinosaur-3d/concavenator.html', '/dinosaur-3d/albertaceratops.html', '/dinosaur-3d/tsintaosaurus.html', '/dinosaur-3d/ornithomimus.html', '/dinosaur-3d/tylosaurus.html', '/dinosaur-3d/gorgosaurus.html', '/dinosaur-3d/dimetrodon.html', '/dinosaur-3d/ichthyovenator.html', '/dinosaur-3d/ampelosaurus.html', '/dinosaur-3d/seismosaurus.html', '/dinosaur-3d/stygimoloch.html', '/dinosaur-3d/avaceratops.html', '/dinosaur-3d/titanoboa.html', '/dinosaur-3d/moropus.html', '/dinosaur-3d/gryponyx.html', '/dinosaur-3d/brontotherium.html', '/dinosaur-3d/hybodus.html', '/dinosaur-3d/coelophysis.html', '/dinosaur-3d/quetzalcoatlus.html', '/dinosaur-3d/gigantoraptor.html', '/dinosaur-3d/tarbosaurus.html', '/dinosaur-3d/titanosaurus.html', '/dinosaur-3d/dracovenator.html', '/dinosaur-3d/sauropelta.html', '/dinosaur-3d/brachylophosaurus.html', '/dinosaur-3d/shuangmiaosaurus.html', '/dinosaur-3d/alioramus.html', '/dinosaur-3d/doliosauriscus.html', '/dinosaur-3d/mamenchisaurus.html', '/dinosaur-3d/compsognathus.html', '/dinosaur-3d/troodon.html', '/dinosaur-3d/albertosaurus.html', '/dinosaur-3d/pentaceratops.html', '/dinosaur-3d/deinocheirus.html', '/dinosaur-3d/ostafrikasaurus.html', '/dinosaur-3d/barosaurus.html', '/dinosaur-3d/torvosaurus.html', '/dinosaur-3d/sarcosuchus.html', '/dinosaur-3d/postosuchus.html', '/dinosaur-3d/amargasaurus.html', '/dinosaur-3d/kentrosaurus.html', '/dinosaur-3d/chasmosaurus.html', '/dinosaur-3d/abelisaurus.html'],
  },
  // news-loop (2026-07-08) - dated, source-cited updates on the file formats,
  // browser capabilities, and standards the tool clusters serve. Articles are
  // shipped one per fire by prompts/news-discovery-loop-runbook.md; every
  // article bridges into the tool/guide pages its story affects (topical-map
  // support role, never a doorway). Non-'-tools' hubRoute like games/space-3d.
  {
    cluster: 'news',
    hubRoute: '/news.html',
    hubLabel: 'Back to News',
    routes: ['/news/jpeg-xl-returns-chrome-firefox.html', '/news/pt/jpeg-xl-returns-chrome-firefox.html', '/news/es/jpeg-xl-returns-chrome-firefox.html', '/news/vi/jpeg-xl-returns-chrome-firefox.html', '/news/id/jpeg-xl-returns-chrome-firefox.html', '/news/de/jpeg-xl-returns-chrome-firefox.html', '/news/av2-codec-finalized-no-browser-support-yet.html', '/news/pt/av2-codec-finalized-no-browser-support-yet.html', '/news/es/av2-codec-finalized-no-browser-support-yet.html', '/news/vi/av2-codec-finalized-no-browser-support-yet.html', '/news/id/av2-codec-finalized-no-browser-support-yet.html', '/news/de/av2-codec-finalized-no-browser-support-yet.html', '/news/winrar-rar5-recovery-flaw-patched.html', '/news/pt/winrar-rar5-recovery-flaw-patched.html', '/news/es/winrar-rar5-recovery-flaw-patched.html', '/news/vi/winrar-rar5-recovery-flaw-patched.html', '/news/id/winrar-rar5-recovery-flaw-patched.html', '/news/de/winrar-rar5-recovery-flaw-patched.html', '/news/heic-arrived-with-ios-11.html', '/news/pt/heic-arrived-with-ios-11.html', '/news/es/heic-arrived-with-ios-11.html', '/news/vi/heic-arrived-with-ios-11.html', '/news/id/heic-arrived-with-ios-11.html', '/news/de/heic-arrived-with-ios-11.html', '/news/fat32-four-gib-file-limit.html', '/news/windows-11-fat32-format-2tb.html', '/news/7-zip-rar5-motw-bypass.html', '/news/pt/7-zip-rar5-motw-bypass.html', '/news/es/7-zip-rar5-motw-bypass.html', '/news/vi/7-zip-rar5-motw-bypass.html', '/news/id/7-zip-rar5-motw-bypass.html', '/news/de/7-zip-rar5-motw-bypass.html', '/news/adobe-acrobat-apsb26-63.html', '/news/libheif-cve-2026-32740.html', '/news/pt/libheif-cve-2026-32740.html', '/news/de/libheif-cve-2026-32740.html', '/news/id/libheif-cve-2026-32740.html', '/news/vi/libheif-cve-2026-32740.html', '/news/es/libheif-cve-2026-32740.html', '/news/es/adobe-acrobat-apsb26-63.html', '/news/vi/adobe-acrobat-apsb26-63.html', '/news/de/adobe-acrobat-apsb26-63.html', '/news/id/adobe-acrobat-apsb26-63.html', '/news/pt/adobe-acrobat-apsb26-63.html', '/news/pt/fat32-four-gib-file-limit.html', '/news/pt/windows-11-fat32-format-2tb.html', '/news/es/fat32-four-gib-file-limit.html', '/news/es/windows-11-fat32-format-2tb.html', '/news/vi/fat32-four-gib-file-limit.html', '/news/vi/windows-11-fat32-format-2tb.html', '/news/id/fat32-four-gib-file-limit.html', '/news/id/windows-11-fat32-format-2tb.html', '/news/de/fat32-four-gib-file-limit.html', '/news/de/windows-11-fat32-format-2tb.html', '/news/mp3-patents-expired-2017.html', '/news/pt/mp3-patents-expired-2017.html', '/news/es/mp3-patents-expired-2017.html'],
  },
  {
    cluster: 'guides',
    hubRoute: '/guides.html',
    hubLabel: 'Back to All Guides',
    routes: [
      // Phase 7-13 published guides (chronological).
      '/guides/heic-vs-jpg-vs-webp.html',
      '/guides/dead-pixel-testing-guide.html',
      '/guides/unix-timestamps-explained.html',
      '/guides/pdf-password-types-owner-vs-user.html',
      '/guides/png-vs-svg-when-to-use.html',
      '/guides/css-minifier-vs-compressor.html',
      '/guides/mp4-vs-webm-for-web.html',
      '/guides/jpg-vs-png-for-web.html',
      '/guides/md5-vs-sha256-when-to-hash.html',
      '/guides/csv-vs-json-data-formats.html',
      '/guides/pdf-vs-heic-for-document-archival.html',
      '/guides/ffmpeg-online-vs-local-ffmpeg-when-each-wins.html',
      '/guides/how-to-convert-100-heic-photos-to-jpg.html',
      '/guides/how-to-test-for-dead-pixels-before-returning-a-monitor.html',
      '/guides/how-to-sign-pdf-after-removing-a-password.html',
      '/guides/how-to-extract-frames-from-a-gif-for-a-social-post.html',
      '/guides/how-to-check-webcam-and-microphone-before-an-interview.html',
      '/guides/how-to-minify-css-js-for-cloud-run-cold-start.html',
      '/guides/what-we-learned-running-free-in-browser-image-tools-for-100k-monthly-users.html',
      '/guides/when-to-compress-vs-convert-an-image.html',
      '/guides/how-to-compress-a-folder-for-email.html',
      '/guides/device-test-checklist-for-remote-work.html',
      '/guides/pdf-editing-ladder.html',
      '/guides/file-compressor-vs-zip-what-to-pick.html',
      '/guides/heic-vs-jpg-converter-when-each-wins.html',
      // Phase 16 Cycle A.
      '/guides/what-is-a-file-compressor-and-which-to-use.html',
      '/guides/how-to-compress-a-file-online.html',
      '/guides/how-to-reduce-zip-file-size-online.html',
      // Phase 16 Cycle B.
      '/guides/how-to-convert-heic-to-jpg-step-by-step.html',
      '/guides/what-an-lcd-test-does-and-when-to-run-one.html',
      '/guides/how-to-make-a-zip-file-smaller.html',
      '/guides/how-to-compress-zip-file-to-smaller-size.html',
      '/guides/online-zip-vs-7z-vs-rar-which-to-pick.html',
      '/guides/how-to-zip-multiple-files-into-one.html',
      '/guides/how-to-zip-folder-online-step-by-step.html',
      '/guides/zip-vs-zipx-vs-rar-vs-7z-archive-formats-explained.html',
      '/guides/recover-corrupt-zip-file-options.html',
      '/guides/iphone-photo-format-explained-heic-jpg-png-raw.html',
      '/guides/how-to-convert-iphone-photo-to-jpg.html',
      '/guides/jpg-vs-jpeg-are-they-the-same.html',
      '/guides/svg-to-png-when-to-rasterize-an-svg.html',
      '/guides/how-to-check-camera-quality-on-your-phone.html',
      '/guides/microphone-test-online-what-it-actually-checks.html',
      '/guides/keyboard-tester-online-rollover-vs-anti-ghosting.html',
      '/guides/why-md5-cannot-be-decrypted.html',
      '/guides/text-diff-vs-line-diff-vs-word-diff-vs-git-diff.html',
      '/guides/json-vs-yaml-vs-toml-config-formats-explained.html',
      '/guides/css-minifier-vs-uglifier-vs-tree-shaking.html',
      '/guides/base64-when-to-use-and-when-not-to.html',
      '/guides/how-to-split-a-gif-into-frames-for-editing.html',
      '/guides/how-to-crop-and-rotate-an-image.html',
      '/guides/photo-editor-vs-graphics-app-vs-batch-processor.html',
      '/guides/mp4-vs-mov-vs-mkv-which-container-when.html',
      '/guides/free-online-tools-that-work-without-uploading-files.html',
      '/guides/qr-code-generator-best-practices.html'
    ],
  },
];

const ROUTE_TO_HUB_LINK = new Map(
  SEO_CLUSTER_GROUPS.flatMap(({ hubRoute, hubLabel, routes }) => routes.map((route) => [route, { href: hubRoute, label: hubLabel }]))
);

function normalizeRoute(route) {
  if (!route) {
    return '';
  }
  return route.startsWith('/') ? route : `/${route}`;
}

export function resolveHubBacklink(route) {
  return ROUTE_TO_HUB_LINK.get(normalizeRoute(route)) ?? null;
}

export function getSeoClusterGroups() {
  return SEO_CLUSTER_GROUPS.map((group) => ({
    ...group,
    routes: [...group.routes],
  }));
}

/**
 * True when the route is a category hub page. Two ways to be a hub:
 *   1. The '/<x>-tools.html' naming convention (the 8 legacy tool clusters).
 *   2. Explicit hubRoute registration in SEO_CLUSTER_GROUPS - the pattern
 *      page-renderer.mjs introduced for /guides.html and that the fire-23
 *      /games.html + /space-3d.html hubs rely on.
 * Shared by export-site.mjs (showRating gate), sitemap-writer.mjs (hub vs
 * tool sitemap split + llms.txt kind), and sitemap-html-builder.mjs (home
 * search datalist exclusion) so hub detection cannot drift per call site
 * again. NOTE: this also matches /guides.html - call sites that need to
 * exclude the guides hub must do so explicitly (they already exclude
 * /guides/* by prefix).
 */
export function isHubRoute(route) {
  const normalized = normalizeRoute(route);
  if (normalized.endsWith('-tools.html')) {
    return true;
  }
  return SEO_CLUSTER_GROUPS.some((group) => group.hubRoute === normalized);
}
