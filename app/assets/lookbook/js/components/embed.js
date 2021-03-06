import "iframe-resizer/js/iframeResizer";

export default function embed() {
  return {
    init() {
      if (!this.$store.pages.embeds[this.$root.id]) {
        this.$store.pages.embeds[this.$root.id] = {
          width: "100%",
        };
      }
    },
    lastWidth: null,
    reflowing: false,
    get resizer() {
      if (this.$refs.iframe) {
        if (!this.$refs.iframe.iFrameResizer) {
          window.iFrameResize(
            {
              heightCalculationMethod: "lowestElement",
              onResized: this.onIframeResized.bind(this),
            },
            this.$refs.iframe
          );
        }
        return this.$refs.iframe.iFrameResizer;
      }
      return null;
    },
    set width(value) {
      this.store.width = value;
    },
    get width() {
      return this.store.width || "100%";
    },
    get height() {
      return this.store.height;
    },
    get parentWidth() {
      return Math.round(this.$root.parentElement.clientWidth);
    },
    get maxWidth() {
      return this.width === "100%" ? "100%" : `${this.width}px`;
    },
    get store() {
      return this.$store.pages.embeds[this.$root.id];
    },
    recaclulateIframeHeight() {
      if (this.resizer) this.resizer.resize();
    },
    onIframeResized({ iframe, height }) {
      if (iframe.isSameNode(this.$refs.iframe)) {
        this.store.height = height;
      }
    },
    onResizeWidth(e) {
      const width =
        this.resizeStartWidth - (this.resizeStartPositionX - e.pageX);
      const boundedWidth = Math.min(
        Math.max(Math.round(width), 200),
        this.parentWidth
      );
      this.width = boundedWidth === this.parentWidth ? "100%" : boundedWidth;
      this.recaclulateIframeHeight();
    },
    onResizeWidthStart(e) {
      this.reflowing = true;
      this.onResizeWidth = this.onResizeWidth.bind(this);
      this.onResizeWidthEnd = this.onResizeWidthEnd.bind(this);
      this.resizeStartPositionX = e.pageX;
      this.resizeStartWidth = this.$refs.resizer.clientWidth;
      window.addEventListener("pointermove", this.onResizeWidth);
      window.addEventListener("pointerup", this.onResizeWidthEnd);
    },
    onResizeWidthEnd() {
      window.removeEventListener("pointermove", this.onResizeWidth);
      window.removeEventListener("pointerup", this.onResizeWidthEnd);
      this.reflowing = false;
    },
    toggleFullWidth() {
      if (this.width === "100%" && this.lastWidth) {
        this.width = this.lastWidth;
      } else {
        this.lastWidth = this.width;
        this.width = "100%";
      }
      this.$nextTick(() => this.recaclulateIframeHeight());
    },
  };
}
