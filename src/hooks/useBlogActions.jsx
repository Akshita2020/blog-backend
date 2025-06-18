import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {Alert} from 'react-native';
import blogService from '../services/blogService'; // This should now work
import {
  setLoading,
  setError,
  clearError,
  setMyBlogs,
  setCurrentBlog,
  setBlogs,
  setPagination,
} from '../store/slices/blogSlice';
import {blogSchema, imageSchema} from '../Validation/validation';

const useBlogActions = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {isLoading, error, myBlogs, blogs, currentBlog, pagination} =
    useSelector(state => state.blog);

  const handleValidationError = error => {
    if (error.errors) {
      const firstError = error.errors[0];
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: firstError.message,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Validation Failed',
        text2: 'Please check your input data',
      });
    }
  };

  const prepareBlogData = blogData => ({
    title: blogData.title?.trim(),
    shortDescription: blogData.shortDescription?.trim() || '',
    description: blogData.description?.trim(),
    status: blogData.status || 'active',
    category: blogData.category?.trim() || '',
    tags: blogData.tags || [],
  });

  const createBlog = async (blogData, imageUri) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const preparedData = prepareBlogData(blogData);
      const validatedBlogData = blogSchema.parse(preparedData);

      if (imageUri) {
        imageSchema.parse({file: {uri: imageUri}});
      }

      const result = await blogService.createBlog(validatedBlogData, imageUri);

      if (result.success || result.data) {
        // Refresh my blogs list
        const myBlogsResult = await blogService.getMyBlogs();
        dispatch(setMyBlogs(myBlogsResult.blogs || []));

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Blog created successfully!',
        });

        navigation.navigate('MyBlogs');
      } else {
        throw new Error(result.message || 'Failed to create blog');
      }
    } catch (err) {
      console.error('Create blog error:', err);

      if (err.name === 'ZodError') {
        handleValidationError(err);
      } else {
        const errorMessage =
          err.response?.data?.message || err.message || 'Failed to create blog';
        dispatch(setError(errorMessage));
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMessage,
        });
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateBlog = async (id, blogData, imageUri) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const preparedData = prepareBlogData(blogData);
      const validatedBlogData = blogSchema.parse(preparedData);

      if (imageUri) {
        imageSchema.parse({file: {uri: imageUri}});
      }

      const updateData = {
        ...validatedBlogData,
        removeImage: blogData.removeImage || false,
      };

      const result = await blogService.updateBlog(id, updateData, imageUri);

      if (result.success || result.data) {
        // Refresh my blogs list
        const myBlogsResult = await blogService.getMyBlogs();
        dispatch(setMyBlogs(myBlogsResult.blogs || []));

        // Update current blog if it's the same one
        if (result.data?.blog) {
          dispatch(setCurrentBlog(result.data.blog));
        }

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Blog updated successfully!',
        });

        navigation.navigate('MyBlogs');
      } else {
        throw new Error(result.message || 'Failed to update blog');
      }
    } catch (err) {
      console.error('Update blog error:', err);

      if (err.name === 'ZodError') {
        handleValidationError(err);
      } else {
        const errorMessage =
          err.response?.data?.message || err.message || 'Failed to update blog';
        dispatch(setError(errorMessage));
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMessage,
        });
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteBlog = async (blogId, blogTitle) => {
    return new Promise(resolve => {
      Alert.alert(
        'Delete Blog',
        `Are you sure you want to delete "${blogTitle}"? This action cannot be undone.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                dispatch(setLoading(true));
                dispatch(clearError());

                const result = await blogService.deleteBlog(blogId);

                if (result.success || result.message?.includes('deleted')) {
                  // Refresh my blogs list
                  const myBlogsResult = await blogService.getMyBlogs();
                  dispatch(setMyBlogs(myBlogsResult.blogs || []));

                  Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Blog deleted successfully!',
                  });

                  resolve(true);
                } else {
                  throw new Error(result.message || 'Failed to delete blog');
                }
              } catch (err) {
                console.error('Delete blog error:', err);

                const errorMessage =
                  err.response?.data?.message ||
                  err.message ||
                  'Failed to delete blog';
                dispatch(setError(errorMessage));
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: errorMessage,
                });

                resolve(false);
              } finally {
                dispatch(setLoading(false));
              }
            },
          },
        ],
      );
    });
  };

  const toggleBlogStatus = async (blogId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'; // Changed from 'draft' to 'inactive'
    const action = newStatus === 'active' ? 'activate' : 'deactivate';

    return new Promise(resolve => {
      Alert.alert(
        'Change Blog Status',
        `Are you sure you want to ${action} this blog?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: action.charAt(0).toUpperCase() + action.slice(1),
            onPress: async () => {
              try {
                dispatch(setLoading(true));
                dispatch(clearError());

                const result = await blogService.updateBlogStatus(
                  blogId,
                  newStatus,
                );

                if (result.success || result.data) {
                  // Refresh my blogs list
                  const myBlogsResult = await blogService.getMyBlogs();
                  dispatch(setMyBlogs(myBlogsResult.blogs || []));

                  Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Blog status updated successfully!',
                  });

                  resolve(true);
                } else {
                  throw new Error(
                    result.message || 'Failed to update blog status',
                  );
                }
              } catch (err) {
                console.error('Update blog status error:', err);

                const errorMessage =
                  err.response?.data?.message ||
                  err.message ||
                  'Failed to update blog status';
                dispatch(setError(errorMessage));
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: errorMessage,
                });

                resolve(false);
              } finally {
                dispatch(setLoading(false));
              }
            },
          },
        ],
      );
    });
  };

  const fetchMyBlogs = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const result = await blogService.getMyBlogs();
      dispatch(setMyBlogs(result.blogs || []));
    } catch (err) {
      console.error('Fetch my blogs error:', err);

      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to fetch blogs';
      dispatch(setError(errorMessage));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchBlogById = async blogId => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const result = await blogService.getBlogById(blogId);

      if (result.success || result.data) {
        const blog = result.data?.blog || result.blog || result;
        dispatch(setCurrentBlog(blog));
        return blog;
      } else {
        throw new Error(result.message || 'Failed to fetch blog');
      }
    } catch (err) {
      console.error('Fetch blog error:', err);

      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to fetch blog';
      dispatch(setError(errorMessage));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });

      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
  const fetchPublicBlogs = useCallback(
    async (page = 1, limit = 6, showToast = true) => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());

        console.log('=== FETCH PUBLIC BLOGS DEBUG ===');
        console.log('Fetching page:', page, 'limit:', limit);

        const result = await blogService.fetchAllBlogs(page, limit);
        console.log('API Response:', result);

        if (result.success !== false) {
          // Extract from the correct nested structure
          const responseData = result.data || result;
          const blogsData = responseData.blogs || [];
          const paginationFromAPI = responseData.pagination || {};

          // Use the pagination data directly from backend
          const paginationData = {
            currentPage: paginationFromAPI.currentPage || page,
            totalPages: paginationFromAPI.totalPages || 1,
            totalBlogs: paginationFromAPI.totalBlogs || blogsData.length,
            hasNextPage: paginationFromAPI.hasNextPage || false,
            hasPrevPage: paginationFromAPI.hasPrevPage || false,
            limit: paginationFromAPI.limit || limit,
          };

          console.log('Processed blogs data:', blogsData.length);
          console.log('Processed pagination data:', paginationData);

          // If it's page 1, replace blogs; otherwise append for infinite scroll
          if (page === 1) {
            dispatch(setBlogs(blogsData));
          } else {
            dispatch(setBlogs([...blogs, ...blogsData]));
          }

          dispatch(setPagination(paginationData));

          console.log('=== END FETCH PUBLIC BLOGS DEBUG ===');

          return {
            success: true,
            blogs: blogsData,
            pagination: paginationData,
          };
        } else {
          throw new Error(result.message || 'Failed to fetch blogs');
        }
      } catch (err) {
        console.error('Fetch public blogs error:', err);

        const errorMessage =
          err.response?.data?.message || err.message || 'Failed to fetch blogs';

        dispatch(setError(errorMessage));

        if (showToast) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: errorMessage,
          });
        }

        return {
          success: false,
          error: errorMessage,
          blogs: [],
          pagination: {currentPage: 1, totalPages: 1, totalBlogs: 0},
        };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, blogs],
  );

  const loadMoreBlogs = useCallback(async () => {
    if (pagination.currentPage < pagination.totalPages && !isLoading) {
      const nextPage = pagination.currentPage + 1;
      return await fetchPublicBlogs(nextPage, 6, false);
    }
    return {success: false, error: 'No more blogs to load'};
  }, [pagination, isLoading, fetchPublicBlogs]);

  const refreshBlogs = useCallback(async () => {
    return await fetchPublicBlogs(1, 6, false);
  }, [fetchPublicBlogs]);

  const searchBlogs = useCallback(
    async (query, page = 1, limit = 6) => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());

        console.log('=== SEARCH BLOGS DEBUG ===');
        console.log('Search query:', query, 'page:', page, 'limit:', limit);

        const result = await blogService.searchBlogs(query, page, limit);
        console.log('Search API Response:', result);

        if (result.success !== false) {
          // Extract from the correct nested structure
          const responseData = result.data || result;
          const blogsData = responseData.blogs || [];
          const paginationFromAPI = responseData.pagination || {};

          // Use the pagination data directly from backend
          const paginationData = {
            currentPage: paginationFromAPI.currentPage || page,
            totalPages: paginationFromAPI.totalPages || 1,
            totalBlogs: paginationFromAPI.totalBlogs || blogsData.length,
            hasNextPage: paginationFromAPI.hasNextPage || false,
            hasPrevPage: paginationFromAPI.hasPrevPage || false,
            limit: paginationFromAPI.limit || limit,
          };

          console.log('Search processed blogs data:', blogsData.length);
          console.log('Search processed pagination data:', paginationData);

          dispatch(setBlogs(blogsData));
          dispatch(setPagination(paginationData));
          console.log('=== END SEARCH BLOGS DEBUG ===');

          return {
            success: true,
            blogs: blogsData,
            pagination: paginationData,
          };
        } else {
          throw new Error(result.message || 'Search failed');
        }
      } catch (err) {
        console.error('Search blogs error:', err);

        const errorMessage =
          err.response?.data?.message || err.message || 'Search failed';

        dispatch(setError(errorMessage));
        Toast.show({
          type: 'error',
          text1: 'Search Error',
          text2: errorMessage,
        });

        return {
          success: false,
          error: errorMessage,
          blogs: [],
          pagination: {currentPage: 1, totalPages: 1, totalBlogs: 0},
        };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  return {
    // Actions
    createBlog,
    updateBlog,
    deleteBlog,
    toggleBlogStatus,
    fetchMyBlogs,
    fetchBlogById,
    fetchPublicBlogs,
    loadMoreBlogs,
    refreshBlogs,

    // State
    isLoading,
    error,
    myBlogs,
    blogs,
    currentBlog,
    pagination,

    // Utility
    clearError: () => dispatch(clearError()),
    hasMoreBlogs: pagination.currentPage < pagination.totalPages,
  };
};

export default useBlogActions;
