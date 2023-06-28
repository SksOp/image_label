import setuptools

setuptools.setup(
    name="image_label",
    version="2.3.88",
    author="sks",
    author_email="shubhaman47@gmail.com",
    description="This is an Image Labeling Component for streamlit",
    long_description="Please go throught the readme file for more details",
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
