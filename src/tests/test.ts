import { render } from '@youwol/rx-vdom'
import { ExpandableGroup } from '../index'

test('simple expandable group', () => {
    const vDOM = ExpandableGroup.simpleExpandableGroup('Example', {
        tag: 'div',
        id: 'content',
        innerText: 'Hello expandable group!',
    })
    const div = render(vDOM)
    document.body.appendChild(div)
    const title = document.querySelector('span')
    expect(title).toBeTruthy()
    let content = document.getElementById('content')
    expect(content).toBeFalsy()
    title.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    content = document.getElementById('content')
    expect(content).toBeTruthy()
    expect(content.innerText).toEqual('Hello expandable group!')
})
