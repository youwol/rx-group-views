
const runTimeDependencies = {
    "externals": {
        "rxjs": "^7.5.6",
        "@youwol/rx-vdom": "^1.0.1"
    },
    "includedInBundle": {}
}
const externals = {
    "rxjs": {
        "commonjs": "rxjs",
        "commonjs2": "rxjs",
        "root": "rxjs_APIv7"
    },
    "@youwol/rx-vdom": {
        "commonjs": "@youwol/rx-vdom",
        "commonjs2": "@youwol/rx-vdom",
        "root": "@youwol/rx-vdom_APIv1"
    },
    "rxjs/operators": {
        "commonjs": "rxjs/operators",
        "commonjs2": "rxjs/operators",
        "root": [
            "rxjs_APIv7",
            "operators"
        ]
    }
}
const exportedSymbols = {
    "rxjs": {
        "apiKey": "7",
        "exportedSymbol": "rxjs"
    },
    "@youwol/rx-vdom": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/rx-vdom"
    }
}

const mainEntry : {entryFile: string,loadDependencies:string[]} = {
    "entryFile": "index.ts",
    "loadDependencies": [
        "rxjs",
        "@youwol/rx-vdom"
    ]
}

const secondaryEntries : {[k:string]:{entryFile: string, name: string, loadDependencies:string[]}}= {}

const entries = {
     '@youwol/rx-group-views': 'index.ts',
    ...Object.values(secondaryEntries).reduce( (acc,e) => ({...acc, [`@youwol/rx-group-views/${e.name}`]:e.entryFile}), {})
}
export const setup = {
    name:'@youwol/rx-group-views',
        assetId:'QHlvdXdvbC9yeC1ncm91cC12aWV3cw==',
    version:'0.3.0',
    shortDescription:"Grouping widgets using flux-view",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/rx-group-views&tab=doc',
    npmPackage:'https://www.npmjs.com/package/@youwol/rx-group-views',
    sourceGithub:'https://github.com/youwol/rx-group-views',
    userGuide:'https://l.youwol.com/doc/@youwol/rx-group-views',
    apiVersion:'03',
    runTimeDependencies,
    externals,
    exportedSymbols,
    entries,
    secondaryEntries,
    getDependencySymbolExported: (module:string) => {
        return `${exportedSymbols[module].exportedSymbol}_APIv${exportedSymbols[module].apiKey}`
    },

    installMainModule: ({cdnClient, installParameters}:{
        cdnClient:{install:(unknown) => Promise<WindowOrWorkerGlobalScope>},
        installParameters?
    }) => {
        const parameters = installParameters || {}
        const scripts = parameters.scripts || []
        const modules = [
            ...(parameters.modules || []),
            ...mainEntry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/rx-group-views_APIv03`]
        })
    },
    installAuxiliaryModule: ({name, cdnClient, installParameters}:{
        name: string,
        cdnClient:{install:(unknown) => Promise<WindowOrWorkerGlobalScope>},
        installParameters?
    }) => {
        const entry = secondaryEntries[name]
        if(!entry){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        const parameters = installParameters || {}
        const scripts = [
            ...(parameters.scripts || []),
            `@youwol/rx-group-views#0.3.0~dist/@youwol/rx-group-views/${entry.name}.js`
        ]
        const modules = [
            ...(parameters.modules || []),
            ...entry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/rx-group-views/${entry.name}_APIv03`]
        })
    },
    getCdnDependencies(name?: string){
        if(name && !secondaryEntries[name]){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        const deps = name ? secondaryEntries[name].loadDependencies : mainEntry.loadDependencies

        return deps.map( d => `${d}#${runTimeDependencies.externals[d]}`)
    }
}
