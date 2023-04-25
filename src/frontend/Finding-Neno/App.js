

export default function App() {
  const [isLogin, setIsLogin] = useState(true); // true to show login page, false to show signup page
  const switchPage = () => {
    setIsLogin(!isLogin);
  };

  const login = (formData) => {
    alert("login data: " + JSON.stringify(formData));
  };

  const signup = (formData) => {
    alert("signup data: " + JSON.stringify(formData));
  };

  return (
    <NativeBaseProvider>
      {/* remove this css later */}
      <Box flex={1} alignItems="center" justifyContent="center">
        {/* keeping this here for now */}

      </Box>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
