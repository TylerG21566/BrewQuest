

const ColoredBox = () => {
  const containerStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '13vh', 
      };
  const boxStyle = {
    backgroundColor: '#00ff00', 
    padding: '7px', 
    width: '500px',
    color: '#ffffff', 
    fontSize: '30px',
    borderRadius: '15px',

  };

  return (
    <>
        <div style={containerStyle}>
            <div style={boxStyle}>
            1.      Bob
            </div>
        </div>
        <div style={containerStyle}>
            <div style={boxStyle}>
            2.      Timothy
            </div>
        </div>
        <div style={containerStyle}>
            <div style={boxStyle}>
            3.      Stefano
            </div>
        </div>
        <div style={containerStyle}>
            <div style={boxStyle}>
            4.      Hannes
            </div>
        </div>
        <div style={containerStyle}>
            <div style={boxStyle}>
            5.      Paul
            </div>
        </div>
    </>
  );
};

export default ColoredBox;