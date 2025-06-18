import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Share,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {
  Calendar,
  User,
  Share2,
  ArrowLeft,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react-native';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import useBlog from '../../../../hooks/useBlogActions';
import Loading from '../../../../components/common/Loading';
import Button from '../../../../components/common/Button/Button';
import {
  styles,
  getStatusBadgeStyle,
  getStatusBadgeTextStyle,
  getButtonStyle,
  getButtonTextStyle,
  isSmallScreen,
  theme,
} from './styles';

const BlogDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {blogId} = route.params;
  const [isOwner, setIsOwner] = useState(false);

  // Get current user from Redux store
  const {user} = useSelector(state => state.auth);

  const {
    fetchBlogById,
    deleteBlog,
    isLoading,
    isDeleting,
    error,
    currentBlog,
    clearError,
  } = useBlog();

  useEffect(() => {
    if (blogId) {
      clearError();
      fetchBlogById(blogId);
    }
  }, [blogId]);

  useEffect(() => {
    if (currentBlog && user) {
      const blogAuthorId =
        currentBlog.User?.id ||
        currentBlog.author?.id ||
        currentBlog.author?._id;
      const currentUserId = user.id || user._id;
      setIsOwner(blogAuthorId === currentUserId);
    }
  }, [currentBlog, user]);

  const getImageUrl = imagePath => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this blog: ${currentBlog.title}\n\n${
          currentBlog.shortDescription ||
          currentBlog.description?.substring(0, 100) + '...'
        }`,
        title: currentBlog.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDeleteBlog = () => {
    Alert.alert(
      'Delete Blog',
      `Are you sure you want to delete "${currentBlog.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBlog(currentBlog.id || currentBlog._id);
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Blog deleted successfully',
              });
              navigation.goBack();
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

  const handleEditBlog = () => {
    navigation.navigate('EditBlog', {
      blogId: currentBlog.id || currentBlog._id,
    });
  };

  const handleRetry = () => {
    if (blogId) {
      fetchBlogById(blogId);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading message="Loading blog..." />
      </View>
    );
  }

  if (error || !currentBlog) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>{error || 'Blog not found'}</Text>
        <Text style={styles.errorSubtitle}>
          {error
            ? 'Failed to load blog. Please try again.'
            : 'The blog you are looking for does not exist.'}
        </Text>
        <View style={styles.errorActions}>
          <TouchableOpacity
            style={[getButtonStyle('outline'), styles.errorActionLeft]}
            onPress={handleGoBack}>
            <Text style={getButtonTextStyle('outline')}>Go Back</Text>
          </TouchableOpacity>
          {error && (
            <TouchableOpacity
              style={getButtonStyle('primary')}
              onPress={handleRetry}>
              <Text style={getButtonTextStyle('primary')}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  const StatusBadge = ({status}) => (
    <View style={getStatusBadgeStyle(status)}>
      <Text style={getStatusBadgeTextStyle(status)}>
        {status === 'active' ? 'Published' : 'Draft'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleGoBack}
            style={styles.backButton}
            activeOpacity={0.7}>
            <ArrowLeft size={20} color={theme.colors.gray700} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.7}>
            <Share2 size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Featured Image */}
        {(currentBlog.image || currentBlog.imagePath) && (
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: getImageUrl(currentBlog.image || currentBlog.imagePath),
              }}
              style={styles.featuredImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Main Card */}
        <View style={styles.card}>
          <View
            style={[
              styles.cardContent,
              isSmallScreen() && styles.smallScreen.cardContent,
            ]}>
            {/* Owner controls */}
            {isOwner && (
              <View style={styles.ownerControls}>
                <StatusBadge status={currentBlog.status} />
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    onPress={handleEditBlog}
                    style={[styles.actionButton, styles.editButton]}
                    disabled={isDeleting}
                    activeOpacity={0.7}>
                    <Edit size={18} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDeleteBlog}
                    style={[styles.actionButton, styles.deleteButton]}
                    disabled={isDeleting}
                    activeOpacity={0.7}>
                    <Trash2 size={18} color={theme.colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Title */}
            <Text
              style={[
                styles.title,
                isSmallScreen() && styles.smallScreen.title,
              ]}>
              {currentBlog.title}
            </Text>

            {/* Meta Information */}
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <User size={16} color={theme.colors.gray500} />
                <Text style={styles.metaText}>
                  {currentBlog.User?.name ||
                    currentBlog.author?.name ||
                    'Anonymous'}
                </Text>
              </View>

              <View style={styles.metaItem}>
                <Calendar size={16} color={theme.colors.gray500} />
                <Text style={styles.metaText}>
                  {formatDate(currentBlog.createdAt)}
                </Text>
              </View>

              {currentBlog.views && (
                <View style={styles.metaItem}>
                  <Eye size={16} color={theme.colors.gray500} />
                  <Text style={styles.metaText}>{currentBlog.views} views</Text>
                </View>
              )}
            </View>

            {/* Short Description */}
            {currentBlog.shortDescription && (
              <View style={styles.shortDescriptionContainer}>
                <Text style={styles.shortDescriptionText}>
                  {currentBlog.shortDescription}
                </Text>
              </View>
            )}

            {/* Main Content */}
            <View style={styles.contentContainer}>
              <Text style={styles.contentText}>
                {currentBlog.description || currentBlog.content}
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Published on {formatDate(currentBlog.createdAt)}
                {currentBlog.updatedAt !== currentBlog.createdAt && (
                  <Text> • Updated on {formatDate(currentBlog.updatedAt)}</Text>
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          {isOwner ? (
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={[getButtonStyle('outline'), styles.actionButtonLeft]}
                onPress={() => navigation.navigate('MyBlogs')}
                activeOpacity={0.7}>
                <Text style={getButtonTextStyle('outline')}>My Blogs</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  getButtonStyle('primary', isDeleting),
                  styles.actionButtonRight,
                ]}
                onPress={handleEditBlog}
                disabled={isDeleting}
                activeOpacity={0.7}>
                <Text style={getButtonTextStyle('primary')}>Edit Blog</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[getButtonStyle('primary'), styles.singleActionButton]}
              onPress={() => navigation.navigate('BlogList')}
              activeOpacity={0.7}>
              <Text style={getButtonTextStyle('primary')}>
                Back to All Blogs
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default BlogDetailScreen;
