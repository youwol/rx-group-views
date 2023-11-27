import {
    VirtualDOM,
    AnyVirtualDOM,
    AttributeLike,
    ChildrenLike,
} from '@youwol/rx-vdom'
import { BehaviorSubject } from 'rxjs'

export namespace ExpandableGroup {
    export class State {
        expanded$: BehaviorSubject<boolean>

        constructor(
            public readonly name: string,
            expanded$: BehaviorSubject<boolean> | boolean = false,
        ) {
            this.expanded$ =
                expanded$ instanceof BehaviorSubject
                    ? expanded$
                    : new BehaviorSubject<boolean>(expanded$)
        }
    }

    export const defaultHeaderClass =
        'fv-bg-background-alt fv-text-primary fv-color-primary rounded fv-pointer d-flex align-items-center'
    export const defaultBodyClass =
        'fv-bg-background fv-text-primary fv-color-primary rounded p-3'

    export function defaultHeaderView(state: State): VirtualDOM<'div'> {
        return {
            tag: 'div',
            class: defaultHeaderClass,
            children: [
                {
                    tag: 'i',
                    class: {
                        source$: state.expanded$,
                        vdomMap: (d): string =>
                            d ? 'fa-caret-down' : 'fa-caret-right',
                        wrapper: (d) => 'px-2 fas ' + d,
                    },
                },
                {
                    tag: 'span',
                    class: 'px-2',
                    innerText: state.name,
                    style: { userSelect: 'none' },
                },
            ],
        }
    }

    export function simpleExpandableGroup(
        name: string,
        contentView: AnyVirtualDOM,
    ) {
        return new ExpandableGroup.View({
            state: new ExpandableGroup.State(name),
            headerView: ExpandableGroup.defaultHeaderView,
            contentView: () => ({
                tag: 'div',
                class: defaultBodyClass,
                children: [contentView],
            }),
        })
    }

    export class View implements VirtualDOM<'div'> {
        static defaultClass = 'd-flex flex-column '

        public readonly tag = 'div'
        public readonly state: State

        public readonly className: AttributeLike<string>
        children: ChildrenLike

        constructor({
            state,
            headerView,
            contentView,
            ...rest
        }: {
            state: State
            headerView: (state: State) => AnyVirtualDOM
            contentView: (state: State) => AnyVirtualDOM
            [_key: string]: unknown
        }) {
            Object.assign(this, { class: View.defaultClass }, rest)

            this.state = state

            this.children = [
                {
                    tag: 'div',
                    children: [headerView(this.state)],
                    onclick: () =>
                        this.state.expanded$.next(
                            !this.state.expanded$.getValue(),
                        ),
                },
                {
                    source$: this.state.expanded$,
                    vdomMap: (expanded) =>
                        expanded ? contentView(this.state) : { tag: 'div' },
                },
            ]
        }
    }
}
