import bookReducer, {
  setPage,
  setSearchTerm,
  fetchAsyncBooks,
  ResultState,
} from "../books/bookSlice";

describe("Testing bookSlice reducer", () => {
  const state: ResultState = {
    currentPage: 1,
    results: { books: [], count: 0 },
    loading: false,
    error: null,
    itemsPerPage: 20,
    searchTerm: "",
    filters: [],
  };

  it("should handle initial state", () => {
    const initialState: ResultState = state;
    const action = { type: "unknown" };
    const expectedState = initialState;

    expect(bookReducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle setPage", () => {
    const initialState: ResultState = { ...state, currentPage: 5 };
    const action = setPage(5);
    const expectedState: ResultState = { ...state, currentPage: 5 };

    expect(bookReducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle setSearchTerm", () => {
    const initialState: ResultState = { ...state, searchTerm: "" };
    const action = setSearchTerm("test");
    const expectedState: ResultState = { ...state, searchTerm: "test" };

    expect(bookReducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle fetchAsyncBooks.pending", () => {
    const initialState: ResultState = state;
    const action = { type: fetchAsyncBooks.pending.type };
    const expectedState = bookReducer(initialState, action);

    expect(expectedState).toEqual({
      ...initialState,
      loading: true,
      error: null,
    });
  });

  it("should handle fetchAsyncBooks.fulfilled", () => {
    const responseData = { books: [{ id: 1, title: "Book 1" }], count: 1 };

    const initialState: ResultState = state;

    const action = {
      type: fetchAsyncBooks.fulfilled.type,
      payload: responseData,
    };
    const expectedState = bookReducer(initialState, action);

    expect(expectedState).toEqual({
      ...initialState,
      results: responseData,
      loading: false,
      error: null,
    });
  });
});
