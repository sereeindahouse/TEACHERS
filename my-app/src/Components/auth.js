import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(4),
  maxWidth: 400,
  margin: "auto",
  marginTop: theme.spacing(10),
  backgroundColor: "white",
  borderRadius: "16px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
    transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5, 4),
  borderRadius: "8px",
  fontWeight: 600,
}));

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = React.useState(true);
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = async () => {
    try {
      console.log("Sending request to:", isLogin ? "/login" : "/signup", { userName, password });
      const endpoint = isLogin ? "/login" : "/signup";
      const response = await axios.post(`http://localhost:8000${endpoint}`, {
        userName,
        password,
        profileImage: "https://example.com/default.jpg",
      });
      console.log("Response:", response.data);
      if (isLogin) {
        const { token, userId } = response.data;
        console.log("Received userId:", userId);
        if (!userId || !token) throw new Error("Invalid login response");
        if (userId !== "68ccc18c98ccc2748323e749") {
          console.warn("userId mismatch:", userId, "expected:", "68ccc18c98ccc2748323e749");
        }
        if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
          throw new Error("Invalid userId format: " + userId);
        }
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        onLogin(userId);
      } else {
        setIsLogin(true);
        setError("Signup successful! Please log in.");
      }
    } catch (err) {
      console.error("Error response:", err.response?.data, err.response?.status);
      setError(err.response?.data?.message || err.message || "An error occurred");
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
      <StyledBox className="w-full sm:w-96">
        <Typography variant="h4" className="text-gray-800 font-bold mb-6">
          {isLogin ? "Welcome Back" : "Join Mongolz"}
        </Typography>
        <TextField
          label="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          fullWidth
          margin="normal"
          className="rounded-lg border-gray-300 focus:ring-yellow-400"
          InputProps={{ className: "text-gray-700" }}
          InputLabelProps={{ className: "text-gray-600" }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          className="rounded-lg border-gray-300 focus:ring-yellow-400"
          InputProps={{ className: "text-gray-700" }}
          InputLabelProps={{ className: "text-gray-600" }}
        />
        {error && (
          <Typography className="text-red-500 text-sm mt-2">{error}</Typography>
        )}
        <StyledButton
          variant="contained"
          onClick={handleSubmit}
          className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black w-full"
        >
          {isLogin ? "Login" : "Sign Up"}
        </StyledButton>
        <StyledButton
          variant="text"
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
          className="mt-4 text-gray-300 hover:text-yellow-400"
        >
          {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
        </StyledButton>
      </StyledBox>
    </Box>
  );
}