import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { APIResponse } from "../../types";
import axios from "axios";
import { RootState } from "../store";

export interface ResultState {
  currentPage: number;
  results: APIResponse;
  loading: boolean;
  error: string | null;
  itemsPerPage: number;
  searchTerm: string;
  filters: Array<any>;
}

const initialState: ResultState = {
  currentPage: 1,
  results: { books: [], count: 0 },
  loading: false,
  error: null,
  itemsPerPage: 20,
  searchTerm: "",
  filters: [],
};

export const fetchAsyncBooks = createAsyncThunk(
  "books/fetchAsyncBooks",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const currentPage = state.books.currentPage;
    const itemsPerPage = state.books.itemsPerPage;
    const searchTerm = state.books.searchTerm;
    let filters = state.books.filters;

    if (searchTerm.trim() !== "") {
      filters = [{ type: "all", values: [searchTerm] }];
    }

    try {
      const response = await axios.post(
        "http://nyx.vima.ekt.gr:3000/api/books",
        {
          params: {
            page: currentPage,
            itemsPerPage: itemsPerPage,
            filters: filters,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Error fetching books from the server.");
    }
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAsyncBooks.fulfilled, (state, action) => {
        state.results = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAsyncBooks.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Error fetching books from the server.";
      });
  },
});

export const { setPage, setSearchTerm } = bookSlice.actions;

export default bookSlice.reducer;
