import PropTypes from "prop-types";

function PageLifeImg2({ imageSrc, answer }) {
  return (
    <div>
      <h2
        style={{
          textAlign: "center",
          marginTop: "40px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#c6e2ff",
        }}
      >
        Page Life Expectancy Grafiği Eğitimden Sonra
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {imageSrc && (
          <div
            style={{
              maxWidth: "100%",
              width: "60%",
              height: "auto",
            }}
          >
            <img
              src={imageSrc}
              alt="Page Life Expectancy Heatmap"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        )}
        <div style={{ textAlign: "justify" }}>{answer}</div>
      </div>
    </div>
  );
}

PageLifeImg2.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
};

export default PageLifeImg2;
