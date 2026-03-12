/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

declare const __BUILD_VERSION__: string

declare module '*.css' {
  const content: string
  export default content
}
