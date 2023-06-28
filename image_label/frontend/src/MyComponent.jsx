import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { Component } from "react"
import "./label-image.css"

// import Button from "./Button"

// /**
//  * This is a React-based component template. The `render()` function is called
//  * automatically when your component should be re-rendered.
//  */
// class MyComponent extends StreamlitComponentBase {
//   state = { numClicks: 0, isFocused: false }

//   render = () => {
//     // Arguments that are passed to the plugin in Python are accessible
//     // via `this.props.args`. Here, we access the "name" arg.
//     const name = this.props.args["name"]

//     // Streamlit sends us a theme object via props that we can use to ensure
//     // that our component has visuals that match the active theme in a
//     // streamlit app.
//     const { theme } = this.props
//     const style = {}

//     // Maintain compatibility with older versions of Streamlit that don't send
//     // a theme object.
//     if (theme) {
//       // Use the theme object to style our button border. Alternatively, the
//       // theme style is defined in CSS vars.
//       const borderStyling = `1px solid ${
//         this.state.isFocused ? theme.primaryColor : "gray"
//       }`
//       style.border = borderStyling
//       style.outline = borderStyling
//     }

//     // Show a button and some text.
//     // When the button is clicked, we'll increment our "numClicks" state
//     // variable, and send its new value back to Streamlit, where it'll
//     // be available to the Python program.
//     return (
//       <span>
//         Hello, {name}! &nbsp;
//         <button
//           style={style}
//           onClick={this.onClicked}
//           disabled={this.props.disabled}
//           onFocus={this._onFocus}
//           onBlur={this._onBlur}
//         >
//           Click Me!
//         </button>
//       </span>
//     )
//   }

//   /** Click handler for our "Click Me!" button. */
//   onClicked = () => {
//     // Increment state.numClicks, and pass the new value back to
//     // Streamlit via `Streamlit.setComponentValue`.
//     this.setState(
//       (prevState) => ({ numClicks: prevState.numClicks + 1 }),
//       () => Streamlit.setComponentValue(this.state.numClicks)
//     )
//   }

//   /** Focus handler for our "Click Me!" button. */
//   _onFocus = () => {
//     this.setState({ isFocused: true })
//   }

//   /** Blur handler for our "Click Me!" button. */
//   _onBlur = () => {
//     this.setState({ isFocused: false })
//   }
// }

// // "withStreamlitConnection" is a wrapper function. It bootstraps the
// // connection between your component and the Streamlit app, and handles
// // passing arguments from Python -> Component.
// //
// // You don't need to edit withStreamlitConnection (but you're welcome to!).
// export default withStreamlitConnection(MyComponent)
// import {
//   Streamlit,
//   StreamlitComponentBase,
//   withStreamlitConnection,
// } from "streamlit-component-lib"
// import React from "react"

// class MyComponent extends StreamlitComponentBase {
//   state = { numClicks: 0, isFocused: false }

//   render = () => {
//     const props = this.props
//     const { image, labels } = props.args
//     console.log({ labels })
//     // prepend the proper prefix for base64 encoded jpeg images
//     const imageSrc = "data:image/jpeg;base64," + image
//     console.log(props)
//     return (
//       <div>
//         <img src={imageSrc} alt="My custom component image" width="100%" />
//       </div>
//     )
//   }
// }

// export default withStreamlitConnection(MyComponent)
import Annotation from "react-image-annotation"

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

function renderHighlight({ annotation, active, deleteAnnotation }) {
  const { geometry } = annotation
  if (!geometry) return null
  return (
    <Box
      key={annotation.data.id}
      geometry={geometry}
      style={{
        border: `solid 1px ${active ? "#3e8e41" : generateRandomHexCode()}`,
        // boxShadow: active && "0 0 20px 20px rgba(255, 255, 255, 0.3) inset",
      }}
    >
      {active && (
        <button
          className="deleteAnnotationButton"
          onClick={() => {
            console.log("delete")
            deleteAnnotation(annotation.data.id)
          }}
        >
          X
        </button>
      )}
    </Box>
  )
}

function renderContent({ annotation }) {
  const { geometry } = annotation
  return (
    <div
      key={annotation.data.id}
      style={{
        background: "black",
        color: "white",
        padding: 10,
        position: "absolute",
        fontSize: 12,
        left: `${geometry.x}%`,
        top: `${geometry.y + geometry.height}%`,
      }}
    >
      {annotation.data && annotation.data.text}
    </div>
  )
}
function renderEditor(props, labels) {
  const { geometry } = props.annotation
  if (!geometry) return null
  return (
    <div
      className="holder"
      style={{
        background: "rgba(0, 0, 0, 0.15)",
        left: `${geometry.x > 80 ? 75 : geometry.x}%`,
        top: `${geometry.y > 85 ? 85 : geometry.y}%`,
      }}
    >
      <select
        className="selectItem"
        onChange={(e) => {
          props.onChange({
            ...props.annotation,
            data: {
              ...props.annotation.data,
              text: e.target.value,
            },
          })
        }}
      >
        <option value="">Select...</option>
        {labels.map((label) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
      </select>
      <button className="addLabelButton" onClick={props.onSubmit}>
        Add
      </button>
    </div>
  )
}

class MyComponent extends Component {
  // state = {
  //   annotations: [],
  //   annotation: {},
  // }

  constructor(props) {
    super(props)
    this.state = {
      annotations: [...this.props?.detectedAnotations],
      annotation: {},
    }
  }
  canvasRef = React.createRef()

  renderImageToCanvas = () => {
    return new Promise((resolve) => {
      const canvas = this.canvasRef.current
      const context = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        context.drawImage(img, 0, 0, img.width, img.height)

        this.state.annotations.forEach((annotation) => {
          const { geometry, data } = annotation
          const { x, y, width, height } = geometry
          const { text } = data

          const [px, py, pwidth, pheight] = [
            (x / 100) * img.width,
            (y / 100) * img.height,
            (width / 100) * img.width,
            (height / 100) * img.height,
          ]

          context.beginPath()
          context.rect(px, py, pwidth, pheight)
          context.lineWidth = 3
          context.strokeStyle = "red"
          context.fillStyle = "red"
          context.stroke()
          context.font = "40px Arial" // Set the font size and font family
          context.fillText(text, px, py > 15 ? py - 5 : py + 15)
        })

        // Resolve the Promise after the image has loaded and drawn
        resolve()
      }

      img.src = "data:image/jpeg;base64," + this.props.image
    })
  }

  onChange = (annotation) => {
    this.setState({ annotation })
  }

  onSubmit = (annotation) => {
    const { geometry, data } = annotation

    this.setState({
      annotation: {},
      annotations: this.state.annotations.concat({
        geometry,
        data: {
          ...data,
          id: Math.random(),
        },
      }),
    })
  }
  onChangeType = (e) => {
    this.setState({
      annotation: {},
      type: e.currentTarget.innerHTML,
    })
  }
  deleteAnnotation = (id) => {
    this.setState({
      annotations: this.state.annotations.filter((annotation) => {
        return annotation.data.id !== id
      }),
    })
  }
  downloadImage = async () => {
    // First, render the image to the canvas
    await this.renderImageToCanvas()

    // Then, create a data URL of the canvas content
    const dataUrl = this.canvasRef.current?.toDataURL()

    // Create a new 'a' element
    const link = document.createElement("a")
    link.href = dataUrl

    // Set the download attribute with the desired file name
    link.download = "image.png"

    // Trigger a click on the link to start the download
    link.click()
  }
  render() {
    const imageSrc = "data:image/jpeg;base64," + this.props.image

    return (
      <div>
        <Annotation
          src={imageSrc}
          alt="pcb"
          annotations={this.state.annotations}
          type={this.state.type}
          value={this.state.annotation}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          renderEditor={(props) => {
            const labels = this.props.labels
            return renderEditor(props, labels)
          }}
          renderContent={renderContent}
          renderHighlight={({ annotation, active }) => {
            return renderHighlight({
              annotation,
              active,
              deleteAnnotation: this.deleteAnnotation,
            })
          }}
        />
        <button className="downloadButton" onClick={this.downloadImage}>
          Download
        </button>

        <canvas ref={this.canvasRef} style={{ display: "none" }} />
      </div>
    )
  }
}

class App extends StreamlitComponentBase {
  render() {
    const { image, labels, detectedAnotations } = this.props.args

    return (
      <MyComponent
        image={image}
        labels={labels}
        detectedAnotations={detectedAnotations}
      />
    )
  }
}

export default withStreamlitConnection(App)

function generateRandomHexCode() {
  let hexCode = "#"

  // Generate a random hex color code
  for (let i = 0; i < 6; i++) {
    // Generate a random number between 0 and 15, convert to hex
    let hexSegment = Math.floor(Math.random() * 16).toString(16)

    // Add the segment to the hex code
    hexCode += hexSegment
  }

  return hexCode
}

// {
//   "annotations": [
//       {
//           "geometry": {
//               "type": "RECTANGLE",
//               "x": 13.494318181818182,
//               "y": 21.284080914687774,
//               "width": 12.642045454545455,
//               "height": 27.08883025505717
//           },
//           "data": {
//               "text": "new",
//               "id": 0.3982473149726953
//           }
//       }
//   ],
//   "annotation": {}
// }

// {
//   "annotations": [],
//   "annotation": {
//       "selection": {
//           "mode": "EDITING",
//           "anchorX": 16.90340909090909,
//           "anchorY": 29.37554969217238,
//           "showEditor": true
//       },
//       "geometry": {
//           "type": "RECTANGLE",
//           "x": 16.90340909090909,
//           "y": 29.37554969217238,
//           "width": 9.65909090909091,
//           "height": 5.980650835532106
//       },
//       "data": {
//           "text": "option1"
//       }
//   }
// }

// {
//   "annotations": [],
//   "annotation": {
//       "selection": {
//           "mode": "EDITING",
//           "anchorX": 17.1875,
//           "anchorY": 29.551451187335093,
//           "showEditor": true
//       },
//       "geometry": {
//           "type": "RECTANGLE",
//           "x": 17.1875,
//           "y": 29.551451187335093,
//           "width": 9.65909090909091,
//           "height": 5.980650835532099
//       },
//       "data": {
//           "text": "option1"
//       }
//   }
// }

// {
//   "annotations": [
//       {
//           "geometry": {
//               "type": "RECTANGLE",
//               "x": 1.4204545454545454,
//               "y": 1.58311345646438,
//               "width": 49.85795454545455,
//               "height": 50.131926121372025
//           },
//           "data": {
//               "text": "option1",
//               "id": 0.42675792821517256
//           }
//       },
//       {
//           "geometry": {
//               "type": "RECTANGLE",
//               "x": 51.42045454545454,
//               "y": 49.780123131046615,
//               "width": 48.295454545454554,
//               "height": 49.42832014072119
//           },
//           "data": {
//               "text": "option2",
//               "id": 0.1293396936727722
//           }
//       }
//   ],
//   "annotation": {
//       "selection": {
//           "mode": "EDITING",
//           "anchorX": 98.7215909090909,
//           "anchorY": 1.2313104661389622,
//           "showEditor": true
//       },
//       "geometry": {
//           "type": "RECTANGLE",
//           "x": 51.42045454545454,
//           "y": 1.2313104661389622,
//           "width": 47.30113636363637,
//           "height": 48.37291116974494
//       },
//       "data": {
//           "text": "option3"
//       }
//   }
// }
