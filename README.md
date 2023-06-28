# Image Label Component for Streamlit
This repository contains a Streamlit Custom Component developed with React. The component allows users to add labels and bounding boxes to images. It's particularly useful for projects related to Image Labeling and Object Detection.

The `image_label` package provides a custom Streamlit component for image annotation. It allows users to manually annotate images with bounding boxes and labels, making it a great tool for data labeling tasks, especially in machine learning projects.

![](assets/example.gif)

### Features
Streamlit Custom Component that annotates images with bounding boxes and labels.
Annotations can be added interactively using the React component in the Streamlit app.
Annotated images can be downloaded with bounding boxes and labels.

## Installation

You can install the `image_label` package from PyPI using pip:

```bash
pip install image_label
```

## Usage

To use the image_label_component in your Streamlit app, use the following example:

```python
from image_label import image_label_component,load_image,img_to_base64

#change format
image = load_image(imagePath)
image_str = img_to_base64(image)
labels=["label1","label2"]

#create component
image_label_component(key=key, image=image_str, labels=labels, detectedAnotations=detectedAnnotations)

```

### In the above example:

- `load_image(imagePath)` is used to load the image from a given path.
- `img_to_base64(image)` is used to convert the image to base64 format.
- `image_label_component`  is the main function that displays the annotation component in your Streamlit app and let user to downlaod and edit the annotations.
### Arguments for image_label_component

- `key` : A string that identifies the component in your app. Each component should have a unique key.
- `image` :The base64 representation of the image to annotate.
- `labels` : A list of strings representing the labels that can be assigned to each bounding box.
- `detectedAnotations` : A list of pre-existing annotations. This argument is optional and can be omitted if there are no pre-existing annotations. Each annotation in the list is a dictionary with the following structure:

```python
[
    {
      "geometry": {
          "type": "RECTANGLE",
          "x": 13.494318181818182,
          "y": 21.284080914687774,
          "width": 12.642045454545455,
          "height": 27.08883025505717
      },
      "data": {
          "text": "missing hole",
          "id": 0.3982473149726953
      }
    },
    {....},
    ....
]
```
> We will soon add function to convert yolo format to this format.
### In the above dictionary:

- `geometry ` describes the bounding box and its position. The x and y values are the coordinates of the top left corner of the bounding box, relative to the top left corner of the image, expressed as a percentage of the image's dimensions. The width and height values are also percentages of the image's dimensions.

- `data` contains additional information about the annotation. The text field is the label for the bounding box, and id is a unique identifier for the annotation.


## Contributing

 Contributions to this project are welcome! Please raise an issue on the project's GitHub page if you encounter any problems or have any suggestions for improvements.
### Building and developing the package from this repo 

```bash
cd image_label
cd frontend
nvm use 16
npm install
npm start
```
From image_label directory

> Inside __init__.py change RELEASE to False
```
```python
_RELEASE = False
```
then 
```bash
cd image_label
streamlit run __init__.py
```