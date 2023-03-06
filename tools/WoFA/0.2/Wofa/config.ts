const config = {
    typeName: "WoFA",
    viewComponentImport: async () => (await import("./WofaView.svelte")).default,
    editComponentImport: async () => (await import("./WofaEditor.svelte")).default,
}

export default config;
