export class SDK {
    static instance;
    static gameClass;

    static setGameClass(gameClass) {
        SDK.gameClass = gameClass;
    }

    constructor() {
        if (SDK.instance) return SDK.instance;
        SDK.instance = this;

        this.gameInstance = null;
        this.isVisible = false;
        this.destinationUrl = /android/i.test(navigator.userAgent) ? GOOGLE_PLAY_URL : APP_STORE_URL;

        this.boot();
    }

    boot() {
        if (typeof mraid !== 'undefined') {
            this.handleMraidInit();
        } else {
            this.handleFallbackVisibility();
        }
    }

    handleMraidInit() {
        if (mraid.getState() === 'loading') {
            mraid.addEventListener('ready', this.onMraidReady.bind(this));
        } else {
            this.onMraidReady();
        }
    }

    onMraidReady() {
        mraid.addEventListener('viewableChange', this.handleVisibilityChange.bind(this));
        this.handleVisibilityChange(mraid.isViewable());

        // Initial visibility check
        if (mraid.isViewable()) {
            this.showAd();
        }
    }

    handleFallbackVisibility() {
        // Fallback for non-MRAID environments
        this.isVisible = true;
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange(!document.hidden);
        });
        this.showAd();
    }

    handleVisibilityChange(isVisible) {
        if (this.isVisible === isVisible) return;
        this.isVisible = isVisible;

        if (this.gameInstance) {
            isVisible ? this.gameInstance.resume() : this.gameInstance.pause();
        }

        if (isVisible && !this.gameInstance) {
            this.showAd();
        }
    }

    showAd() {
        if (!this.gameInstance && SDK.gameClass) {
            this.gameInstance = new SDK.gameClass(window.innerWidth, window.innerHeight);
        }
    }

    openStore() {
        if (window.mraid) {
            window.mraid.open(this.destinationUrl);
        } else {
            window.open(this.destinationUrl, '_blank');
        }
    }
}
