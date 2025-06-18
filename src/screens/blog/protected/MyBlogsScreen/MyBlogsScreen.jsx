import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  Alert,
  Linking,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  FileText,
} from 'lucide-react-native';
import {useSelector} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import {authService} from '../../../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import useBlog from '../../../../hooks/useBlogActions';
import Loading from '../../../../components/common/LoadingSpinner/LoadingSpinner';
import {
  styles,
  getBadgeStyle,
  getBadgeTextStyle,
  getActionButtonStyle,
  isTablet,
  isSmallScreen,
  theme,
} from './styles';

const STORAGE_KEY = 'myBlogsStatusFilter';

const MyBlogsScreen = () => {
  const navigation = useNavigation();
  const {user, isAuthenticated} = useSelector(state => state.auth);

  const {
    fetchMyBlogs,
    deleteBlog,
    toggleBlogStatus,
    myBlogs,
    isLoading,
    isDeleting,
    isTogglingStatus,
    error,
  } = useBlog();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);


  // Add this useEffect after your existing useEffects
  useEffect(() => {
    const debugAuthState = async () => {
      console.log('MyBlogsScreen: Auth state check:', {
        isAuthenticated,
        hasUser: !!user,
        userId: user?.id,
        userName: user?.name,
      });

      // Check stored token
      const storedData = await authService.getStoredAuthData();
      console.log('MyBlogsScreen: Stored auth data:', storedData);
    };

    debugAuthState();
  }, [isAuthenticated, user]);

  // Update your existing useFocusEffect with more debugging
  useFocusEffect(
    useCallback(() => {
      console.log('MyBlogsScreen: Screen focused, checking auth state');
      console.log('MyBlogsScreen: isAuthenticated:', isAuthenticated);
      console.log('MyBlogsScreen: user:', !!user);

      if (user && isAuthenticated) {
        console.log('MyBlogsScreen: Fetching blogs for user:', user.name);
        fetchMyBlogs();
      } else {
        console.log('MyBlogsScreen: Cannot fetch blogs - auth issue');
      }
    }, [user, isAuthenticated, fetchMyBlogs]),
  );

  // Load saved filter from storage
  useEffect(() => {
    loadSavedFilter();
  }, []);

  // Fetch blogs when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (user && isAuthenticated) {
        fetchMyBlogs();
      }
    }, [user, isAuthenticated, fetchMyBlogs]),
  );

  const loadSavedFilter = async () => {
    try {
      const savedFilter = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedFilter) {
        setStatusFilter(savedFilter);
      }
    } catch (error) {
      console.error('Error loading saved filter:', error);
    }
  };

  const saveFilter = async filter => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, filter);
    } catch (error) {
      console.error('Error saving filter:', error);
    }
  };

  const handleStatusFilterChange = value => {
    setStatusFilter(value);
    saveFilter(value);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchMyBlogs();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteBlog = (blogId, blogTitle) => {
    Alert.alert(
      'Delete Blog',
      `Are you sure you want to delete "${blogTitle}"? This action cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBlog(blogId);
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Blog deleted successfully',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete blog',
              });
            }
          },
        },
      ],
    );
  };

  const handleToggleStatus = async (blogId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'publish' : 'unpublish';

    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Blog`,
      `Are you sure you want to ${action} this blog?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          onPress: async () => {
            try {
              await toggleBlogStatus(blogId, currentStatus);
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: `Blog ${action}ed successfully`,
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: `Failed to ${action} blog`,
              });
            }
          },
        },
      ],
    );
  };

  const handleViewBlog = blogId => {
    navigation.navigate('BlogDetail', {blogId});
  };

  const handleEditBlog = blogId => {
    navigation.navigate('EditBlog', {blogId});
  };

  const getImageUrl = imagePath => {
    if (!imagePath) return null;
    const API_BASE_URL = 'http://localhost:5000'; // Replace with your API base URL
    return imagePath.startsWith('http')
      ? imagePath
      : `${API_BASE_URL}${imagePath}`;
  };

  // Filter blogs based on search and status
  const filteredBlogs = myBlogs.filter(blog => {
    if (!blog || typeof blog !== 'object') {
      return false;
    }

    const title = blog.title || '';
    const content = blog.content || blog.description || '';
    const status = blog.status || '';

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    {label: 'All Status', value: 'all'},
    {label: 'Published', value: 'active'},
    {label: 'Draft', value: 'inactive'},
  ];

  const formatDate = dateString => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderBlogItem = ({item: blog, index}) => (
    <View style={styles.blogCard}>
      <View style={styles.blogCardContent}>
        {/* Blog Header */}
        <View style={styles.blogHeader}>
          {/* Blog Image */}
          {blog.image ? (
            <Image
              source={{uri: getImageUrl(blog.image)}}
              style={styles.blogImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.blogImagePlaceholder}>
              <FileText size={24} color={theme.colors.gray400} />
            </View>
          )}

          {/* Blog Content */}
          <View style={styles.blogContent}>
            <TouchableOpacity
              onPress={() => handleViewBlog(blog._id || blog.id)}>
              <Text style={styles.blogTitle} numberOfLines={2}>
                {blog.title || 'Untitled'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.blogDescription} numberOfLines={2}>
              {blog.shortDescription ||
                (blog.content || blog.description
                  ? `${(blog.content || blog.description).substring(0, 60)}...`
                  : 'No description')}
            </Text>
          </View>
        </View>

        {/* Blog Meta */}
        <View style={styles.blogMeta}>
          <View>
            <TouchableOpacity
              style={getBadgeStyle(
                blog.status === 'active' ? 'success' : 'warning',
              )}
              onPress={() =>
                handleToggleStatus(blog._id || blog.id, blog.status)
              }
              disabled={isTogglingStatus}>
              <Text
                style={getBadgeTextStyle(
                  blog.status === 'active' ? 'success' : 'warning',
                )}>
                {blog.status === 'active' ? 'Published' : 'Draft'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.blogDate}>
              {formatDate(blog.createdAt)}
              {formatTime(blog.createdAt) && ` • ${formatTime(blog.createdAt)}`}
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.blogActions}>
            <TouchableOpacity
              style={getActionButtonStyle('view')}
              onPress={() => handleViewBlog(blog._id || blog.id)}
              activeOpacity={0.7}>
              <Eye size={16} color={theme.colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={getActionButtonStyle('edit')}
              onPress={() => handleEditBlog(blog._id || blog.id)}
              activeOpacity={0.7}>
              <Edit size={16} color={theme.colors.success} />
            </TouchableOpacity>

            <TouchableOpacity
              style={getActionButtonStyle('delete')}
              onPress={() => handleDeleteBlog(blog._id || blog.id, blog.title)}
              disabled={isDeleting || isTogglingStatus}
              activeOpacity={0.7}>
              <Trash2 size={16} color={theme.colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => {
    if (myBlogs.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>No Blogs Yet</Text>
          <Text style={styles.emptyStateDescription}>
            You haven't created any blogs yet. Start writing your first blog
            post!
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => navigation.navigate('CreateBlog')}
            activeOpacity={0.7}>
            <Text style={styles.emptyStateButtonText}>
              Create Your First Blog
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (filteredBlogs.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>
            No Blogs Match Your Filters
          </Text>
          <Text style={styles.emptyStateDescription}>
            Try adjusting your search terms or status filter to find your blogs.
          </Text>
          <TouchableOpacity
            style={[styles.emptyStateButton, styles.emptyStateButtonOutline]}
            onPress={() => {
              setSearchTerm('');
              setStatusFilter('all');
              saveFilter('all');
            }}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.emptyStateButtonText,
                styles.emptyStateButtonTextOutline,
              ]}>
              Clear Filters
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const renderStats = () => {
    if (myBlogs.length === 0) return null;

    const publishedCount = myBlogs.filter(
      blog => blog.status === 'active',
    ).length;
    const draftCount = myBlogs.filter(
      blog => blog.status === 'inactive',
    ).length;

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <Text style={styles.statsLeft}>
            Showing {filteredBlogs.length} of {myBlogs.length} blog(s)
          </Text>
          <View style={styles.statsRight}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Published:</Text>
              <Text style={[styles.statValue, styles.statValueSuccess]}>
                {publishedCount}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Drafts:</Text>
              <Text style={[styles.statValue, styles.statValueWarning]}>
                {draftCount}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateTitle}>Authentication Required</Text>
        <Text style={styles.emptyStateDescription}>
          Please log in to view your blogs
        </Text>
        <TouchableOpacity
          style={styles.emptyStateButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.7}>
          <Text style={styles.emptyStateButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading && myBlogs.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Loading message="Loading your blogs..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateTitle}>Error Loading Blogs</Text>
        <Text style={styles.emptyStateDescription}>
          {error || 'Something went wrong'}
        </Text>
        <TouchableOpacity
          style={styles.emptyStateButton}
          onPress={handleRefresh}
          activeOpacity={0.7}>
          <Text style={styles.emptyStateButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View
            style={[
              styles.headerContent,
              isSmallScreen() && styles.smallScreen.headerContent,
            ]}>
            <View
              style={[
                styles.headerLeft,
                isSmallScreen() && styles.smallScreen.headerLeft,
              ]}>
              <Text
                style={[
                  styles.title,
                  isSmallScreen() && styles.smallScreen.title,
                ]}>
                My Blogs
              </Text>
              <Text style={styles.subtitle}>
                Welcome back, {user.name}! Manage your blog posts
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.createButton,
                isSmallScreen() && styles.smallScreen.createButton,
              ]}
              onPress={() => navigation.navigate('CreateBlog')}
              activeOpacity={0.7}>
              <Plus size={20} color={theme.colors.white} />
              <Text style={styles.createButtonText}>Create New Blog</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterCard}>
          <View
            style={[styles.filterRow, isTablet() && styles.filterRowTablet]}>
            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Search
                size={20}
                color={theme.colors.gray400}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Search blogs..."
                placeholderTextColor={theme.colors.gray400}
              />
            </View>

            {/* Status Filter */}
            <View style={styles.selectContainer}>
              <Picker
                selectedValue={statusFilter}
                onValueChange={handleStatusFilterChange}
                style={styles.selectText}>
                {statusOptions.map(option => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Blogs List */}
        {filteredBlogs.length > 0 ? (
          <FlatList
            data={filteredBlogs}
            renderItem={renderBlogItem}
            keyExtractor={(item, index) =>
              item._id || item.id || index.toString()
            }
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          renderEmptyState()
        )}

        {/* Stats */}
        {renderStats()}
      </ScrollView>
    </View>
  );
};

export default MyBlogsScreen;

