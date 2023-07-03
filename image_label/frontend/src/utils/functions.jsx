import React, { useState, useEffect } from "react"
import Box from "./Box"
import "../label-image.css"

export const renderHighlight = ({
  annotation,
  active,
  deleteAnnotation,
  showLabels,
}) => {
  const { geometry } = annotation
  const { data } = annotation
  if (!geometry) return null
  return (
    <>
      <Box
        key={annotation.data.id}
        geometry={geometry}
        style={{
          border: `solid 3px ${active ? "#3e8e41" : "red"}`,
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
        {showLabels && (
          <p className="label-text-for-all">{data && data.text}</p>
        )}
      </Box>
    </>
  )
}

export const renderContent = ({ annotation }) => {
  const { geometry } = annotation
  return (
    <Box
      key={annotation.data.id}
      geometry={geometry}
      style={{
        border: `solid 3px white`,
        // boxShadow: active && "0 0 20px 20px rgba(255, 255, 255, 0.3) inset",
      }}
    >
      <p className="label-text-for-all">
        {annotation.data && annotation.data.text}
      </p>
    </Box>
  )
}
export const renderEditor = (props, labels) => {
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

export const DataDiv = ({ annotations, labels }) => {
  // we will create a table here
  const [data, setData] = useState({})

  useEffect(() => {
    const tempData = {}
    labels.forEach((label) => {
      tempData[label] = 0
    })
    annotations.forEach((annotation) => {
      const { data } = annotation
      const { text } = data
      const frquency = tempData[text] ? tempData[text] + 1 : 1
      tempData[text] = frquency
    })
    setData(tempData)
    console.log({ tempData })
  }, [annotations])
  return (
    <>
      <div className="dataHolder">
        {Object.keys(data).map((key) => {
          return (
            <div className="dataItem" key={key}>
              <div className="dataItemLabel">{key}</div>
              <div className="dataItemValue">{data[key]}</div>
            </div>
          )
        })}
      </div>
    </>
  )
}

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

export const ViewDataInTable = ({ labels, annotations }) => {
  const [data, setData] = useState({})

  useEffect(() => {
    const tempData = {}
    labels.forEach((label) => {
      tempData[label] = 0
    })
    annotations.forEach((annotation) => {
      const { data } = annotation
      const { text } = data
      const frquency = tempData[text] ? tempData[text] + 1 : 1
      tempData[text] = frquency
    })
    setData(tempData)
    console.log({ tempData })
  }, [annotations])
  return (
    <>
      <div className="dataHolder">
        <div className="dataItem">
          <div className="dataItemSno">Sn.</div>
          <div className="dataItemLabel">Lables</div>
          <div className="dataItemValue">Fq.</div>
        </div>

        {Object.keys(data).map((key, index) => {
          return (
            <div className="dataItem" key={key}>
              <div className="dataItemSno">{index + 1}</div>
              <div className="dataItemLabel">{key}</div>
              <div className="dataItemValue">{data[key]}</div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export const Preview = (props) => {
  const {
    increaseLabelFontSize,
    decreaseLabelFontSize,
    labelFontSize,
    renderImageToCanvas,
    togglePreview,
    canvasRef,
    preview,
    labnelLineWidth,
    increaseLabelLineWidth,
    decreaseLabelLineWidth,
  } = props

  const [dataUrl, setdataUrl] = useState(null)
  const rerender = async () => {
    await renderImageToCanvas(labelFontSize, labnelLineWidth)
    const dataUrl = canvasRef.current?.toDataURL()
    setdataUrl(dataUrl)
  }

  useEffect(() => {
    rerender()
  }, [labelFontSize, labnelLineWidth])

  //   useEffect(() => {
  //     const dataUrl = canvasRef.current?.toDataURL()
  //     setdataUrl(dataUrl)
  //   }, [canvasRef])
  return (
    <div className="previewHolder">
      <div className="menu">
        <button className="" onClick={togglePreview}>
          Close
        </button>
        <button style={{ backgroundColor: "grey" }}>Font Size</button>
        <button className="" onClick={increaseLabelFontSize}>
          +
        </button>
        <button className="" onClick={decreaseLabelFontSize}>
          -
        </button>
        <button style={{ backgroundColor: "grey" }}>Line Width</button>

        <button className="" onClick={increaseLabelLineWidth}>
          +
        </button>
        <button className="" onClick={decreaseLabelLineWidth}>
          -
        </button>
      </div>
      {!dataUrl && <p>Loading please wait ...</p>}
      {dataUrl && <img src={dataUrl} alt="preview" />}
    </div>
  )
}
