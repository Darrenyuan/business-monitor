import React, { Component } from 'react';
import Swiper from 'swiper/dist/js/swiper.js';
import 'swiper/dist/css/swiper.min.css';

class New extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: this.props.path,
      i: this.props.i,
    };
  }
  componentDidMount() {
    new Swiper('.swiper-container', {
      autoplay: {
        delay: 3000,
        stopOnLastSlide: false,
        disableOnInteraction: false,
      },
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.path !== this.props.path) {
      this.setState({
        path: this.props.path,
      });
    }
  }
  render() {
    return (
      // <div className="" style={{ backgroundColor: 'red' }}>
      <div className="new swiper-container">
        <div className="swiper-wrapper">
          {this.state.path.map((item, index) => {
            return (
              <div key={index} className="swiper-slide swiper_imgDiv">
                <img style={{ width: '472px' }} alt="example" src={item.url} />
              </div>
            );
          })}
        </div>
      </div>
      // </div>
    );
  }
}

export default New;
