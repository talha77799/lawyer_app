/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_ANDROID_APP_URL?: string
	readonly VITE_IOS_APP_URL?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

interface WindowEventMap {
	beforeinstallprompt: Event
}
