import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {Search, X} from 'lucide-react-native';
import useBlog from '../../../hooks/useBlogActions';
import BlogCard from '../BlogCard/BlogCard';
import Pagination from '../Pagination/Pagination';
import styles from './styles';

const BlogList = () => {
  const {blogs, pagination, isLoading, error, fetchPublicBlogs, refreshBlogs} =
    useBlog();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Filter blogs based on search query
  const filterBlogs = useCallback((blogsToFilter, query) => {
    if (!query.trim()) {
      return blogsToFilter;
    }

    const searchTerm = query.toLowerCase().trim();
    return blogsToFilter.filter(blog => {
      const title = blog.title?.toLowerCase() || '';
      const shortDescription = blog.shortDescription?.toLowerCase() || '';

      return (
        title.includes(searchTerm) || shortDescription.includes(searchTerm)
      );
    });
  }, []);

  // Update filtered blogs when blogs or search query changes
  useEffect(() => {
    const filtered = filterBlogs(blogs, searchQuery);
    setFilteredBlogs(filtered);
  }, [blogs, searchQuery, filterBlogs]);


  useEffect(() => {
    fetchPublicBlogs(1, 6);
  }, []);

  const handleSearch = useCallback(() => {
    const trimmedQuery = searchInput.trim();
    setSearchQuery(trimmedQuery);
  }, [searchInput]);

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    setSearchQuery('');
  }, []);

  const handlePageChange = useCallback(
    async newPage => {
      console.log('Changing to page:', newPage);
      await fetchPublicBlogs(newPage, 6);
    },
    [fetchPublicBlogs],
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshBlogs();
      // Clear search when refreshing
      setSearchInput('');
      setSearchQuery('');
    } finally {
      setRefreshing(false);
    }
  }, [refreshBlogs]);

  const renderBlogCard = useCallback(({item}) => {
    return <BlogCard blog={item} />;
  }, []);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search blogs by title or description..."
              value={searchInput}
              onChangeText={setSearchInput}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              placeholderTextColor="#9CA3AF"
            />
            {searchInput.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchInput('')}
                style={styles.clearInputButton}>
                <X size={18} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>

          {searchQuery && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearSearch}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Latest Blogs Title */}
      <View style={styles.titleSection}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? 'Search Results' : 'Latest Blogs'}
        </Text>
        {!isLoading && (
          <Text style={styles.resultsText}>
            {searchQuery ? (
              <>
                Found{' '}
                <Text style={styles.boldText}>{filteredBlogs.length}</Text>{' '}
                blog(s) for "<Text style={styles.boldText}>{searchQuery}</Text>"
                {filteredBlogs.length < blogs.length && (
                  <Text style={styles.subText}>
                    {' '}
                    (filtered from {blogs.length} total)
                  </Text>
                )}
              </>
            ) : (
              <>
                Showing{' '}
                <Text style={styles.boldText}>{pagination.totalBlogs}</Text>{' '}
                active blog(s)
              </>
            )}
          </Text>
        )}
      </View>
    </View>
  );

  const renderFooter = () => {
    // Only show pagination when not searching and there are multiple pages
    if (
      !isLoading &&
      blogs.length > 0 &&
      pagination.totalPages > 1 &&
      !searchQuery.trim()
    ) {
      return (
        <View style={styles.footerContainer}>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
            maxVisiblePages={5}
          />
          <Text style={styles.paginationInfoText}>
            Page <Text style={styles.boldText}>{pagination.currentPage}</Text>{' '}
            of <Text style={styles.boldText}>{pagination.totalPages}</Text> (
            {pagination.totalBlogs} total blog
            {pagination.totalBlogs !== 1 ? 's' : ''})
          </Text>
        </View>
      );
    }
    return <View style={{height: 20}} />; // Add some bottom spacing
  };

  const renderEmpty = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Search size={64} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>
          {searchQuery ? 'No blogs found' : 'No blogs available'}
        </Text>
        <Text style={styles.emptyText}>
          {searchQuery
            ? `We couldn't find any blogs matching "${searchQuery}". Try different keywords.`
            : 'There are no active blogs to display at the moment.'}
        </Text>
        {searchQuery && (
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={handleClearSearch}>
            <Text style={styles.viewAllButtonText}>View All Blogs</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Determine which blogs to display
  const blogsToDisplay = searchQuery.trim() ? filteredBlogs : blogs;

  // Loading state
  if (isLoading && blogs.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading blogs...</Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error && blogs.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchPublicBlogs(1, 6)}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={blogsToDisplay}
        renderItem={renderBlogCard}
        keyExtractor={item => item._id || item.id || String(Math.random())}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />
    </View>
  );
};

export default BlogList;
