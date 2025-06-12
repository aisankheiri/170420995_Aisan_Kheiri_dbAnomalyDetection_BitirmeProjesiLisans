import { Carousel } from "antd";
import GetStarted1 from "../GetStarted/GetStarted1";
import GetStarted2 from "../GetStarted/GetStarted2";
import GetStarted3 from "../GetStarted/GetStarted3";
const contentStyle = {
  margin: 0,
  padding: "1rem",
  height: "350px",
  color: "#fff",
  lineHeight: "350px",
  textAlign: "center",
  background: "#f5f4f4",
};
const CarouselSlider = () => (
  <>
    <Carousel arrows infinite={false} autoplay>
      <div>
        <div style={contentStyle}>
          <GetStarted1 />
        </div>
      </div>
      <div>
        <h3 style={contentStyle}>
          <GetStarted2 />
        </h3>
      </div>
      <div>
        <h3 style={contentStyle}>
          <GetStarted3 />
        </h3>
      </div>
    </Carousel>
  </>
);
export default CarouselSlider;
