import { Box } from "@mui/material";
import BookList from "./components/BookList";
import Header from "./components/Header";

function App() {
  return (
    <Box sx={{ bgcolor: "#F9F9F3", height: "100vh" }}>
      <Header />
      <Box sx={{ marginTop: 2 }}>
        <BookList />
      </Box>
    </Box>
  );
}

export default App;
