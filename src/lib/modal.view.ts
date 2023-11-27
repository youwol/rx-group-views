import { AnyVirtualDOM, ChildrenLike, VirtualDOM } from '@youwol/rx-vdom'
import { merge, Subject } from 'rxjs'
import { take } from 'rxjs/operators'

export namespace Modal {
    export class State {
        constructor(
            public readonly ok$: Subject<MouseEvent> = new Subject<MouseEvent>(),
            public readonly cancel$: Subject<
                MouseEvent | KeyboardEvent
            > = new Subject<MouseEvent | KeyboardEvent>(),
            public readonly signals: {
                [key: string]: Subject<MouseEvent>
            } = undefined,
        ) {}
    }

    export class View implements VirtualDOM<'div'> {
        public readonly state: State

        static defaultStyle = {
            position: 'absolute',
            top: '0px',
            left: '0px',
            zIndex: '100',
            width: '100vw',
            height: '100vh',
            backdropFilter: 'blur(2px)',
            backgroundColor: 'rgba(220,159,53,5%)',
        }
        static defaultClass = 'd-flex justify-content-around'

        public readonly tag = 'div'
        public readonly class: string
        public readonly style: { [key: string]: string }

        public readonly onclick: (ev: MouseEvent) => void

        public readonly children: ChildrenLike

        constructor({
            state,
            contentView,
            ...rest
        }: {
            state: State
            contentView: (State) => AnyVirtualDOM
            [_key: string]: unknown
        }) {
            Object.assign(this, rest)
            this.state = state
            const originalOnKeyDown = document.onkeydown
            merge(this.state.cancel$, this.state.ok$)
                .pipe(take(1))
                .subscribe(() => {
                    document.onkeydown = originalOnKeyDown
                })
            document.onkeydown = (ev: KeyboardEvent) => {
                if (ev.key == 'Escape') {
                    this.state.cancel$.next(ev)
                }
            }
            this.class =
                (rest['class'] as string) ||
                (rest['className'] as string) ||
                View.defaultClass
            this.style =
                (rest['style'] as { [key: string]: string }) ||
                View.defaultStyle
            const view = contentView(state)
            this.children = [
                {
                    tag: 'div',
                    class: 'd-flex flex-columns justify-content-around mt-auto mb-auto',
                    children: [view],
                },
            ]
            this.onclick = (
                ev: MouseEvent & { target: { vDom?: AnyVirtualDOM } },
            ) => {
                if (ev.target.vDom && ev.target.vDom == this) {
                    this.state.cancel$.next(ev)
                }
            }
        }
    }
}
