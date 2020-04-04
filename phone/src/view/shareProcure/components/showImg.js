const showImg = function(that, val) {
    const viewer = that.$el.querySelector('.' + val).$viewer
    viewer.show()
}
export default showImg
