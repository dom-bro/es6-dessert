export const requiredSlidePopupStyle = `
.es6Dessert-SlidePopup{
  position: fixed !important;
  top: auto !important;
  bottom: 0 !important;
  width: 100%;
  margin-bottom: 0 !important;
  -webkit-transform: translate3d(0,100%,0);
  transform: translate3d(0,100%,0);
  -webkit-transition-property: -webkit-transform;
  transition-property: -webkit-transform;
  -o-transition-property: transform;
  transition-property: transform,-webkit-transform;
}`

export const requiredFloorStyle = `
.es6Dessert-Floor-container{
  position: relative !important;
  overflow: hidden !important;
}
.es6Dessert-Floor-wrapper{
  overflow: auto !important;
}
`
