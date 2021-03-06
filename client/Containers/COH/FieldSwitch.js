import React, { Component } from "react";
import { View, Text, Switch, StyleSheet, Dimensions } from "react-native";
import { ImagePicker } from "expo";
import components from "../../Components/COH";
const { RequiredField, SwitchField, ChooseImage, AddHashtags } = components;
import { landscape, portrait } from "../../Pages/Style/create-open-style";
// SET PROPER STYLING IF LANDSCAPE OR PORTRAIT
const { height, width } = Dimensions.get("window");
const aspectRatio = height / width;
const changeScreenOrientation = () => {
  Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.LANDSCAPE);
};
let styles;
if (aspectRatio > 1.6) {
  styles = portrait;
} else {
  styles = landscape;
  changeScreenOrientation();
}
class FieldSwitch extends Component {
  constructor(props) {
    super();
    this.state = {
      image: "../../Assets/iconHouse3x.png",
      imageChange: false,
      Hashtags: null,
      uploading: false
    };
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    this._handleImagePicked(result);
  };

  _handleImagePicked = async pickerResult => {
    let uploadResponse, uploadResult;

    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        uploadResponse = await uploadImageAsync(pickerResult.uri);
        uploadResult = await uploadResponse.json();
        this.setState({ image: uploadResult.url });
      }
    } catch (err) {
      console.log({ uploadResponse });
      console.log({ uploadResult });
      console.log({ err });
      alert("Upload failed, sorry :(");
    } finally {
      this.setState({ uploading: false });
    }
  };

  onValueChange = () => {
    return this.props.switchChange(
      this.props.parentIndex,
      this.props.switchIndex
    );
  };
  renderQuestions = () => {
    switch (this.props.type) {
      case "Required":
        return (
          <RequiredField
            question={this.props.question}
            styles={styles.simpleField}
            style={this.props.style}
          />
        );
        break;
      case "Image":
        return (
            <ChooseImage
              question={this.props.question}
              imageModal={this.props.appState.imageModal}
              value={this.props.value}
              onChange={this.onValueChange}
              image={this.props.image}
              setImage={this.props.setImage}
              _pickImage={this._pickImage}
            />
        );
        break;
      case "Add Hashtags":
        return <AddHashtags />;
        break;
      case "Boolean":
        return (
          <SwitchField
            question={this.props.question}
            value={this.props.value}
            onChange={this.onValueChange}
            style={styles.switchField}
          />
        );
        break;
      default:
        return <Text> This type has yet to be Implemented</Text>;
    }
  };
  render() {
    let { image } = this.state;
    if (this.props.type === 'Image') {
      return <View style={{height: '25%', alignItems: 'center'}}>{this.renderQuestions()}</View>;
    }
    if (this.props.type === 'Add Hashtags') {
      return <View style={{flex: 1, width: "100%", alignItems: "center"}}>{this.renderQuestions()}</View>
    }
    return <View style={this.props.style.fieldsStage}>{this.renderQuestions()}</View>;
  }
}

const uploadImageAsync = async uri => {
  let apiUrl = "https://openhousebackend.herokuapp.com/api/photo";
  let uriParts = uri.split(".");
  let fileType = uri[uri.lenghth - 1];

  let formData = new FormData();
  formData.append("photo", {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`
  });

  let options = {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data"
    }
  };

  return fetch(apiUrl, options);
};

export default FieldSwitch;
