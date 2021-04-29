/**
 * 自定义滚动条组件
 * 用法：用组件包住滚动区域
 * 纵向滚动：scrollbar-wrap设置max-height
 * 横向滚动：scrollbar-view设置width
 * @param {Boolean} native 是否用原生滚动，默认是false
 * @param {Boolean} horizontal 是否只用横向滚动，默认是false
 * @param {Object} wrapStyle 容器样式
 * @param {String} wrapClass 自定义容器class
 * @param {String} viewClass 自定义滚动区域class
 * @param {Object} viewStyle 滚动区域样式
 * @param {Boolean} noresize 是否取消容器resize改变时自动计算滚动条长度，默认是false
 * @param {String} tag 容器标签，默认'div'
 */
import Scrollbar from './src/main'
import './index.less'

export default Scrollbar
