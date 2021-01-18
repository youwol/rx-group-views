
import { attr$, Stream$, child$, VirtualDOM } from '@youwol/flux-view'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'



export namespace ExpandableGroup {


    export class State {

        expanded$: BehaviorSubject<boolean>

        constructor(
            public readonly name: string,
            expanded$: BehaviorSubject<boolean> | boolean = false
        ) {

            this.expanded$ = (expanded$ instanceof BehaviorSubject)
                ? expanded$
                : new BehaviorSubject<boolean>(expanded$ as boolean)
        }
    }

    export let defaultHeaderClass = "fv-bg-background-alt fv-text-primary fv-color-primary rounded fv-pointer d-flex align-items-center"
    export let defaultBodyClass = "fv-bg-background fv-text-primary fv-color-primary rounded p-3"

    export function defaultHeaderView(state: State) {

        return {
            class: defaultHeaderClass,
            children: [
                {
                    tag: 'i',
                    class: attr$(state.expanded$,
                        d => d ? "fa-caret-down" : "fa-caret-right",
                        { wrapper: (d) => "px-2 fas " + d }
                    )
                },
                {   tag: 'span', class: 'px-2', innerText: state.name, 
                    style: { 'user-select': 'none'}
                }
            ]
        }
    }

    export function simpleExpandableGroup( name: string, contentView: VirtualDOM ) {

        return new ExpandableGroup.View(
            {   state: new ExpandableGroup.State(name),
                headerView: ExpandableGroup.defaultHeaderView,
                contentView: () => ({
                    class: defaultBodyClass,
                    children: [contentView]
                })
            }
        )
    }

    export class View implements VirtualDOM {

        static defaultClass = "d-flex flex-column "
        public readonly state: State

        public readonly className: string | Stream$<unknown, string>
        children: [VirtualDOM, VirtualDOM]

        constructor(
            { state,
                headerView,
                contentView,
                ...rest
            }: {
                state: State,
                headerView: (state: State) => VirtualDOM
                contentView: (state: State) => VirtualDOM
            }) {

            Object.assign(this, rest)
            this.state = state
            this.className = rest['className'] || View.defaultClass

            this.children = [
                {
                    children: [
                        headerView(this.state)
                    ],
                    onclick: () => this.state.expanded$.next(!this.state.expanded$.getValue())
                },
                child$( 
                    this.state.expanded$,
                    (expanded) => expanded ? contentView(this.state) : {}
                )
            ]


            /*
            this.data = state$.pipe( map( state => ({
                class: userClasses, style: userStyle,
                children: {
                    header: {
                        children: [headerView( state)],
                        onclick: () => state.expanded$.next(!state.expanded$.getValue())
                    },
                    contentContainer: {
                        class: "yw-tab-content border flex-grow-1 w-100 rounded",
                        style:{'min-height':'0px'},
                        children: {
                            content: state.expanded$.pipe(
                                map( expanded  =>{
                                    return expanded ? contentView(state) : {}
                                })
                            )
                        }
                    }                    
                }
            })))*/
        }

    }
}
