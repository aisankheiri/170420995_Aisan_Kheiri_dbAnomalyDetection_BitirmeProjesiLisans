const Map = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3014.6575785122263!2d29.140868299999998!3d40.923253300000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac50f85bc89b5%3A0x9c03b68227d50938!2sData%20Platform%20Bilgi%20Sistemleri%20AS!5e0!3m2!1str!2str!4v1721742586740!5m2!1str!2str"
        width="100%"
        height="250"
        style={{
          border: "0",
        }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default Map;
