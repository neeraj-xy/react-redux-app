import { Component, ChangeEvent, KeyboardEvent } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../features/store";
import { fetchAsyncBooks, setSearchTerm } from "../features/books/bookSlice";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

interface HeaderProps extends PropsFromRedux {}

interface HeaderState {
  searchValue: string;
}

class Header extends Component<HeaderProps, HeaderState> {
  state: HeaderState = {
    searchValue: "",
  };

  handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchValue: event.target.value });
  };

  handleSearchSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    this.props.setSearchTerm(this.state.searchValue);
    if (event.key === "Enter") {
      this.props.fetchAsyncBooks();
    }
  };

  render() {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              REACT-REDUX-APP
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                onChange={this.handleSearchChange}
                onKeyPress={(event: KeyboardEvent<HTMLInputElement>) =>
                  this.handleSearchSubmit(event)
                }
              />
            </Search>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  searchTerm: state.books.searchTerm,
});

const mapDispatchToProps = {
  fetchAsyncBooks,
  setSearchTerm,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Header);
