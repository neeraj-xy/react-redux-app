import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import BookList from "../BookList";
import booksReducer from "../../features/books/bookSlice";
import userEvent from "@testing-library/user-event";
import App from "../../App";
import { act } from "react-dom/test-utils";

const mockStore = (initialState: any) => {
  const store = createStore(booksReducer, initialState, applyMiddleware(thunk));
  return {
    ...store,
    dispatch: jest.fn(store.dispatch),
  };
};

describe("Testing BookList Component", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      books: {
        currentPage: 1,
        results: {
          count: 10,
          books: [
            {
              id: 1,
              book_title: "Book 1",
              book_author: "Author 1",
              book_publication_year: 2021,
            },
          ],
        },
        loading: false,
        error: null,
      },
    });
  });

  it("should render no books data when no data is present", () => {
    store = mockStore({
      ...store.getState(),
      books: { results: { books: [] } },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <BookList />
        </BrowserRouter>
      </Provider>
    );

    const emptyElement = screen.getByText(`No Books Data!`);
    expect(emptyElement).toBeInTheDocument();
  });

  it("should render error message when error is present", () => {
    const errorMessage = "An error occurred.";
    store = mockStore({
      ...store.getState(),
      books: {
        ...store.getState().books,
        error: errorMessage,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <BookList />
        </BrowserRouter>
      </Provider>
    );

    const errorElement = screen.getByText(`Error: ${errorMessage}`);
    expect(errorElement).toBeInTheDocument();
  });

  it("should render loading spinner when loading is true", async () => {
    store = mockStore({
      ...store.getState(),
      books: {
        ...store.getState().books,
        loading: true,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <BookList />
        </BrowserRouter>
      </Provider>
    );

    const loadingSpinner = screen.getByTestId("loading-spinner");
    expect(loadingSpinner).toBeInTheDocument();
  });

  it("should render book list when books are available", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <BookList />
        </BrowserRouter>
      </Provider>
    );

    const bookTitleElement = screen.getByText("Title: Book 1");

    expect(bookTitleElement).toBeInTheDocument();
  });

  it("should change the url page count on clicking next", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/page/1" />} />
            <Route path="/page/:page" element={<App />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const button = screen.getByLabelText("Go to next page");

    expect(global.window.location.href).toContain("/page/1");

    await waitFor(async () => await userEvent.click(button));

    expect(global.window.location.href).toContain("/page/2");
  });
});
