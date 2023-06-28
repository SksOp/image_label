import setuptools

setuptools.setup(
    name="image_label",
    version="2.4.2",
    author="sks",
    author_email="shubhaman47@gmail.com",
    description="This is an Image Labeling Component for streamlit",
    long_description="The image_label package provides a custom Streamlit component for image annotation. It allows users to manually annotate images with bounding boxes and labels, making it a great tool for data labeling tasks, especially in machine learning projects. for more info go to https://github.com/SksOp/image_label",
    long_description_content_type="text/plain",
    url="https://github.com/SksOp/image_label",
    packages=setuptools.find_packages(),
    include_package_data=True,
    classifiers=[],
    python_requires=">=3.6",
    install_requires=[
        # By definition, a Custom Component depends on Streamlit.
        # If your component has other Python dependencies, list
        # them here.
        "streamlit >= 0.63",
    ],
)
