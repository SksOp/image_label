import {
  // Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { Component } from "react"
import "./label-image.css"

import Annotation from "react-image-annotation"
import {
  renderHighlight,
  renderContent,
  renderEditor,
  DataDiv,
  ViewDataInTable,
  Preview,
} from "./utils/functions.jsx"

import expand from "./assets/expand.svg"
import shrink from "./assets/shrink.svg"

class MyComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      annotations: [...this.props?.detectedAnotations],
      annotation: {},
      showDiv: false,
      coords: { x: 0, y: 0 },
      isEditable: false,
      showLabels: true,
      isFullWidth: false,
      enablePreview: false,
      labelFontSize: 40,
      labnelLineWidth: 5,
    }
  }

  canvasRef = React.createRef()
  increaseLabelFontSize = () => {
    this.setState({ labelFontSize: this.state.labelFontSize + 5 })
  }
  decreaseLabelFontSize = () => {
    this.setState({ labelFontSize: this.state.labelFontSize - 5 })
  }
  increaseLabelLineWidth = () => {
    this.setState({ labnelLineWidth: this.state.labnelLineWidth + 4 })
  }
  decreaseLabelLineWidth = () => {
    this.setState({ labnelLineWidth: this.state.labnelLineWidth - 4 })
  }

  togglePreview = () => {
    this.setState({ enablePreview: !this.state.enablePreview })
  }
  toggleLabels = () => {
    this.setState({ showLabels: !this.state.showLabels })
  }
  enableEditing = () => {
    this.setState({ isEditable: !this.state.isEditable })
  }
  toggleFullWidth = () => {
    this.setState({ isFullWidth: !this.state.isFullWidth })
  }
  moveDiv = (e) => {
    this.setState({ coords: { x: e.clientX, y: e.clientY } })
  }

  onMouseMove = (e) => {
    this.setState({ showDiv: true })
    window.addEventListener("mousemove", this.moveDiv)
  }

  onMouseOut = (e) => {
    this.setState({ showDiv: false })
    window.removeEventListener("mousemove", this.moveDiv)
  }

  componentWillUnmount() {
    window.removeEventListener("mousemove", this.moveDiv)
  }

  renderImageToCanvas = (
    labelFontSize = this.state.labelFontSize,
    labnelLineWidth = this.state.labnelLineWidth
  ) => {
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
          context.lineWidth = labnelLineWidth
          context.strokeStyle = "red"

          context.stroke()
          context.fillStyle = "white"
          context.font = `bold ${labelFontSize}px Roboto` // Set the font size and font family
          context.fillText(
            text,
            px,
            py > labelFontSize ? py - labnelLineWidth : py + labelFontSize
          )

          context.fillStyle = "black"
          context.fillRect(
            px,
            (py > labelFontSize ? py - labnelLineWidth : py + labelFontSize) -
              labelFontSize -
              20,
            context.measureText(text).width + 20,
            labelFontSize + 20
          )

          context.fillStyle = "white"
          context.font = `bold ${labelFontSize}px Roboto` // Set the font size and font family
          context.fillText(
            text,
            px + 10,
            py > labelFontSize
              ? py - labnelLineWidth - 10
              : py + labelFontSize - 10
          )
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
  preview = async () => {
    await this.renderImageToCanvas()
    this.setState({ enablePreview: true })
  }

  render() {
    const imageSrc = "data:image/jpeg;base64," + this.props.image

    return (
      <>
        <div className="menu">
          {this.state.isEditable ? (
            <>
              <button onClick={this.toggleLabels}>
                {this.state.showLabels ? "Hide" : "Show"} Labels
              </button>

              <button onClick={this.downloadImage}>Download</button>
              <button onClick={this.togglePreview}>
                {this.state.enablePreview ? "Hide" : "Show"} Preview
              </button>
              <button onClick={this.toggleFullWidth}>
                {this.state.isFullWidth ? (
                  <img src={expand} alt="expnad" />
                ) : (
                  <img src={shrink} alt="shink" />
                )}
              </button>
            </>
          ) : (
            <>
              <button onClick={this.enableEditing}>Edit labels</button>
            </>
          )}
        </div>
        <div className="parent">
          <div
            className="hoverDiv image-editor"
            onMouseMove={this.onMouseMove}
            onMouseOut={this.onMouseOut}
            style={{
              maxWidth: this.state.isFullWidth ? "unset" : "900px",
            }}
          >
            <Annotation
              src={imageSrc}
              alt="pcb"
              annotations={this.state.annotations}
              type={this.state.type}
              value={this.state.annotation}
              onChange={this.onChange}
              onSubmit={this.onSubmit}
              disableEditor={!this.state.isEditable}
              disableAnnotation={!this.state.isEditable}
              disableSelector={!this.state.isEditable}
              disableOverlay={!this.state.isEditable}
              renderEditor={(props) => {
                //there are default props too as per the docs
                const labels = this.props.labels
                return renderEditor(props, labels)
              }}
              renderContent={renderContent}
              renderHighlight={({ annotation, active }) => {
                return renderHighlight({
                  annotation,
                  active,
                  showLabels: this.state.showLabels,
                  deleteAnnotation: this.deleteAnnotation,
                })
              }}
            />
          </div>
          <div className="dataViewer">
            <ViewDataInTable
              labels={this.props.labels}
              annotations={this.state.annotations}
            />
          </div>
        </div>

        <canvas ref={this.canvasRef} style={{ display: "none" }} />

        {this.state.enablePreview && (
          <Preview
            increaseLabelFontSize={this.increaseLabelFontSize}
            decreaseLabelFontSize={this.decreaseLabelFontSize}
            labelFontSize={this.state.labelFontSize}
            renderImageToCanvas={this.renderImageToCanvas}
            togglePreview={this.togglePreview}
            canvasRef={this.canvasRef}
            labnelLineWidth={this.state.labnelLineWidth}
            increaseLabelLineWidth={this.increaseLabelLineWidth}
            decreaseLabelLineWidth={this.decreaseLabelLineWidth}
          />
        )}
        {/* {this.state.showDiv && (
              <div
                className="hover-info"
                style={{
                  top: `${this.state.coords.y + 30}px`,
                  left: `${this.state.coords.x + 30}px`,
                }}
                // style={{
                //   top: `${50}px`,
                //   left: `${20}px`,
                // }}
              >
                <DataDiv
                  labels={this.props.labels}
                  annotations={this.state.annotations}
                />
              </div>
            )} */}
      </>
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
