
const runTimeDependencies = {
    "load": {
        "rxjs": "^6.5.5",
        "@youwol/flux-view": "^1.0.3"
    },
    "differed": {},
    "includedInBundle": []
}
const externals = {
    "rxjs": {
        "commonjs": "rxjs",
        "commonjs2": "rxjs",
        "root": "rxjs_APIv6"
    },
    "@youwol/flux-view": {
        "commonjs": "@youwol/flux-view",
        "commonjs2": "@youwol/flux-view",
        "root": "@youwol/flux-view_APIv1"
    }
}
const exportedSymbols = {
    "rxjs": {
        "apiKey": "6",
        "exportedSymbol": "rxjs"
    },
    "@youwol/flux-view": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/flux-view"
    }
}
export const setup = {
    name:'@youwol/fv-group',
        assetId:'QHlvdXdvbC9mdi1ncm91cA==',
    version:'0.2.1',
    shortDescription:"Grouping widgets using flux-view",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/fv-group',
    npmPackage:'https://www.npmjs.com/package/@youwol/fv-group',
    sourceGithub:'https://github.com/youwol/fv-group',
    userGuide:'https://l.youwol.com/doc/@youwol/fv-group',
    apiVersion:'02',
    runTimeDependencies,
    externals,
    exportedSymbols,
    getDependencySymbolExported: (module:string) => {
        return `${exportedSymbols[module].exportedSymbol}_APIv${exportedSymbols[module].apiKey}`
    }
}
