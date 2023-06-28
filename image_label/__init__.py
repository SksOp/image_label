import os
import streamlit.components.v1 as components
from PIL import Image
import io
import base64

# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
# (This is, of course, optional - there are innumerable ways to manage your
# release process.)
_RELEASE = True

# Declare a Streamlit component. `declare_component` returns a function
# that is used to create instances of the component. We're naming this
# function "_component_func", with an underscore prefix, because we don't want
# to expose it directly to users. Instead, we will create a custom wrapper
# function, below, that will serve as our component's public API.

# It's worth noting that this call to `declare_component` is the
# *only thing* you need to do to create the binding between Streamlit and
# your component frontend. Everything else we do in this file is simply a
# best practice.

if not _RELEASE:
    _component_func = components.declare_component(
        # We give the component a simple, descriptive name ("my_component"
        # does not fit this bill, so please choose something better for your
        # own component :)
        "image_label",
        # Pass `url` here to tell Streamlit that the component will be served
        # by the local dev server that you run via `npm run start`.
        # (This is useful while your component is in development.)
        url="http://localhost:3001",
    )
else:
    # When we're distributing a production version of the component, we'll
    # replace the `url` param with `path`, and point it to to the component's
    # build directory:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    image_label_component = components.declare_component("image_label", path=build_dir)


# Create a wrapper function for the component. This is an optional
# best practice - we could simply expose the component function returned by
# `declare_component` and call it done. The wrapper allows us to customize
# our component's API: we can pre-process its input args, post-process its
# output value, and add a docstring for users.

def load_image(image_path):
    image = Image.open(image_path)
    return image

def img_to_base64(img):
    imgio = io.BytesIO()
    img.save(imgio, format=img.format)
    img_str = base64.b64encode(imgio.getvalue())
    return img_str.decode('utf-8')

def image_label(image,labels,detectedAnotations=[] ,key=None):
    # declare the component
    component_value = st.components.v1.declare_component("image_label", url="http://localhost:3001")

    # Call the component and pass in its arguments.
    response = component_value(image=image,labels=labels,detectedAnotations=detectedAnotations, key=key)

    return response



# def my_component(name, key=None):
#     """Create a new instance of "my_component".

#     Parameters
#     ----------
#     name: str
#         The name of the thing we're saying hello to. The component will display
#         the text "Hello, {name}!"
#     key: str or None
#         An optional key that uniquely identifies this component. If this is
#         None, and the component's arguments are changed, the component will
#         be re-mounted in the Streamlit frontend and lose its current state.

#     Returns
#     -------
#     int
#         The number of times the component's "Click Me" button has been clicked.
#         (This is the value passed to `Streamlit.setComponentValue` on the
#         frontend.)

#     """
#     # Call through to our private component function. Arguments we pass here
#     # will be sent to the frontend, where they'll be available in an "args"
#     # dictionary.
#     #
#     # "default" is a special argument that specifies the initial return
#     # value of the component before the user has interacted with it.
#     component_value = _component_func(name=name, key=key, default=0)

#     # We could modify the value returned from the component if we wanted.
#     # There's no need to do this in our simple example - but it's an option.
#     return component_value


# Add some test code to play with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run my_component/__init__.py`
if not _RELEASE:
    import streamlit as st

    st.subheader("Create label")

    image = load_image("1.jpg")
    image_str = img_to_base64(image)

    # button = st.button("add label")

    labels = ["label1", "label2", "label3"]
    # if button:
    labels_in_yolo_format = image_label(image=image_str,labels=labels,detectedAnotations=[] ,key="foo")
    st.write(labels_in_yolo_format)
    print(labels_in_yolo_format)

    # Create an instance of our component with a constant `name` arg, and
    # print its output value.
    # num_clicks = my_component("World")
    # st.markdown("You've clicked %s times!" % int(num_clicks))

    # st.markdown("---")
    # st.subheader("Component with variable args")

    # # Create a second instance of our component whose `name` arg will vary
    # # based on a text_input widget.
    # #
    # # We use the special "key" argument to assign a fixed identity to this
    # # component instance. By default, when a component's arguments change,
    # # it is considered a new instance and will be re-mounted on the frontend
    # # and lose its current state. In this case, we want to vary the component's
    # # "name" argument without having it get recreated.
    # name_input = st.text_input("Enter a name", value="Streamlit")
    # num_clicks = my_component(name_input, key="foo")
    # st.markdown("You've clicked %s times!" % int(num_clicks))
