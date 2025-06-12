import ConfidencePlot from "./ConfidencePlot";
import DataFrameSummary from "./DataFrameSummary";
import FullData from "./FullData";
import Get5data from "./Get5data";
import Heatmap from "./Heatmap";
import Heatmap2 from "./Heatmap2";
import PgeLifePlot from "./PgeLifePlot";
import PieChart from "./PieChart";
import PreprocessData from "./PreprocessData";
import Relationships from "./Relationships";
import Statistics from "./Statistics";
import SupporPlot from "./SupporPlot";

const AfterSvm = () => {
  return (
    <div>
      <FullData />
      <Heatmap />
      <Heatmap2 />
      <Statistics />
      <Relationships />
      <PgeLifePlot />
      <Get5data />
      <DataFrameSummary />
      <PieChart />
      <PreprocessData />
      <SupporPlot/>
      <ConfidencePlot/>
      
    
    </div>
  );
};

export default AfterSvm;
