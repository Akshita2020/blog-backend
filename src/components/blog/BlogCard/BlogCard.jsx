import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Calendar, User, Eye, Clock, Tag} from 'lucide-react-native';
import styles from './styles';

const BlogCard = ({blog}) => {
  const navigation = useNavigation();

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getReadingTime = content => {
    if (!content) return '1 min read';
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  const getImageUrl = imagePath => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const handleBlogPress = () => {
    if (!blog._id && !blog.id) {
      console.warn('Blog ID missing');
      return;
    }
    navigation.navigate('BlogDetail', {blogId: blog._id || blog.id, blog});
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleBlogPress}
      activeOpacity={0.8}>
      {/* Blog Image */}
      <View style={styles.imageContainer}>
        {blog.image ? (
          <Image
            source={{uri: getImageUrl(blog.image)}}
            style={styles.blogImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <View style={styles.placeholderContent}>
              <Tag size={48} color="#9CA3AF" />
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          </View>
        )}

        {/* Status Badge */}
        {blog.status && (
          <View style={styles.statusBadgeContainer}>
            <View
              style={[
                styles.statusBadge,
                blog.status === 'active'
                  ? styles.activeBadge
                  : styles.draftBadge,
              ]}>
              <Text
                style={[
                  styles.statusText,
                  blog.status === 'active'
                    ? styles.activeText
                    : styles.draftText,
                ]}>
                {blog.status}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {blog.title}
        </Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={3}>
          {truncateText(
            blog.shortDescription || blog.description || blog.content,
          )}
        </Text>

        {/* Meta Information */}
        <View style={styles.metaContainer}>
          <View style={styles.metaRow}>
            <View style={styles.authorContainer}>
              <User size={16} color="#6B7280" />
              <Text style={styles.authorText}>
                {blog.author?.name || blog.authorName || 'Anonymous'}
              </Text>
            </View>
            <Text style={styles.dateText}>
              {formatDate(blog.createdAt || blog.publishedAt)}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.readingTimeContainer}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.metaText}>
                {getReadingTime(blog.content)}
              </Text>
            </View>
            {blog.views !== undefined && (
              <View style={styles.viewsContainer}>
                <Eye size={14} color="#6B7280" />
                <Text style={styles.metaText}>{blog.views} views</Text>
              </View>
            )}
          </View>
        </View>

        {/* Read More Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.readMoreButton}
            onPress={handleBlogPress}
            activeOpacity={0.8}>
            <Eye size={16} color="#FFFFFF" />
            <Text style={styles.readMoreButtonText}>Read More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BlogCard;
