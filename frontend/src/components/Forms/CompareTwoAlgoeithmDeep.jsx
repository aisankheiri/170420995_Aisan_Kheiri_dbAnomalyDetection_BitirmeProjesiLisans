import PropTypes from "prop-types";

import CompareValuesDeep from "./CompareValuesDeep";
const CompareTwoAlgoeithmDeep = ({ result1, result2 }) => {
  return (
    <div>
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#ffff00",
          marginTop: "2rem",
        }}
      >
        <h2>
          Derin öğrenmede iki algoritmanın performans olarak kıyaslanması aşağıdaki gibidir
        </h2>
      </div>
      <CompareValuesDeep values1={result1} values2={result2} />
    </div>
  );
};

CompareTwoAlgoeithmDeep.propTypes = {
  result1: PropTypes.arrayOf(
    PropTypes.shape({
      train: PropTypes.number,
      test: PropTypes.number,
    })
  ).isRequired,
  result2: PropTypes.arrayOf(
    PropTypes.shape({
      train: PropTypes.number,
      test: PropTypes.number,
    })
  ).isRequired,
};

export default CompareTwoAlgoeithmDeep;
