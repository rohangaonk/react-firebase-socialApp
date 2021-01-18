const themeFile = {
  palette: {
    primary: {
      light: "#33c9dc",
      main: "#00bcd4",
      dark: "#008394",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff6333",
      main: "#ff3d00",
      dark: "#b22a00",
      contastText: "#fff",
    },
  },

  customStyles: {
    form: {
      textAlign: "center",
    },
    textField: {
      margin: "10px auto 10px auto",
    },
    button: {
      position: "relative",
    },
    customeError: {
      color: "red",
      fontSize: "0.8rem",
      marginTop: 10,
      border: "1px solid red",
      padding: 5,
      borderRadius: 5,
      marginBottom: 5,
    },
    progress: {
      position: "absolute",
    },
    invisibleSeparator: {
      border: "none",
      margin: 4,
    },
    visibleSeparator: {
      width: "100%",
      borderBottom: "1px solid rgba(0,0,0,0.1)",
    },
  },
};
export default themeFile;
