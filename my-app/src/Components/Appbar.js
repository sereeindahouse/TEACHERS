import * as React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import CircularProgress from "@mui/material/CircularProgress";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "9999px", 
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(1),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  transition: "all 0.3s ease",
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
  color: "white",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
    "&:focus": {
      width: "24ch",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      boxShadow: "0 0 8px rgba(255, 215, 0, 0.5)",
      borderRadius: "9999px",
    },
  },
}));

export default function PrimarySearchAppBar({ onLogout, onSearch }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    handleMenuClose();
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      console.log("Search triggered with term:", searchTerm);
      setIsSearching(true);
      onSearch(searchTerm);
      setTimeout(() => setIsSearching(false), 500); 
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      className="mt-2"
    >
      <MenuItem onClick={handleMenuClose} className="hover:bg-gray-700 hover:text-white">Players</MenuItem>
      <MenuItem onClick={handleMenuClose} className="hover:bg-gray-700 hover:text-white">News</MenuItem>
      <MenuItem onClick={handleLogoutClick} className="hover:bg-gray-700 hover:text-white">Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      className="mt-2"
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          className="text-white"
        >
          <AccountCircle />
        </IconButton>
        <p className="text-white">Profile</p>
      </MenuItem>
      <MenuItem onClick={handleLogoutClick}>
        <p className="text-white">Logout</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }} className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
      <AppBar position="static" className="bg-transparent">
        <Toolbar className="py-4">
          <IconButton
            size="large"
            edge="start"
            aria-label="open drawer"
            className="mr-2 text-white hover:text-yellow-400"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            className="hidden sm:block text-white font-bold tracking-wide"
          >
            S1mple posts
          </Typography>
          <Search className="relative">
            <SearchIconWrapper>
              {isSearching ? (
                <CircularProgress size={20} className="text-yellow-400" />
              ) : (
                <SearchIcon className="text-white" />
              )}
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search posts or users…"
              inputProps={{ "aria-label": "search" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              className="text-white placeholder-gray-400"
            />
            {searchTerm && (
              <IconButton
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white hover:text-yellow-400"
                onClick={handleClearSearch}
              >
                <ClearIcon />
              </IconButton>
            )}
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              className="text-white hover:text-yellow-400"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              className="text-white hover:text-yellow-400"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}