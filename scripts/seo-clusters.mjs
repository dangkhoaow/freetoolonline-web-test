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
    '/image-tools/steganography.html', '/image-tools/background-remover.html', '/image-tools/document-scanner.html', '/image-tools/image-to-text-ocr.html', '/image-tools/passport-photo-maker.html', '/image-tools/photo-restoration.html', '/image-tools/image-exif-viewer.html', '/image-tools/image-metadata-remover.html', '/image-tools/image-color-palette-extractor.html', '/image-tools/favicon-generator.html', '/image-tools/image-watermark.html', '/image-tools/signature-maker.html', '/image-tools/meme-maker.html', '/image-tools/face-blur.html', '/image-tools/ai-watermark-detector.html', '/image-tools/photo-translator.html', '/image-tools/alt-text-generator.html'],
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
    routes: ['/heic-to-jpg.html', '/svg-to-png.html', '/png-to-svg.html', '/image-to-base64.html', '/base64-to-image.html', '/extract-gif-to-image-frames.html', '/image-converter-tools/audio-converter.html', '/image-converter-tools/png-to-webp.html', '/image-converter-tools/jpg-to-webp.html', '/image-converter-tools/webp-to-png.html', '/image-converter-tools/webp-to-jpg.html', '/image-converter-tools/image-to-webp.html', '/image-converter-tools/png-to-jpg.html', '/image-converter-tools/image-format-converter.html', '/image-converter-tools/jpg-to-avif-converter.html', '/image-converter-tools/foxit-pdf-editor-browser.html', '/image-converter-tools/adobe-pdf-editor-browser.html', '/image-converter-tools/pdf-xchange-editor-browser-plugin-edge.html', '/image-converter-tools/client-side-pdf-editor-toolkit.html', '/image-converter-tools/hilbert-editor.html', '/image-converter-tools/handwriting-to-text.html'],
  },
  {
    cluster: 'pdf',
    hubRoute: '/pdf-tools.html',
    hubLabel: 'Back to PDF Tools',
    routes: ['/compose-pdf.html', '/split-pdf-by-range.html', '/split-pdf-to-each-pages.html', '/join-pdf-from-multiple-files.html', '/protect-pdf-by-password.html', '/remove-pdf-password.html', '/preflight-pdf.html', '/flatten-pdf.html', '/pdf-to-text.html', '/pdf-to-images.html', '/pdf-to-html.html', '/images-to-pdf.html', '/pdf-tools/pdf-filler-form-editor.html', '/pdf-tools/rotate-pdf.html', '/pdf-tools/delete-pdf-pages.html', '/pdf-tools/add-watermark-to-pdf.html', '/pdf-tools/add-page-numbers-to-pdf.html', '/pdf-tools/organize-pdf-pages.html', '/pdf-tools/pdf-compressor.html', '/pdf-tools/sign-pdf.html', '/pdf-tools/pdf-editor-online.html', '/pdf-tools/chat-with-pdf.html', '/pdf-tools/ocr-pdf.html', '/pdf-tools/file-viewer.html'],
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
    routes: ['/json-parser.html', '/css-minifier.html', '/css-unminifier.html', '/js-minifier.html', '/js-unminifier.html', '/text-diff.html', '/md5-converter.html', '/css-gradient-generator.html', '/text-html-editor.html', '/developer-tools/regex-tester.html', '/developer-tools/color-picker.html', '/developer-tools/data-visualizer.html', '/developer-tools/code-editor.html', '/developer-tools/code-formatter-beautifier.html', '/developer-tools/word-counter.html', '/developer-tools/sort-text-lines.html', '/developer-tools/remove-duplicate-lines.html', '/developer-tools/reverse-text.html', '/developer-tools/text-repeater.html', '/developer-tools/base64-encoder.html', '/developer-tools/url-decoder.html', '/developer-tools/character-counter.html', '/developer-tools/find-and-replace-text.html', '/developer-tools/file-encryption-tool.html', '/developer-tools/jwt-decoder.html', '/developer-tools/uuid-generator.html', '/developer-tools/hash-generator.html', '/developer-tools/case-converter.html', '/developer-tools/json-to-typescript.html', '/developer-tools/markdown-to-html.html', '/developer-tools/html-to-markdown.html', '/developer-tools/wcag-contrast-checker.html', '/developer-tools/svg-optimizer.html', '/developer-tools/sql-formatter.html', '/developer-tools/html-entity-encoder.html', '/developer-tools/password-strength-checker.html', '/developer-tools/lorem-ipsum-generator.html', '/developer-tools/number-base-converter.html', '/developer-tools/csv-to-json-converter.html', '/developer-tools/yaml-to-json-converter.html', '/developer-tools/css-box-shadow-generator.html', '/developer-tools/css-grid-generator.html', '/developer-tools/user-agent-parser.html', '/developer-tools/cron-expression-parser.html', '/developer-tools/slug-generator.html', '/developer-tools/whitespace-remover.html', '/developer-tools/html-tag-remover.html', '/developer-tools/binary-text-converter.html', '/developer-tools/rot13-encoder.html', '/developer-tools/xml-formatter.html', '/developer-tools/json-diff-checker.html'],
  },
  {
    cluster: 'video',
    hubRoute: '/video-tools.html',
    hubLabel: 'Back to Video Tools',
    routes: ['/video-converter.html', '/video-maker.html', '/ffmpeg-online.html', '/hd-video-converter.html', '/video-tools/video-trimmer.html', '/video-tools/video-to-gif.html', '/video-tools/audio-trimmer.html', '/video-tools/strip-audio-from-video.html', '/video-tools/video-compressor.html', '/video-tools/video-splitter.html', '/video-tools/video-merger.html', '/video-tools/video-speed-changer.html', '/video-tools/audio-speed-changer.html', '/video-tools/av1-to-mp4-converter.html', '/video-tools/av1-to-webm-converter.html', '/video-tools/subtitle-generator.html', '/video-tools/audio-denoiser.html', '/video-tools/silence-remover.html', '/video-tools/vocal-remover.html'],
  },
  {
    cluster: 'device-test',
    hubRoute: '/device-test-tools.html',
    hubLabel: 'Back to Device Test Tools',
    routes: ['/microphone-test.html', '/camera-test.html', '/lcd-test.html', '/keyboard-test.html', '/device-test-tools/screen-recorder.html', '/device-test-tools/gpu-test.html', '/device-test-tools/speaker-test.html', '/device-test-tools/mouse-test.html', '/device-test-tools/gamepad-test.html', '/device-test-tools/touchscreen-test.html', '/device-test-tools/monitor-refresh-rate-test.html'],
  },
  {
    cluster: 'utility',
    hubRoute: '/utility-tools.html',
    hubLabel: 'Back to Utility Tools',
    routes: ['/file-compressor.html', '/convert-time-in-millisecond-to-date.html', '/get-time-in-millisecond.html', '/qr-code-generator.html', '/do-nong-do-con-truc-tuyen.html', '/cong-cu-chuyen-doi-chu-quoc-ngu-tieng-viet-thanh-tieq-viet-kieu-moi.html', '/utility-tools/todo-list.html', '/utility-tools/unit-converter.html', '/utility-tools/font-generator.html', '/utility-tools/private-ai-chat.html', '/utility-tools/analog-clock.html', '/utility-tools/digital-clock.html', '/utility-tools/countdown-timer.html', '/utility-tools/stopwatch.html', '/utility-tools/online-alarm-clock.html', '/utility-tools/wheel-spinner.html', '/utility-tools/dice-roller.html', '/utility-tools/coin-flip.html', '/utility-tools/random-number-picker.html', '/utility-tools/name-shuffler.html', '/utility-tools/yes-or-no-wheel.html', '/utility-tools/password-generator.html', '/utility-tools/voice-recorder.html', '/utility-tools/text-to-speech.html', '/utility-tools/speech-to-text.html', '/utility-tools/habit-tracker.html', '/utility-tools/grocery-list.html', '/utility-tools/qr-code-scanner.html', '/utility-tools/percentage-calculator.html', '/utility-tools/linux-online.html', '/utility-tools/expense-tracker.html', '/utility-tools/pomodoro-timer.html', '/utility-tools/random-name-picker.html', '/utility-tools/bmi-calculator.html', '/utility-tools/tip-calculator.html', '/utility-tools/loan-calculator.html', '/utility-tools/date-difference-calculator.html', '/utility-tools/note-taking-app.html', '/utility-tools/flashcards-maker.html', '/utility-tools/age-calculator.html', '/utility-tools/morse-code-translator.html', '/utility-tools/metronome.html', '/utility-tools/compound-interest-calculator.html', '/utility-tools/roman-numeral-converter.html', '/utility-tools/barcode-generator.html', '/utility-tools/tdee-calorie-calculator.html', '/utility-tools/scientific-calculator.html', '/utility-tools/aspect-ratio-calculator.html', '/utility-tools/subnet-calculator.html', '/utility-tools/random-team-generator.html', '/utility-tools/time-zone-converter.html', '/utility-tools/white-noise-generator.html', '/utility-tools/gpa-calculator.html', '/utility-tools/duplicate-word-remover.html', '/utility-tools/reading-list-tracker.html', '/utility-tools/workout-tracker.html', '/utility-tools/webcam-recorder.html', '/utility-tools/lottery-number-generator.html', '/utility-tools/savings-goal-calculator.html', '/utility-tools/retirement-calculator.html', '/utility-tools/roi-calculator.html', '/utility-tools/sales-tax-calculator.html', '/utility-tools/pregnancy-due-date-calculator.html', '/utility-tools/chart-maker.html', '/utility-tools/annuity-calculator.html', '/utility-tools/days-from-today-calculator.html', '/utility-tools/mortgage-calculator.html', '/utility-tools/body-fat-percentage-calculator.html', '/utility-tools/simple-interest-calculator.html', '/utility-tools/percent-error-calculator.html', '/utility-tools/aqi-checker.html', '/utility-tools/storm-tracker.html', '/utility-tools/earthquake-tracker.html', '/utility-tools/heat-index-calculator.html', '/utility-tools/sunrise-sunset-calculator.html', '/utility-tools/half-mast-today.html', '/utility-tools/national-day-today.html', '/utility-tools/holiday-countdown.html', '/utility-tools/tournament-prize-money-lookup.html', '/utility-tools/event-time-countdown.html', '/utility-tools/wildfire-map.html', '/utility-tools/text-summarizer.html', '/utility-tools/ai-translator.html', '/utility-tools/vehicle-recall-lookup.html', '/utility-tools/grammar-checker.html', '/utility-tools/paraphrasing-tool.html', '/utility-tools/game-server-status.html', '/utility-tools/is-it-down.html', '/utility-tools/ai-text-detector.html', '/utility-tools/food-recall-lookup.html', '/utility-tools/dst-countdown.html'],
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
    routes: ['/games/space-huggers-platformer.html', '/games/level-13-incremental.html', '/games/snake-classic.html', '/games/retro-tank-battle.html', '/games/garden-defense.html', '/games/voxel-world-builder.html', '/games/sky-gates-flight.html', '/games/city-time-machine.html', '/games/2048-game.html', '/games/city-drive-3d.html', '/games/retro-fps-online.html', '/games/retro-highway-racer.html', '/games/hover-racing.html', '/games/retro-arcade-shooter.html', '/games/marble-maze.html', '/games/asteroid-blaster.html', '/games/hex-puzzle-blocks.html', '/games/procedural-horde-game.html', '/games/chili-blast-shooter.html', '/games/pixel-pipeline-reflex.html', '/games/medieval-wall-defense.html', '/games/cyber-slide-puzzle.html', '/games/starlight-breaker.html', '/games/night-swarm-survivor.html', '/games/neon-tower-rush.html', '/games/cyber-neon-maze.html', '/games/serpentine-3d.html', '/games/neural-particle-life.html', '/games/neon-surge-loop.html', '/games/arrow-dodge-arena.html', '/games/andromeda-star-shooter.html', '/games/pixel-spike-run.html', '/games/orbital-radius-shooter.html', '/games/species-life-battle.html', '/games/gravity-orbit-golf.html', '/games/one-tap-platformer.html', '/games/neon-circuit-racer.html', '/games/pixel-necromancer.html', '/games/thirteen-card-duel.html', '/games/abyss-signal-diver.html', '/games/inferno-soul-walker.html', '/games/sketch-turf-battle.html', '/games/glow-firefly-cat.html', '/games/nova-star-barrage.html', '/games/pixel-realm-rpg.html', '/games/neon-cat-chase.html', '/games/schematic-factory-game.html', '/games/space-grid-puzzle.html', '/games/thirteen-step-escape.html', '/games/floor-thirteen-horror.html', '/games/voxel-fps-arena.html', '/games/lightning-math-battle.html', '/games/precision-bounce-loop.html', '/games/vim-motion-academy.html', '/games/globe-siege.html', '/games/void-trader.html', '/games/layer-flip-platformer.html', '/games/violence-town.html', '/games/claudicus-quest.html', '/games/neon-energy-arena.html', '/games/mono-minefield-grid.html', '/games/space-pi-defense.html', '/games/mono-paddle-duel.html', '/games/head-soccer-arena.html', '/games/idle-capitalist-loop.html', '/games/mono-stack-blocks.html', '/games/mono-grid-duel.html', '/games/pipe-rotate-puzzle.html', '/games/black-hole-square.html', '/games/pixel-park-puzzle.html', '/games/wash-the-cat.html', '/games/ritual-catacombs.html', '/games/potion-brew-shop.html', '/games/cat-typing-race.html', '/games/unlucky-crossing.html', '/games/mystic-card-paw.html', '/games/cat-hop-cloud.html', '/games/herd-cats-home.html', '/games/seasonal-witchcat.html', '/games/desk-cat-coder.html', '/games/boing-cat-platformer.html', '/games/darkline-paws.html', '/games/mor-chess-2.html', '/games/black-cat-hot-tin-roof.html', '/games/machine-guard-corps.html', '/games/solo-battlefield.html', '/games/feast-night.html', '/games/rune-keeper.html', '/games/bounce-back.html', '/games/classic-pong.html', '/games/thirteen-hours.html', '/games/quantum-shift.html', '/games/roller-maze-escape.html', '/games/thirteen-case-files.html', '/games/googol-stopping-game.html', '/games/bangbang-artillery.html', '/games/rock-paper-neural.html', '/games/egg-time-rewind.html', '/games/iso-city-sandbox.html', '/games/neuro-aim-arena.html', '/games/flexbox-froggy.html', '/games/grid-garden.html', '/games/mochi-midnight-escape.html', '/games/swing-block-tower.html', '/games/star-fuel-battle.html', '/games/progress-knight.html', '/games/miami-mice.html', '/games/orbital-order.html', '/games/spike-sprint.html', '/games/neon-deep-space.html', '/games/vim-master.html', '/games/quantum-optics-puzzle.html', '/games/eight-ball-pool.html', '/games/emoji-slot-machine.html', '/games/particle-clicker.html', '/games/the-house-pointclick.html', '/games/server-survival-td.html', '/games/connect-four-ai.html', '/games/elm-street-delivery.html'],
  },
  {
    cluster: 'space-3d',
    hubRoute: '/space-3d.html',
    hubLabel: 'Back to Space 3D',
    routes: ['/space-3d/solar-system.html', '/space-3d/gravitational-microlensing.html', '/space-3d/ceres-cryovolcanism.html', '/space-3d/black-hole.html', '/space-3d/galaxy.html', '/space-3d/earth-3d-globe.html', '/space-3d/moon-phases-3d.html', '/space-3d/saturn-rings.html', '/space-3d/kepler-orbits.html', '/space-3d/moon-calendar-3d.html', '/space-3d/iss-orbit-tracker.html', '/space-3d/lunar-eclipse.html', '/space-3d/solar-eclipse.html', '/space-3d/planet-size-comparison.html', '/space-3d/star-lifecycle.html', '/space-3d/exoplanet-transit.html', '/space-3d/tidal-locking.html', '/space-3d/asteroid-belt.html', '/space-3d/comet-orbit.html', '/space-3d/seasons-earth.html', '/space-3d/retrograde-motion.html', '/space-3d/milky-way-map.html', '/space-3d/lagrange-points.html', '/space-3d/neutron-star-pulsar.html', '/space-3d/gas-giant-atmosphere.html', '/space-3d/orbital-resonance.html', '/space-3d/stellar-magnitude.html', '/space-3d/parallax-distance.html', '/space-3d/redshift-doppler.html', '/space-3d/ecliptic-zodiac.html', '/space-3d/gravity-well.html', '/space-3d/constellation-sphere.html', '/space-3d/black-body-radiation.html', '/space-3d/sidereal-vs-solar-day.html', '/space-3d/aurora.html', '/space-3d/mars-terrain.html', '/space-3d/hohmann-transfer.html', '/space-3d/binary-star-system.html', '/space-3d/galilean-moons.html', '/space-3d/escape-velocity.html', '/space-3d/habitable-zone.html', '/space-3d/tides-earth-moon.html', '/space-3d/solar-wind-heliosphere.html', '/space-3d/io-volcanoes-realtime.html', '/space-3d/cosmic-distance-ladder.html', '/space-3d/precession-equinoxes.html', '/space-3d/hr-diagram.html', '/space-3d/sun-structure.html', '/space-3d/orbital-velocity.html', '/space-3d/earth-magnetosphere.html', '/space-3d/sunspot-cycle.html', '/space-3d/uranus-tilt.html', '/space-3d/roche-limit.html', '/space-3d/solar-analemma.html', '/space-3d/saturn-hexagon.html', '/space-3d/supernova-remnant.html', '/space-3d/planetary-nebula.html', '/space-3d/venus-retrograde-rotation.html', '/space-3d/gravitational-slingshot.html', '/space-3d/three-body-problem.html', '/space-3d/meteor-shower-radiant.html', '/space-3d/kuiper-belt-oort-cloud.html', '/space-3d/jupiter-magnetosphere.html', '/space-3d/light-cone.html', '/space-3d/spacetime-curvature.html', '/space-3d/gravitational-waves.html', '/space-3d/hill-sphere.html', '/space-3d/cepheid-variable.html', '/space-3d/expanding-universe.html', '/space-3d/doppler-radial-velocity.html', '/space-3d/star-trails.html', '/space-3d/tidal-heating.html', '/space-3d/planetary-rings-comparison.html', '/space-3d/n-body-sandbox.html', '/space-3d/coordinate-systems-sky.html', '/space-3d/cmb-sky.html', '/space-3d/stellar-nucleosynthesis.html', '/space-3d/moon-libration.html', '/space-3d/tidal-disruption-event.html', '/space-3d/sunspot-magnetic-loops.html', '/space-3d/gravitational-redshift.html', '/space-3d/cosmic-ray-shower.html', '/space-3d/stellar-parallax.html', '/space-3d/einstein-ring.html', '/space-3d/tidal-tails.html', '/space-3d/trojan-asteroids.html', '/space-3d/solar-granulation.html', '/space-3d/kirkwood-gaps.html', '/space-3d/equation-of-time.html', '/space-3d/zodiacal-light.html', '/space-3d/stellar-proper-motion.html', '/space-3d/aberration-of-starlight.html', '/space-3d/planetary-conjunction.html', '/space-3d/planetary-oblateness.html', '/space-3d/coriolis-effect.html', '/space-3d/earthshine.html', '/space-3d/roche-lobe-binary.html', '/space-3d/foucault-pendulum.html', '/space-3d/magnetic-reconnection.html', '/space-3d/apsidal-precession.html', '/space-3d/synodic-lunar-month.html', '/space-3d/earth-moon-barycenter.html', '/space-3d/lunar-nodes-eclipse-seasons.html', '/space-3d/venus-phases-galileo.html', '/space-3d/shepherd-moons.html', '/space-3d/comet-tail-types.html', '/space-3d/protoplanetary-disk.html', '/space-3d/occultation-lunar.html', '/space-3d/van-allen-belts.html', '/space-3d/circumbinary-planet.html', '/space-3d/debris-disk.html', '/space-3d/brown-dwarf.html', '/space-3d/kilonova.html', '/space-3d/carrington-event.html', '/space-3d/trappist-1.html', '/space-3d/tabbys-star.html', '/space-3d/oumuamua.html', '/space-3d/betelgeuse-dimming.html', '/space-3d/pillars-of-creation.html', '/space-3d/pale-blue-dot.html', '/space-3d/wow-signal.html', '/space-3d/chelyabinsk-meteor.html', '/space-3d/enceladus-geysers.html', '/space-3d/phobos-stickney.html', '/space-3d/vesta-rheasilvia.html', '/space-3d/miranda-verona-rupes.html', '/space-3d/charon-serenity-chasma.html', '/space-3d/iapetus-equatorial-ridge.html', '/space-3d/mimas-herschel.html', '/space-3d/hyperion-sponge.html', '/space-3d/wormhole.html', '/space-3d/satellite-orbit-classes.html', '/space-3d/triton-cantaloupe.html', '/space-3d/dwarf-planet-comparison.html', '/space-3d/haumea-elongated.html', '/space-3d/sagittarius-a-star.html', '/space-3d/impact-crater-formation.html', '/space-3d/axial-tilt-comparison.html', '/space-3d/moon-formation-giant-impact.html', '/space-3d/andromeda-collision.html', '/space-3d/geocentric-vs-heliocentric.html', '/space-3d/dark-matter-rotation-curves.html', '/space-3d/apollo-free-return-trajectory.html', '/space-3d/new-horizons-pluto-flyby.html', '/space-3d/coronal-mass-ejection.html', '/space-3d/pluto-charon-double-planet.html', '/space-3d/globular-cluster.html', '/space-3d/magnetar.html', '/space-3d/white-dwarf-chandrasekhar-limit.html', '/space-3d/titan-methane-lakes.html', '/space-3d/algol-eclipsing-binary.html', '/space-3d/main-sequence-lifetime.html', '/space-3d/earth-perihelion-aphelion.html', '/space-3d/exoplanet-atmosphere-spectroscopy.html', '/space-3d/saros-cycle.html', '/space-3d/starlink-constellation-shells.html', '/space-3d/proton-proton-chain-fusion.html', '/space-3d/apophis-2029-flyby.html', '/space-3d/europa-subsurface-ocean.html', '/space-3d/space-debris-kessler.html', '/space-3d/galactic-coordinate-transforms.html', '/space-3d/pulsar-timing-array.html', '/space-3d/karman-line-atmosphere-layers.html', '/space-3d/twilight-types.html', '/space-3d/venus-runaway-greenhouse.html', '/space-3d/fast-radio-bursts.html', '/space-3d/jwst-l2-halo-orbit.html', '/space-3d/cassini-grand-finale.html', '/space-3d/type-ia-supernova-standard-candle.html', '/space-3d/yarkovsky-effect.html', '/space-3d/torino-impact-hazard-scale.html', '/space-3d/gps-time-dilation.html', '/space-3d/chariklo-rings.html', '/space-3d/dart-asteroid-deflection.html', '/space-3d/curiosity-rover-traverse.html', '/space-3d/great-red-spot-jupiter.html', '/space-3d/photon-sphere-isco-explorer.html', '/space-3d/proxima-centauri-system.html', '/space-3d/sun-red-giant-future.html', '/space-3d/relativistic-jets-agn.html', '/space-3d/olbers-paradox.html', '/space-3d/io-plasma-torus.html', '/space-3d/kp-index-geomagnetic-storm-scale.html', '/space-3d/olympus-mons-mars-volcano.html', '/space-3d/helioseismology-sun-oscillation.html', '/space-3d/solar-flare-classification.html', '/space-3d/voyager-interstellar-position.html', '/space-3d/bortle-scale-light-pollution.html', '/space-3d/meteor-airburst-size-comparison.html', '/space-3d/mercury-spin-orbit-resonance.html', '/space-3d/neptune-supersonic-winds.html', '/space-3d/borisov-interstellar-comet.html', '/space-3d/strong-lensing-multiple-images.html', '/space-3d/interstellar-travel-timescales.html', '/space-3d/galactic-year-sun-orbit.html', '/space-3d/hayabusa2-ryugu-sample-return.html', '/space-3d/gravitational-microlensing-exoplanet.html', '/space-3d/tsiolkovsky-rocket-equation.html', '/space-3d/fireball-atmospheric-entry.html', '/space-3d/psyche-metal-asteroid.html', '/space-3d/solar-sail-propulsion.html', '/space-3d/planet-atmosphere-scale-heights.html', '/space-3d/lunar-south-pole-ice.html', '/space-3d/exoplanet-direct-imaging.html', '/space-3d/venus-atmospheric-superrotation.html', '/space-3d/restricted-three-body-stability.html', '/space-3d/planet-interior-cutaways.html', '/space-3d/eclipse-path-2026.html', '/space-3d/milankovitch-cycles.html', '/space-3d/earth-moon-orbit-recession.html', '/space-3d/apollo-landing-sites-moon-3d.html', '/space-3d/supermoon-lunar-apsides.html', '/space-3d/bennu-osiris-rex.html', '/space-3d/titan-hydrocarbon-weather-cycle.html', '/space-3d/atmosphere-escape-mars.html', '/space-3d/annual-meteor-shower-calendar.html', '/space-3d/parker-solar-probe.html', '/space-3d/rosetta-philae-67p.html', '/space-3d/space-elevator-physics.html', '/space-3d/mars-dust-storm-seasons.html', '/space-3d/shoemaker-levy-9-impact.html', '/space-3d/ingenuity-mars-helicopter.html', '/space-3d/3i-atlas-interstellar-object.html', '/space-3d/jwst-deployment-sequence.html', '/space-3d/sputnik-planitia-nitrogen-convection.html', '/space-3d/stellar-spectral-classification.html', '/space-3d/yorp-effect-spin-drift.html', '/space-3d/local-bubble-interstellar-cavity.html', '/space-3d/hubble-tuning-fork.html', '/space-3d/transit-timing-variation.html', '/space-3d/geomagnetic-pole-wander.html', '/space-3d/kreutz-sungrazing-comets.html', '/space-3d/atmospheric-refraction-sunset.html', '/space-3d/observable-universe-horizon.html'],  },
  // places-loop (2026-07-27) - famous geographic places as procedural 3D
  // explorers (Dead Sea / Everest / Grand Canyon seed; the places-3d discovery
  // loop adds more from the operator's places list). Reader-task: "show me
  // this place and the number that makes it famous". Non-'-tools' hubRoute
  // like games/space-3d/dinosaur-3d.
  {
    cluster: 'places-3d',
    hubRoute: '/places-3d.html',
    hubLabel: 'Back to Places 3D',
    routes: ['/places-3d/dead-sea.html', '/places-3d/mount-everest.html', '/places-3d/grand-canyon.html', '/places-3d/caspian-sea.html', '/places-3d/lake-baikal.html', '/places-3d/mariana-trench.html', '/places-3d/black-sea.html', '/places-3d/lake-victoria.html', '/places-3d/iguazu-falls.html', '/places-3d/antelope-canyon.html', '/places-3d/atacama-desert.html', '/places-3d/lake-michigan-huron.html', '/places-3d/lake-superior.html', '/places-3d/lake-titicaca.html', '/places-3d/amazon-river.html', '/places-3d/amazon-rainforest.html', '/places-3d/black-forest.html', '/places-3d/stone-forest-shilin.html', '/places-3d/great-barrier-reef.html', '/places-3d/caribbean-sea.html', '/places-3d/ha-long-bay.html', '/places-3d/milford-sound.html', '/places-3d/huacachina-oasis.html', '/places-3d/son-doong-cave.html', '/places-3d/mount-fuji.html', '/places-3d/mammoth-cave.html', '/places-3d/mount-kilimanjaro.html', '/places-3d/nile-river.html', '/places-3d/sahara-desert.html', '/places-3d/salar-de-uyuni.html', '/places-3d/pamir-plateau.html', '/places-3d/tibetan-plateau.html', '/places-3d/dong-van-plateau.html', '/places-3d/cappadocia.html', '/places-3d/mount-vesuvius.html', '/places-3d/mount-etna.html', '/places-3d/perito-moreno-glacier.html', '/places-3d/great-blue-hole.html', '/places-3d/niagara-falls.html', '/places-3d/grand-prismatic-spring.html', '/places-3d/bryce-canyon.html', '/places-3d/uluru.html', '/places-3d/waitomo-caves.html', '/places-3d/sossusvlei.html', '/places-3d/yosemite-valley.html', '/places-3d/matterhorn.html', '/places-3d/plitvice-lakes.html', '/places-3d/mekong-delta.html'],
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
    routes: ['/dinosaur-3d/tyrannosaurus-rex.html', '/dinosaur-3d/mosasaurus.html', '/dinosaur-3d/velociraptor.html', '/dinosaur-3d/triceratops.html', '/dinosaur-3d/spinosaurus.html', '/dinosaur-3d/stegosaurus.html', '/dinosaur-3d/brachiosaurus.html', '/dinosaur-3d/ankylosaurus.html', '/dinosaur-3d/parasaurolophus.html', '/dinosaur-3d/pteranodon.html', '/dinosaur-3d/allosaurus.html', '/dinosaur-3d/acrocanthosaurus.html', '/dinosaur-3d/giganotosaurus.html', '/dinosaur-3d/diplodocus.html', '/dinosaur-3d/apatosaurus.html', '/dinosaur-3d/carnotaurus.html', '/dinosaur-3d/dilophosaurus.html', '/dinosaur-3d/iguanodon.html', '/dinosaur-3d/pachycephalosaurus.html', '/dinosaur-3d/gallimimus.html', '/dinosaur-3d/therizinosaurus.html', '/dinosaur-3d/deinonychus.html', '/dinosaur-3d/utahraptor.html', '/dinosaur-3d/baryonyx.html', '/dinosaur-3d/plesiosaurus.html', '/dinosaur-3d/pachyrhinosaurus.html', '/dinosaur-3d/ground-sloth.html', '/dinosaur-3d/ichthyosaurus.html', '/dinosaur-3d/edmontosaurus.html', '/dinosaur-3d/protoceratops.html', '/dinosaur-3d/ceratosaurus.html', '/dinosaur-3d/brontosaurus.html', '/dinosaur-3d/megalosaurus.html', '/dinosaur-3d/microraptor.html', '/dinosaur-3d/majungasaurus.html', '/dinosaur-3d/cryolophosaurus.html', '/dinosaur-3d/concavenator.html', '/dinosaur-3d/albertaceratops.html', '/dinosaur-3d/tsintaosaurus.html', '/dinosaur-3d/ornithomimus.html', '/dinosaur-3d/tylosaurus.html', '/dinosaur-3d/gorgosaurus.html', '/dinosaur-3d/dimetrodon.html', '/dinosaur-3d/ichthyovenator.html', '/dinosaur-3d/ampelosaurus.html', '/dinosaur-3d/seismosaurus.html', '/dinosaur-3d/stygimoloch.html', '/dinosaur-3d/avaceratops.html', '/dinosaur-3d/titanoboa.html', '/dinosaur-3d/moropus.html', '/dinosaur-3d/gryponyx.html', '/dinosaur-3d/brontotherium.html', '/dinosaur-3d/hybodus.html', '/dinosaur-3d/coelophysis.html', '/dinosaur-3d/quetzalcoatlus.html', '/dinosaur-3d/gigantoraptor.html', '/dinosaur-3d/tarbosaurus.html', '/dinosaur-3d/titanosaurus.html', '/dinosaur-3d/dracovenator.html', '/dinosaur-3d/sauropelta.html', '/dinosaur-3d/brachylophosaurus.html', '/dinosaur-3d/shuangmiaosaurus.html', '/dinosaur-3d/alioramus.html', '/dinosaur-3d/doliosauriscus.html', '/dinosaur-3d/mamenchisaurus.html', '/dinosaur-3d/compsognathus.html', '/dinosaur-3d/troodon.html', '/dinosaur-3d/albertosaurus.html', '/dinosaur-3d/pentaceratops.html', '/dinosaur-3d/deinocheirus.html', '/dinosaur-3d/ostafrikasaurus.html', '/dinosaur-3d/barosaurus.html', '/dinosaur-3d/torvosaurus.html', '/dinosaur-3d/sarcosuchus.html', '/dinosaur-3d/postosuchus.html', '/dinosaur-3d/amargasaurus.html', '/dinosaur-3d/kentrosaurus.html', '/dinosaur-3d/chasmosaurus.html', '/dinosaur-3d/abelisaurus.html', '/dinosaur-3d/psittacosaurus.html', '/dinosaur-3d/becklespinax.html', '/dinosaur-3d/lambeosaurus.html', '/dinosaur-3d/oviraptor.html', '/dinosaur-3d/pinacosaurus.html', '/dinosaur-3d/monolophosaurus.html', '/dinosaur-3d/wendiceratops.html', '/dinosaur-3d/panoplosaurus.html', '/dinosaur-3d/suchomimus.html', '/dinosaur-3d/ouranosaurus.html', '/dinosaur-3d/archaeopteryx.html', '/dinosaur-3d/corythosaurus.html', '/dinosaur-3d/daspletosaurus.html', '/dinosaur-3d/maiasaura.html', '/dinosaur-3d/dakotaraptor.html', '/dinosaur-3d/gorgonops.html', '/dinosaur-3d/woolly-mammoth.html', '/dinosaur-3d/styracosaurus.html', '/dinosaur-3d/estemmenosuchus.html', '/dinosaur-3d/placodus.html', '/dinosaur-3d/beipiaosaurus.html', '/dinosaur-3d/dunkleosteus.html', '/dinosaur-3d/denversaurus.html', '/dinosaur-3d/sinosauropteryx.html', '/dinosaur-3d/yi-qi.html', '/dinosaur-3d/smilodon.html', '/dinosaur-3d/saurosuchus.html', '/dinosaur-3d/anchiornis.html', '/dinosaur-3d/qianzhousaurus.html', '/dinosaur-3d/mapusaurus.html', '/dinosaur-3d/ophthalmosaurus.html', '/dinosaur-3d/elasmotherium.html', '/dinosaur-3d/austroraptor.html', '/dinosaur-3d/magyarosaurus.html', '/dinosaur-3d/tyrannotitan.html', '/dinosaur-3d/dacentrurus.html'],
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
    routes: ['/news/jpeg-xl-returns-chrome-firefox.html', '/news/pt/jpeg-xl-returns-chrome-firefox.html', '/news/es/jpeg-xl-returns-chrome-firefox.html', '/news/vi/jpeg-xl-returns-chrome-firefox.html', '/news/id/jpeg-xl-returns-chrome-firefox.html', '/news/de/jpeg-xl-returns-chrome-firefox.html', '/news/av2-codec-finalized-no-browser-support-yet.html', '/news/pt/av2-codec-finalized-no-browser-support-yet.html', '/news/es/av2-codec-finalized-no-browser-support-yet.html', '/news/vi/av2-codec-finalized-no-browser-support-yet.html', '/news/id/av2-codec-finalized-no-browser-support-yet.html', '/news/de/av2-codec-finalized-no-browser-support-yet.html', '/news/winrar-rar5-recovery-flaw-patched.html', '/news/pt/winrar-rar5-recovery-flaw-patched.html', '/news/es/winrar-rar5-recovery-flaw-patched.html', '/news/vi/winrar-rar5-recovery-flaw-patched.html', '/news/id/winrar-rar5-recovery-flaw-patched.html', '/news/de/winrar-rar5-recovery-flaw-patched.html', '/news/heic-arrived-with-ios-11.html', '/news/pt/heic-arrived-with-ios-11.html', '/news/es/heic-arrived-with-ios-11.html', '/news/vi/heic-arrived-with-ios-11.html', '/news/id/heic-arrived-with-ios-11.html', '/news/de/heic-arrived-with-ios-11.html', '/news/fat32-four-gib-file-limit.html', '/news/windows-11-fat32-format-2tb.html', '/news/7-zip-rar5-motw-bypass.html', '/news/7-zip-cve-2026-14266-xz.html', '/news/pt/7-zip-cve-2026-14266-xz.html', '/news/es/7-zip-cve-2026-14266-xz.html', '/news/vi/7-zip-cve-2026-14266-xz.html', '/news/id/7-zip-cve-2026-14266-xz.html', '/news/de/7-zip-cve-2026-14266-xz.html', '/news/pt/7-zip-rar5-motw-bypass.html', '/news/es/7-zip-rar5-motw-bypass.html', '/news/vi/7-zip-rar5-motw-bypass.html', '/news/id/7-zip-rar5-motw-bypass.html', '/news/de/7-zip-rar5-motw-bypass.html', '/news/adobe-acrobat-apsb26-63.html', '/news/libheif-cve-2026-32740.html', '/news/pt/libheif-cve-2026-32740.html', '/news/de/libheif-cve-2026-32740.html', '/news/id/libheif-cve-2026-32740.html', '/news/vi/libheif-cve-2026-32740.html', '/news/es/libheif-cve-2026-32740.html', '/news/es/adobe-acrobat-apsb26-63.html', '/news/vi/adobe-acrobat-apsb26-63.html', '/news/de/adobe-acrobat-apsb26-63.html', '/news/id/adobe-acrobat-apsb26-63.html', '/news/pt/adobe-acrobat-apsb26-63.html', '/news/pt/fat32-four-gib-file-limit.html', '/news/pt/windows-11-fat32-format-2tb.html', '/news/es/fat32-four-gib-file-limit.html', '/news/es/windows-11-fat32-format-2tb.html', '/news/vi/fat32-four-gib-file-limit.html', '/news/vi/windows-11-fat32-format-2tb.html', '/news/id/fat32-four-gib-file-limit.html', '/news/id/windows-11-fat32-format-2tb.html', '/news/de/fat32-four-gib-file-limit.html', '/news/de/windows-11-fat32-format-2tb.html', '/news/mp3-patents-expired-2017.html', '/news/pt/mp3-patents-expired-2017.html', '/news/es/mp3-patents-expired-2017.html', '/news/vi/mp3-patents-expired-2017.html', '/news/id/mp3-patents-expired-2017.html', '/news/de/mp3-patents-expired-2017.html', '/news/exif-orientation-rotation-trap.html', '/news/pt/exif-orientation-rotation-trap.html', '/news/es/exif-orientation-rotation-trap.html'],
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
