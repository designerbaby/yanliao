import History from './history'
import Shortcut from './shortcuts'
import DiffPitches from './diffPitches'
/**
 * 通过组件名称找到组件实例，目前只能找一个，如果同一个组件有多个地方使用就会找到第一个
 * @param {*} componentName
 */
const findVueComponentByName = (vm, name) => {
  if (vm.$options.name === name) {
    return vm
  }

  for(let i = 0; i < vm.$children.length; i += 1) {
    const child = vm.$children[i]
    if (child.$options.name === name) {
      return child
    }
    if (child.$children.length) {
      const value = findVueComponentByName(child, name)
      if (value) {
        return value
      }
    }
  }
  return null
}

class Editor {
  vm = null
  store = null
  history = null
  shortcut = null
  diffPitches = null

  constructor() {
    console.log(`Init editor`)
    this.history = new History(this)
    this.shortcut = new Shortcut(this)
    this.diffPitches = new DiffPitches(this)
  }

  static getInstance(vm) {
    if (!this.instance) {
      this.instance = new Editor()
    }
    return this.instance
  }

  setVm(vm) {
    this.vm = vm
    return this
  }
  setStore(store) {
    this.store = store
    return this
  }

  findVueComponentByName(componentName) {
    return findVueComponentByName(this.vm, componentName)
  }

  execute ( cmd ) {
		this.history.execute( cmd )
	}

	undo () {
		this.history.undo()
	}

	redo () {
		this.history.redo()
  }
}

export default Editor
