(function () {
    /*

     A harness to handle passing "noteOn", "noteOff", and "pitchbend" events to a synth.  Designed to work with grades
     that extend `lpiano.synth`, which has the correct named IDs to set the values used here.


    chromium-browser --disable-2d-canvas-clip-aa --disable-2d-canvas-image-chromium --disable-3d-apis --disable-accelerated-2d-canvas --disable-accelerated-jpeg-decoding --disable-accelerated-mjpeg-decode --disable-accelerated-video-decode --disable-account-consistency --disable-add-to-shelf --disable-app-info-dialog-mac[5] --disable-app-list-dismiss-on-blur --disable-app-window-cycling[5] --disable-appcontainer --disable-arc-data-wipe --disable-arc-opt-in-verification --disable-audio-support-for-desktop-share --disable-autofill-keyboard-accessory-view[4] --disable-avfoundation-overlays[9] --disable-background-networking --disable-background-timer-throttling --disable-backing-store-limit --disable-blink-features --disable-boot-animation --disable-breakpad --disable-browser-task-scheduler --disable-bundled-ppapi-flash --disable-canvas-aa --disable-captive-portal-bypass-proxy --disable-cast-streaming-hw-encoding --disable-clear-browsing-data-counters --disable-client-side-phishing-detection --disable-cloud-import --disable-component-cloud-policy --disable-component-extensions-with-background-pages --disable-component-update --disable-composited-antialiasing --disable-contextual-search --disable-d3d11 --disable-databases --disable-datasaver-prompt --disable-default-apps --disable-demo-mode --disable-device-disabling --disable-device-discovery-notifications --disable-dinosaur-easter-egg --disable-direct-composition --disable-directwrite-for-ui[1] --disable-display-color-calibration[6] --disable-display-list-2d-canvas --disable-distance-field-text --disable-domain-blocking-for-3d-apis --disable-domain-reliability --disable-download-image-renaming --disable-drive-search-in-app-launcher --disable-dwm-composition --disable-eol-notification --disable-es3-apis --disable-es3-gl-context --disable-extensions --disable-extensions-except --disable-extensions-file-access-check --disable-extensions-http-throttling --disable-fast-web-scroll-view-insets --disable-features --disable-field-trial-config --disable-flash-3d --disable-flash-stage3d --disable-fullscreen-low-power-mode[5] --disable-fullscreen-tab-detaching[5] --disable-gaia-services --disable-gesture-editing --disable-gesture-requirement-for-media-playback --disable-gesture-requirement-for-presentation --disable-gesture-typing --disable-gl-drawing-for-tests --disable-gl-error-limit --disable-gl-extensions --disable-glsl-translator --disable-gpu --disable-gpu-async-worker-context --disable-gpu-compositing --disable-gpu-driver-bug-workarounds --disable-gpu-early-init --disable-gpu-memory-buffer-compositor-resources --disable-gpu-memory-buffer-video-frames --disable-gpu-process-crash-limit --disable-gpu-program-cache --disable-gpu-rasterization --disable-gpu-sandbox --disable-gpu-shader-disk-cache --disable-gpu-vsync --disable-gpu-watchdog --disable-hang-monitor --disable-hid-detection-on-oobe --disable-hide-inactive-stacked-tab-close-buttons --disable-histogram-customizer --disable-hosted-app-shim-creation[5] --disable-hosted-apps-in-windows[5] --disable-http2 --disable-in-process-stack-traces --disable-infobars --disable-input-view --disable-ios-password-generation --disable-ios-password-suggestions --disable-ios-physical-web --disable-javascript-harmony-shipping --disable-kill-after-bad-ipc --disable-lcd-text --disable-legacy-window[1] --disable-local-storage --disable-logging --disable-login-animations --disable-low-end-device-mode --disable-low-latency-dxva --disable-low-res-tiling --disable-lru-snapshot-cache --disable-mac-overlays[9] --disable-mac-views-native-app-windows[5] --disable-main-frame-before-activation --disable-md-oobe --disable-media-session-api[4] --disable-media-suspend --disable-merge-key-char-events[1] --disable-minimize-on-second-launcher-item-click --disable-mojo-renderer[10] --disable-mtp-write-support --disable-multi-display-layout --disable-namespace-sandbox --disable-native-gpu-memory-buffers --disable-network-portal-notification --disable-new-bookmark-apps --disable-new-channel-switcher-ui --disable-new-kiosk-ui --disable-new-korean-ime --disable-new-profile-management --disable-new-zip-unpacker --disable-notifications --disable-ntp-popular-sites --disable-nv12-dxgi-video --disable-offer-store-unmasked-wallet-cards --disable-offer-upload-credit-cards --disable-office-editing-component-extension --disable-offline-auto-reload --disable-offline-auto-reload-visible-only --disable-overlay-scrollbar --disable-overscroll-edge-effect[4] --disable-panel-fitting[6] --disable-partial-raster --disable-password-generation --disable-payment-request --disable-pepper-3d --disable-pepper-3d-image-chromium --disable-per-monitor-dpi[1] --disable-permission-action-reporting --disable-permissions-api --disable-physical-keyboard-autocorrect --disable-pinch --disable-pnacl-crash-throttling --disable-popup-blocking --disable-prefer-compositing-to-lcd-text --disable-presentation-api --disable-print-preview --disable-prompt-on-repost --disable-pull-to-refresh-effect[4] --disable-push-api-background-mode --disable-quic --disable-reading-from-canvas --disable-remote-core-animation[9] --disable-remote-fonts --disable-remote-playback-api --disable-renderer-accessibility --disable-renderer-backgrounding --disable-renderer-priority-management --disable-resize-lock --disable-rgba-4444-textures --disable-rollback-option --disable-rtc-smoothness-algorithm --disable-screen-orientation-lock[4] --disable-search-geolocation-disclosure --disable-seccomp-filter-sandbox --disable-settings-window --disable-setuid-sandbox --disable-shader-name-hashing --disable-shared-workers --disable-signin-scoped-device-id --disable-single-click-autofill --disable-slimming-paint-invalidation --disable-smart-virtual-keyboard --disable-smooth-scrolling --disable-software-rasterizer --disable-speech-api --disable-suggestions-ui --disable-sync --disable-sync-app-list --disable-sync-types --disable-system-timezone-automatic-detection --disable-tab-for-desktop-share --disable-tab-strip-autoscroll-new-tabs --disable-threaded-animation --disable-threaded-compositing --disable-threaded-scrolling --disable-touch-adjustment --disable-touch-drag-drop --disable-translate --disable-translate-new-ux[5] --disable-usb-keyboard-detect[1] --disable-v8-idle-tasks --disable-vaapi-accelerated-video-encode[6] --disable-views-rect-based-targeting --disable-virtual-keyboard-overscroll --disable-voice-input --disable-volume-adjust-sound --disable-wake-on-wifi --disable-web-notification-custom-layouts --disable-web-security --disable-webgl --disable-webgl-image-chromium --disable-webrtc-encryption[11] --disable-webrtc-hw-decoding[11] --disable-webrtc-hw-encoding[11] --disable-webrtc-hw-vp8-encoding[11] --disable-win32k-lockdown[1] --disable-xss-auditor --disable-zero-browsers-open-for-tests --disable-zero-copy --disable-zero-copy-dxgi-video tests/static/synth.html
     */

    var environment = flock.init();

    fluid.registerNamespace("lpiano.harness");

    lpiano.harness.bendPitch = function (synth, value) {
        var scaledValue = ((value / 128) - 64)/0.5;
        synth.set("pitchbend.value", scaledValue );
    };

    fluid.defaults("lpiano.harness", {
        gradeNames: ["fluid.viewComponent"],
        pitchbendTarget: "pitchbend.value",
        components: {
            enviro: "{flock.enviro}",
            controller: {
                type: "flock.midi.controller",
                options: {
                    components: {
                        synthContext: "{synth}"
                    },
                    controlMap: {
                        // Modulation wheel
                        "1": {
                            input: "modwheel.add",
                            transform: {
                                mul: 1/16
                            }
                        },
                        // Volume control
                        "7": {
                            input: "volume.value",
                            transform: {
                                mul: 1/16
                            }
                        }
                    }
                }
            },
            midiConnector: {
                type: "flock.ui.midiConnector",
                container: "{that}.container",
                options: {
                    // TODO: Come up with a harness that lacks this
                    gradeNames: ["lpiano.transcriber"],
                    listeners: {
                        "noteOn.passToSynth": {
                            func: "{synth}.noteOn",
                            args: [
                                "{arguments}.0.note",
                                {
                                    "freq.note": "{arguments}.0.note",
                                    "amp.velocity": "{arguments}.0.velocity"
                                }
                            ]
                        },
                        "noteOff.passToSynth": "{synth}.noteOff({arguments}.0.note)",
                        "pitchbend.passToSynth": {
                            funcName: "lpiano.harness.bendPitch",
                            args:     ["{synth}", "{arguments}.0.value"]
                        }
                    }
                }
            },
            synth: {
                type: "lpiano.synth"
            }
        },
        listeners: {
            onCreate: [
                "{that}.enviro.start()"
            ]
        }
    });
})();