import React, { Component } from "react";
import { View, Animated, Dimensions, Modal } from "react-native";
import { launchForm } from "../actions";
import LaunchOptions from "../Components/Signup/launchOptions";
import Submitted from "../Components/Signup/submitted";
import SignupForm from "../Components/Signup/signupForm";
import CreatePin from "../Components/Signup/CreatePin";
import HouseDisplay from "../Components/Signup/houseDisplay";
import { portrait, landscape } from "./Style/signup-style";
import { connect } from "react-redux";

const { height, width } = Dimensions.get("window");
const aspectRatio = height / width;
console.log("HEIGHT: " + height);
console.log("WIDTH: " + width);
const changeScreenOrientation = () => {
  Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.LANDSCAPE);
};
let styles;
if (aspectRatio > 1.6) {
  styles = portrait;
  console.log("IPHONE");
} else {
  styles = landscape;
  changeScreenOrientation();
  console.log("IPAD");
}


class Signup extends Component {
  constructor() {
    super();

    this.state = {
      exiting: false,
      confirmed: false,
      launched: false,
      visible: false,
      visibility: new Animated.Value(1),
      pin: "",
      modalVisible: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validatePin = this.validatePin.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.launchSignup = this.launchSignup.bind(this);
  }

  exitingPage = () => {
    this.setState({ exiting: !this.state.exiting });
  };

  componentDidMount() {
    this.setState({ modalVisible: true });
  }

  handleSubmit() {
    this.setState({ visible: true });
    Animated.timing(this.state.visibility, {
      toValue: 1,
      duration: 5000
    }).start(() => {
      this.setState({ visible: false });
    });
  }

  validatePin() {
    this.setState({ confirmed: true });
  }

  toggleModal() {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  launchSignup() {
    this.setState({ launched: !this.state.launched });
  }

  render() {
    const { relaunch, index } = this.props.navigation.state.params
    console.log(relaunch)
    return (
      <View style={styles.container}>
        <HouseDisplay
          styles={styles}
          exiting={this.state.exiting}
          exitingPage={this.exitingPage}
          navigation={this.props.navigation}
          pin={this.props.pin}
          property={this.props.questions.property || this.props.property}
        />
        <Modal
          transparent={true}
          visible={this.state.modalVisible}
          onDismiss={() => this.launchSignup()}
        >
          <LaunchOptions
            navigation={this.props.navigation}
            toggleModal={this.toggleModal}
            styles={styles}
            relaunch={relaunch}
          />
        </Modal>
        {this.state.exiting ? (
          <CreatePin
            exiting={this.state.exiting}
            exitingPage={this.exitingPage}
            validatePin={this.validatePin}
            toggleModal={this.toggleModal}
            launchSignup={this.launchSignup}
            navigation={this.props.navigation}
            styles={styles}
          />
        ) : this.state.launched && !this.state.confirmed ? (
          <CreatePin
            exiting={this.state.exiting}
            exitingPage={this.exitingPage}
            validatePin={this.validatePin}
            toggleModal={this.toggleModal}
            launchSignup={this.launchSignup}
            styles={styles}
          />
        ) : !this.state.visible ? (
          <SignupForm 
            handleSubmit={this.handleSubmit} 
            styles={styles} 
            index={index}
          />
        ) : (
          <Animated.View
            style={[{ opacity: this.state.visibility }, styles.animated]}
          >
            <Submitted styles={styles} />
          </Animated.View>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    pin: state.pin,
    property: state.property,
    openHouse: state.openHouse,
    questions: state.questions,
  };
};

export default connect(mapStateToProps, null)(Signup);
