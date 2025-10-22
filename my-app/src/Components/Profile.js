import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

const StyledCard = styled(Card)(({ theme }) => ({
  width: "320px",
  minWidth: "320px",
  maxWidth: "320px",
  height: "360px",
  minHeight: "360px",
  maxHeight: "360px",
  borderRadius: "16px",
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  backgroundColor: "white",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
    height: "340px",
    minHeight: "340px",
    maxHeight: "340px",
  },
}));

const StyledCardContent = styled(CardContent)({
  height: "120px",
  minHeight: "120px",
  maxHeight: "120px",
  padding: "12px",
  boxSizing: "border-box",
  overflow: "hidden",
});

const StyledDescriptionContainer = styled("div")({
  height: "80px",
  minHeight: "80px",
  maxHeight: "80px",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#888",
    borderRadius: "8px",
    "&:hover": {
      background: "#555",
    },
  },
});

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(1, 3),
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "#f1c40f",
    color: "black",
  },
}));

export default function Profile({ userId }) {
  const [user, setUser] = React.useState(null);
  const [posts, setPosts] = React.useState([]);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [editPost, setEditPost] = React.useState(null);
  const [editDescription, setEditDescription] = React.useState("");
  const [editImageFile, setEditImageFile] = React.useState(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError(err.response?.data?.message || "Failed to load user details");
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/posts", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const userPosts = response.data.filter(post => post.userId === userId);
        setPosts(userPosts);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Failed to load posts");
      }
    };

    if (userId) {
      fetchUser();
      fetchPosts();
    }
    setLoading(false);
  }, [userId]);

  const handleImageUpload = async () => {
    if (!editImageFile) return null;
    const formData = new FormData();
    formData.append("image", editImageFile);
    try {
      const response = await axios.post("http://localhost:8000/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.imageUrl;
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to upload image");
      return null;
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:8000/posts/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
      setError("Failed to delete post");
    }
  };

  const handleUpdatePost = async () => {
    if (!editPost) return;
    let imageUrl = editPost.images && editPost.images[0];
    if (editImageFile) {
      imageUrl = await handleImageUpload();
      if (!imageUrl) return;
    }
    try {
      const response = await axios.patch(
        `http://localhost:8000/posts/${editPost._id}`,
        {
          description: editDescription,
          images: imageUrl ? [imageUrl] : editPost.images,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === editPost._id ? { ...post, ...response.data } : post
        )
      );
      setEditPost(null);
      setEditDescription("");
      setEditImageFile(null);
      setError("");
    } catch (err) {
      console.error("Failed to update post:", err.response?.data?.message || err.message);
      setError("Failed to update post: " + (err.response?.data?.message || err.message));
    }
  };

  const openEditDialog = (post) => {
    setEditPost(post);
    setEditDescription(post.description || "");
    setEditImageFile(null);
  };

  if (loading) {
    return (
      <Box className="flex justify-center my-8">
        <CircularProgress className="text-yellow-400" />
      </Box>
    );
  }

  if (!user) {
    return <Typography className="text-center text-gray-500 text-lg p-4 w-full">Failed to load profile</Typography>;
  }

  return (
    <Box className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-6 px-4 sm:px-6 lg:px-8">
      <Box className="max-w-3xl mx-auto mb-8 bg-white p-6 rounded-2xl shadow-lg">
        <Typography variant="h4" className="text-gray-800 font-bold mb-4">
          Profile
        </Typography>
        <Box className="flex items-center mb-6">
          <img
            src={user.profileImage || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-16 h-16 rounded-full mr-4 object-cover"
          />
          <Typography variant="h6" className="text-gray-800 font-semibold">
            {user.userName}
          </Typography>
        </Box>
      </Box>
      <Typography className="text-center text-gray-700 text-lg font-semibold mb-6">
        Your Posts
      </Typography>
      {posts.length > 0 ? (
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          className="justify-center"
        >
          {posts.map((post) => (
            <Grid item key={post._id} xs={4} sm={4} md={3}>
              <StyledCard>
                <CardMedia
                  sx={{
                    height: "180px",
                    minHeight: "180px",
                    maxHeight: "180px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
                  }}
                  image={post.images && post.images.length > 0 ? post.images[0] : "https://via.placeholder.com/150"}
                  title="Post Image"
                />
                <StyledCardContent>
                  <Typography
                    variant="h6"
                    className="font-bold text-gray-800 mb-2 truncate"
                  >
                    {post.userName}
                  </Typography>
                  <StyledDescriptionContainer>
                    <Typography className="text-gray-600 text-sm leading-relaxed">
                      {post.description || "No description"}
                    </Typography>
                  </StyledDescriptionContainer>
                </StyledCardContent>
                <CardActions className="p-4 justify-center" sx={{ height: "60px", minHeight: "60px", maxHeight: "60px" }}>
                  <StyledButton
                    size="small"
                    variant="contained"
                    className="mr-2 bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => openEditDialog(post)}
                  >
                    Update
                  </StyledButton>
                  <StyledButton
                    size="small"
                    variant="contained"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    Delete
                  </StyledButton>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography className="text-center text-gray-500 text-lg p-4 w-full">
          No posts available
        </Typography>
      )}
      {error && (
        <Typography className="text-center text-red-500 text-sm mt-4">
          {error}
        </Typography>
      )}
      <Dialog open={!!editPost} onClose={() => setEditPost(null)} className="rounded-2xl">
        <DialogTitle className="text-gray-800 font-bold">Edit Post</DialogTitle>
        <DialogContent className="p-6">
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            multiline
            rows={3}
            className="rounded-lg border-gray-300 focus:ring-yellow-400"
            InputProps={{ className: "text-gray-700" }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEditImageFile(e.target.files[0])}
            className="mt-4 text-gray-600"
          />
        </DialogContent>
        <DialogActions className="p-4">
          <StyledButton onClick={() => setEditPost(null)} className="text-gray-600 hover:text-gray-800">
            Cancel
          </StyledButton>
          <StyledButton
            onClick={handleUpdatePost}
            variant="contained"
            className="bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            Save
          </StyledButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}