const Box = ({ children, geometry, style }) => (
  <div
    style={{
      ...style,
      position: "absolute",
      left: `${geometry.x}%`,
      top: `${geometry.y}%`,
      height: `${geometry.height}%`,
      width: `${geometry.width}%`,
    }}
  >
    {children}
  </div>
)
export default Box
