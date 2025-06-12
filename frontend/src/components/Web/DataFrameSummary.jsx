import { useEffect, useState } from "react";
import { Table } from "antd";

function DataFrameSummary() {
  const [summaryData, setSummaryData] = useState(null);
  const rowValues = [
    "InstanceID",
    "CreateDate",
    "page life expectancy",
    "% privileged time",
    "transactions/sec",
    "write transactions/sec",
    "logical connections",
    "dbaHCDOC",
    "VobVadesiDolmuslariSil",
    "dbaShrinkLog",
    "dbaHCDOCexportTxt",
    "dbaCheckPrimaryNode",
    "WMI Response - DATABASE Log File Growth Event",
    "dbaTurkiyeFinansEventLogDelete",
    "dbaBackupLog",
    "FON_VALUE_EXPORT",
    "dbaSessionKiller",
    "dbafullbackup",
    "tblTic_Sil",
    "OTS_Instrument_OHLC_History",
    "ASPState_Job_DeleteExpiredSessions",
    "dbaMaintenanceReIndex",
    "tblWebtopLogs_Sil",
    "TurkiyeFinans Maintenance",
    "dbaHCDOCcontrol",
    "dbaHCDOCHadrControl",
    "syspolicy_purge_history",
    "dbaCheckListenerStatus",
    "SP_TblTicGunlukInsertData",
    "tblTicTarihsel",
    "dbaFullAylıkBackup",
    "WMI Response - DATABASE Data File Growth Event",
    "dbaFibabankEventLogDelete",
    "dbaFibadataShrink",
    "Set Mapping Job",
    "dbaCheckDBSync",
  ];

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const fetchSummaryData = async () => {
    const response = await fetch("http://localhost:5000/get_dataframe_summary");
    const data = await response.json();
    setSummaryData(data);
  };

  if (!summaryData) {
    return <div>Loading...</div>;
  }

  const columns = [
    {
      title: "row",
      dataIndex: "row",
      key: "row",
      render: (text, record) => rowValues[record.key], // Render custom row values from the list
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Mean",
      dataIndex: "mean",
      key: "mean",
    },
    {
      title: "Std",
      dataIndex: "std",
      key: "std",
    },
    {
      title: "Min",
      dataIndex: "min",
      key: "min",
    },
    {
      title: "25%",
      dataIndex: "25%",
      key: "25%",
    },
    {
      title: "50%",
      dataIndex: "50%",
      key: "50%",
    },
    {
      title: "75%",
      dataIndex: "75%",
      key: "75%",
    },
    {
      title: "Max",
      dataIndex: "max",
      key: "max",
    },
  ];

  const dataSource = Object.entries(summaryData).map(([row, values]) => ({
    key: row,
    row,
    count: values.count.toFixed(1), // 1 basamağa kadar hassasiyet,
    mean: values.mean.toFixed(6), // 6 basamağa kadar hassasiyet
    std: values.std.toFixed(6), // 6 basamağa kadar hassasiyet
    min: values.min.toFixed(2), // 2 basamağa kadar hassasiyet,
    "25%": values["25%"].toFixed(2), // 2 basamağa kadar hassasiyet
    "50%": values["50%"].toFixed(2), // 2 basamağa kadar hassasiyet
    "75%": values["75%"].toFixed(2), // 2 basamağa kadar hassasiyet
    max: values.max.toFixed(2), // 2 basamağa kadar hassasiyet,
  }));

  return (
    <div>
      <h2 style={{  backgroundColor: '#c6e2ff' ,textAlign:"center"}}>Veri Çerçevesinin Sütun Bazında İstatistiksel Özeti (Transpoze Edilmiş)</h2>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          position: ["bottomRight"],
          pageSizeOptions: ["10", "20", "50"],
          defaultPageSize: 50,
          showSizeChanger: true,
        }}
        size="small"
        style={{ width: "100%" }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}

export default DataFrameSummary;
