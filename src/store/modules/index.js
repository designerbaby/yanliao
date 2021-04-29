const context = require.context('./', true, /\.js$/)
const filePaths = context.keys().filter(s => /^\.\/[^/]*\.js$/g.test(s) || /^\.\/.*\/index\.js$/g.test(s)).filter(s => s !== './index.js')

const modules = {}
filePaths.forEach(path => (modules[path.replace(/^\.\/([^/]*)(\/index)?\.js$/g, '$1')] = require(`${path}`).default))
Object.keys(modules).forEach(key => (modules[key].namespaced = true))

export default modules
