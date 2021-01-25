import { VirtualDOM } from "@youwol/flux-view"
import { Subject } from "rxjs"

export namespace Modal {

    export class State {

        constructor(public readonly ok$: Subject<MouseEvent> = new Subject<MouseEvent>(),
                    public readonly cancel$: Subject<MouseEvent> = new Subject<MouseEvent>(),
                    public readonly signals:{[key:string]: Subject<MouseEvent>} = undefined) {
        }
    }


    export class View implements VirtualDOM {

        public readonly state: State
        
        static defaultStyle = {
            position:'absolute', 
            top:'0px', 
            left: '0px', 
            'z-index':100, 
            width:'100vw', 
            height:'100vh', 
            'background-color': 'rgba(0,0,0,0.5)'
        }
        static defaultClass  = 'd-flex justify-content-around'

        public readonly tag = 'div'
        public readonly class: string
        public readonly style: {[key:string]: any}

        public readonly onclick = (ev: MouseEvent) => this.state.cancel$.next(ev)

        public readonly children : [VirtualDOM]
        constructor( { state, contentView, ...rest } : { state: State, contentView: (State)=>VirtualDOM }) {

            Object.assign(this, rest)
            
            this.class = rest['class'] || rest['className'] || View.defaultClass
            this.style = rest['style'] || View.defaultStyle
            this.children = [
                {
                    class:'d-flex flex-columns justify-content-around mt-auto mb-auto',
                    children:[
                        contentView(state)
                    ],
                    onclick: (ev) => ev.stopPropagation()
                }
            ]
        }
    }
}