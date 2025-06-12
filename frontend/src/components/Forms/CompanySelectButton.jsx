import { Select } from "antd";
import PropTypes from "prop-types";

const CompanySelectButton = ({ onValueChange }) => {
  const handleChange = (value, option) => {
    console.log("Selected item:", option);

    // Seçilen öğenin değerini al
    const selectedValue = option.value;
    console.log(selectedValue);

    // Seçilen değeri onValueChange prop'u aracılığıyla başka bir bileşene iletmek
    onValueChange(selectedValue);
  };
  return (
    <Select
      showSearch
      style={{
        width: "100%",
      }}
      placeholder="Seçim için arama yapabilirsiniz"
      optionFilterProp="label"
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? "")
          .toLowerCase()
          .localeCompare((optionB?.label ?? "").toLowerCase())
      }
      options={[
        {
          value: "1",
          label: "Data Platform",
        },
        {
          value: "2",
          label: "Albil",
        },
        {
          value: "4",
          label: "Arvato",
        },
        {
          value: "6",
          label: "Asset Group",
        },
        {
          value: "9",
          label: "Aytemiz",
        },
        {
          value: "11",
          label: "Beymen AyMarka",
        },
        {
          value: "15",
          label: "BTE",
        },
        {
          value: "17",
          label: "Ceva Lojistik",
        },
        {
          value: "19",
          label: "Daikin",
        },
        {
          value: "21",
          label: "DataHouse",
        },
        {
          value: "25",
          label: "Eksim",
        },
        {
          value: "26",
          label: "Enqura",
        },
        {
          value: "28",
          label: "Este Bilisim",
        },
        {
          value: "33",
          label: "Global Menkul",
        },
        {
          value: "34",
          label: "InspireIT",
        },
        {
          value: "36",
          label: "Kariyer.NET",
        },
        {
          value: "37",
          label: "Kipas Holding",
        },
        {
          value: "40",
          label: "Kuralkan",
        },
        {
          value: "41",
          label: "Mars Cinema",
        },
        {
          value: "42",
          label: "Mayasoft",
        },
        {
          value: "47",
          label: "Netas",
        },
        {
          value: "51",
          label: "Protel",
        },
        {
          value: "55",
          label: "Simfer",
        },
        {
          value: "56",
          label: "Software One",
        },
        {
          value: "58",
          label: "Tahincioğlu",
        },
        {
          value: "59",
          label: "Tanap",
        },
        {
          value: "61",
          label: "Tekfen",
        },
        {
          value: "66",
          label: "V-Prof IT",
        },
        {
          value: "75",
          label: "Microsoft",
        },
        {
          value: "76",
          label: "Sieda Bilisim",
        },
        {
          value: "78",
          label: "Monster Notebook",
        },
        {
          value: "79",
          label: "Neova",
        },
        {
          value: "80",
          label: "Derimod",
        },
        {
          value: "81",
          label: "Oztiryakiler",
        },
        {
          value: "85",
          label: "EgeTav",
        },
        {
          value: "86",
          label: "Dogruer Gumruk",
        },
        {
          value: "88",
          label: "Senpilic",
        },
        {
          value: "89",
          label: "METRO",
        },
        {
          value: "90",
          label: "AlShaya",
        },
        {
          value: "91",
          label: "Isper",
        },
        {
          value: "93",
          label: "Bezmialem Uni",
        },
        {
          value: "94",
          label: "Bambi Yatak",
        },
        {
          value: "95",
          label: "Sanko Holding",
        },
        {
          value: "96",
          label: "Birlesik Odeme Sistemleri",
        },
        {
          value: "98",
          label: "Yucel Grup",
        },
        {
          value: "100",
          label: "Profect Soft",
        },
        {
          value: "102",
          label: "IHS Teknoloji",
        },
        {
          value: "109",
          label: "Elif Plastik",
        },
        {
          value: "113",
          label: "SY Bilisim",
        },
        {
          value: "126",
          label: "ETG Danismanlik",
        },
        {
          value: "129",
          label: "Infobox",
        },
        {
          value: "132",
          label: "Networker",
        },
        {
          value: "133",
          label: "NGN",
        },
        {
          value: "134",
          label: "NGTech",
        },
        {
          value: "139",
          label: "Tatilbudur",
        },
        {
          value: "143",
          label: "Unlu Teknik",
        },
        {
          value: "152",
          label: "Klas Game",
        },
        {
          value: "155",
          label: "UGM - Unsped Gumruk Musavirligi",
        },
        {
          value: "157",
          label: "InnTheBox",
        },
        {
          value: "160",
          label: "D724 Bilisim Hizmetleri",
        },
        {
          value: "175",
          label: "Modern Karton",
        },
        {
          value: "176",
          label: "DyDo Drinco",
        },
        {
          value: "179",
          label: "Santa Farma",
        },
        {
          value: "180",
          label: "Sanko - Baspinar",
        },
        {
          value: "181",
          label: "Isttelkom",
        },
        {
          value: "184",
          label: "Data Platform Ege",
        },
        {
          value: "187",
          label: "Infobim",
        },
        {
          value: "199",
          label: "Yatsan",
        },
        {
          value: "200",
          label: "ZIP Finansman",
        },
        {
          value: "201",
          label: "PiriMedya",
        },
        {
          value: "204",
          label: "ITServ",
        },
        {
          value: "207",
          label: "Despro Bilgi Teknolojileri",
        },
        {
          value: "212",
          label: "Erpilic",
        },
        {
          value: "214",
          label: "Peli Parke",
        },
        {
          value: "217",
          label: "Aktifbank",
        },
        {
          value: "218",
          label: "KGF",
        },
        {
          value: "219",
          label: "BinBin",
        },
        {
          value: "221",
          label: "Provision Pay",
        },
        {
          value: "222",
          label: "BPW Otomotiv",
        },
        {
          value: "224",
          label: "CCR Group",
        },
        {
          value: "226",
          label: "Philip Morris",
        },
        {
          value: "227",
          label: "Izmir Turk Koleji",
        },
        {
          value: "229",
          label: "Agdas",
        },
        {
          value: "234",
          label: "Yesim Tekstil",
        },
        {
          value: "237",
          label: "Bizim Bulut (Asir grup)",
        },
        {
          value: "238",
          label: "Kayaport",
        },
        {
          value: "239",
          label: "Sidra Bilisim",
        },
        {
          value: "240",
          label: "Turpak",
        },
        {
          value: "241",
          label: "Provit",
        },
        {
          value: "242",
          label: "Chef Seasons",
        },
        {
          value: "243",
          label: "TEV",
        },
        {
          value: "244",
          label: "Isik Tarim",
        },
        {
          value: "245",
          label: "Kargoist",
        },
        {
          value: "246",
          label: "Dünya Katılım",
        },
        {
          value: "247",
          label: "Selected Interventions",
        },
        {
          value: "248",
          label: "Sanalogi",
        },
        {
          value: "249",
          label: "Uyar Holding",
        },
        {
          value: "251",
          label: "Arabam.com",
        },
        {
          value: "252",
          label: "Nesan Otomotiv",
        },
        {
          value: "253",
          label: "Kar Porselen",
        },
        {
          value: "254",
          label: "Ege Ev",
        },
        {
          value: "255",
          label: "Türk Ticaret Bankası",
        },
      ]}
      onChange={handleChange}
    />
  );
};

CompanySelectButton.propTypes = {
    onValueChange: PropTypes.func.isRequired,
  };

export default CompanySelectButton;
