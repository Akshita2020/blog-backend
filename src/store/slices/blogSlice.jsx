import {createSlice} from '@reduxjs/toolkit';

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    blogs: [],
    myBlogs: [],
    currentBlog: null,
    isLoading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalBlogs: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isTogglingStatus: false,
  },
  reducers: {
    setBlogs: (state, action) => {
      state.blogs = action.payload;
      console.log(
        'Redux: setBlogs called with:',
        action.payload.length,
        'blogs',
      );
    },
    setMyBlogs: (state, action) => {
      state.myBlogs = action.payload;
    },
    setCurrentBlog: (state, action) => {
      state.currentBlog = action.payload;
    },
    clearCurrentBlog: state => {
      state.currentBlog = null;
    },
    setPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
      console.log('Redux: setPagination called with:', action.payload);
      console.log('Redux: New pagination state:', state.pagination);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
    // Add specific loading states
    setCreating: (state, action) => {
      state.isCreating = action.payload;
    },
    setUpdating: (state, action) => {
      state.isUpdating = action.payload;
    },
    setDeleting: (state, action) => {
      state.isDeleting = action.payload;
    },
    setTogglingStatus: (state, action) => {
      state.isTogglingStatus = action.payload;
    },
    // Add blog to myBlogs array
    addBlog: (state, action) => {
      state.myBlogs.unshift(action.payload);
    },
    // Update blog in myBlogs array
    updateBlogInList: (state, action) => {
      const index = state.myBlogs.findIndex(
        blog => blog.id === action.payload.id,
      );
      if (index !== -1) {
        state.myBlogs[index] = action.payload;
      }
    },
    // Remove blog from myBlogs array
    removeBlogFromList: (state, action) => {
      state.myBlogs = state.myBlogs.filter(blog => blog.id !== action.payload);
    },
  },
});

export const {
  setBlogs,
  setMyBlogs,
  setCurrentBlog,
  clearCurrentBlog,
  setPagination,
  setLoading,
  setError,
  clearError,
  setCreating,
  setUpdating,
  setDeleting,
  setTogglingStatus,
  addBlog,
  updateBlogInList,
  removeBlogFromList,
} = blogSlice.actions;

export default blogSlice.reducer;
