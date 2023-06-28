import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../features/store";
import { fetchAsyncBooks, setPage } from "../features/books/bookSlice";
import {
  Alert,
  Backdrop,
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Pagination,
  Paper,
} from "@mui/material";
import { Book } from "../types";

function BookList() {
  const { page = "1" } = useParams<{ page: string }>();
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const { currentPage, results, loading, error } = useSelector(
    (state: RootState) => state.books
  );

  useEffect(() => {
    dispatch(fetchAsyncBooks());
  }, [dispatch, currentPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    dispatch(setPage(value));
    navigate(`/page/${value}`);
  };

  if (loading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress data-testid="loading-spinner" color="secondary" />
      </Backdrop>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!loading && results.books.length === 0) {
    return (
      <Alert severity="info" sx={{ justifyContent: "center" }}>
        No Books Data!
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 600,
          maxHeight: 500,
          overflow: "auto",
        }}
      >
        <List sx={{ borderRadius: 10 }}>
          {results.books.map((book: Book) => (
            <Box key={book.id}>
              <ListItem key={book.id}>
                <ListItemText
                  primary={<>Title: {book.book_title}</>}
                  secondary={
                    <>
                      Author: {book.book_author}
                      <br />
                      Year: {book.book_publication_year}
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </Box>
          ))}
        </List>
      </Paper>
      <Paper elevation={3} sx={{ padding: 1, margin: 2 }}>
        <Pagination
          count={Math.ceil(results.count / results.books.length)}
          page={Number(page)}
          onChange={handlePageChange}
          color="secondary"
        />
      </Paper>
    </Box>
  );
}

export default BookList;
