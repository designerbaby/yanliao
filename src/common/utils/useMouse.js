
// 注册鼠标事件
export const useMouse = (oBtn) => {
  window.addEventListener('mousemove', e => {
    const x = e.offsetX
    const y = e.offsetY
    console.log(`x:${x}, y:${y}`)
  })
  window.addEventListener('mouseup', e => {
    const x = e.offsetX
    const y = e.offsetY
    console.log(`x:${x}, y:${y}`)
  })
}
