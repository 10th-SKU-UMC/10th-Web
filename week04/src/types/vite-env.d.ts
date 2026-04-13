/// <reference types="vite/client" />>
interface ImportMetaEnv {
    readonly VITE_THDB_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}