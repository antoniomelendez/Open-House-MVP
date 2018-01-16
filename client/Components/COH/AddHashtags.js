import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import CustomText from "../CustomText";
import { landscape, portrait } from "../../Pages/Style/create-open-style.js";

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

class AddHashtags extends Component {
  constructor(props) {
    super();
    this.state = {
      hashtags: ["", ""]
    };
  }
  onChange = (text, index) => {
    const hashtags = this.state.hashtags;
    hashtags[index] = text;
    this.setState({
      hashtags: hashtags
    });
  };
  addHashtag() {
    const { hashtags } = this.state;
    return hashtags.map((hashtag, i) => {
      return (
        <KeyboardAvoidingView
          key={i.toString()}
          style={styles.hashtagSecondaryContainer}
        >
          <TextInput
            style={styles.addHashtag}
            placeholder="Enter hashtag"
            onChangeText={text => this.onChange(text, i)}
            value={this.state.hashtags[i]}
          />
        </KeyboardAvoidingView>
      );
    });
  }
  addInput = () => {
    const { hashtags } = this.state;
    hashtags.push("");
    this.setState({ hashtags });
  };

  render() {
    return (
      <ScrollView contentContainerStyle={{ width: '100%', height: '80%' }}>
        <View style={styles.hashtagContainer}>
          {/* <View> */}
            {this.addHashtag()}
            <TouchableOpacity
              style={styles.hashtagButton}
              onPress={this.addInput}
              underlayColor="#fff"
            >
              <CustomText font="bold" style={styles.hashtagFont}>
                Add Another
              </CustomText>
            </TouchableOpacity>
          {/* </View> */}
        </View>
      </ScrollView>
    );
  }
}

export default AddHashtags;
