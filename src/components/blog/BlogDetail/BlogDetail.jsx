// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import {useRoute, useNavigation} from '@react-navigation/native';
// import {
//   ArrowLeft,
//   Calendar,
//   User,
//   Eye,
//   Edit,
//   Trash2,
// } from 'lucide-react-native';
// import Toast from 'react-native-toast-message';
// import api from '../../../services/api';
// import {useCurrentUser, useBlogActions} from '../../../hooks/index';
// import styles from './styles';

// const BlogDetailScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const {id} = route.params;

//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isOwner, setIsOwner] = useState(false);

//   const {user, loading: userLoading} = useCurrentUser();
//   const {deleteBlog, isLoading: isDeleting} = useBlogActions();

//   const getImageUrl = imagePath => {
//     if (!imagePath) return null;
//     if (imagePath.startsWith('http')) return imagePath;
//     return `http://localhost:5000${imagePath}`;
//   };

//   useEffect(() => {
//     fetchBlog();
//   }, [id]);

//   useEffect(() => {
//     if (blog && user && !userLoading) {
//       setIsOwner(blog.author && blog.author._id === user.id);
//     }
//   }, [blog, user, userLoading]);

//   const fetchBlog = async () => {
//     try {
//       const response = await api.get(`/posts/${id}`);
//       if (response.data.success) {
//         const blogData = response.data.data.blog || response.data.data.post;
//         setBlog(blogData);
//       }
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: 'Failed to load blog post',
//       });
//       navigation.goBack();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteBlog = async () => {
//     if (!blog) return;

//     Alert.alert(
//       'Delete Blog',
//       `Are you sure you want to delete "${blog.title}"?`,
//       [
//         {text: 'Cancel', style: 'cancel'},
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             const success = await deleteBlog(blog.id || blog.id, blog.title);
//             if (success) {
//               navigation.navigate('MyBlogs');
//             }
//           },
//         },
//       ],
//     );
//   };

//   const handleEditBlog = () => {
//     navigation.navigate('EditBlog', {blogId: id, blog});
//   };

//   const handleBackPress = () => {
//     if (isOwner) {
//       navigation.navigate('MyBlogs');
//     } else {
//       navigation.navigate('Home');
//     }
//   };

//   const formatDate = dateString => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   if (loading || userLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#3B82F6" />
//         <Text style={styles.loadingText}>Loading blog...</Text>
//       </View>
//     );
//   }

//   if (!blog) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorTitle}>Blog not found</Text>
//         <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
//           <ArrowLeft size={16} color="#3B82F6" />
//           <Text style={styles.backButtonText}>Back to Blogs</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
//           <ArrowLeft size={20} color="#6B7280" />
//           <Text style={styles.backButtonText}>Back to Blogs</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Blog Content */}
//       <View style={styles.blogContainer}>
//         {/* Blog Image */}
//         {blog.image && (
//           <Image
//             source={{uri: getImageUrl(blog.image)}}
//             style={styles.blogImage}
//             resizeMode="cover"
//           />
//         )}

//         <View style={styles.contentContainer}>
//           {/* Owner Controls */}
//           {isOwner && (
//             <View style={styles.ownerControls}>
//               <View
//                 style={[
//                   styles.statusBadge,
//                   blog.status === 'active'
//                     ? styles.publishedBadge
//                     : styles.draftBadge,
//                 ]}>
//                 <Text
//                   style={[
//                     styles.statusText,
//                     blog.status === 'active'
//                       ? styles.publishedText
//                       : styles.draftText,
//                   ]}>
//                   {blog.status === 'active' ? 'Published' : 'Draft'}
//                 </Text>
//               </View>

//               <View style={styles.actionButtons}>
//                 <TouchableOpacity
//                   style={styles.editButton}
//                   onPress={handleEditBlog}>
//                   <Edit size={20} color="#3B82F6" />
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.deleteButton}
//                   onPress={handleDeleteBlog}
//                   disabled={isDeleting}>
//                   <Trash2 size={20} color="#EF4444" />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}

//           {/* Blog Title */}
//           <Text style={styles.blogTitle}>{blog.title}</Text>

//           {/* Blog Meta */}
//           <View style={styles.metaContainer}>
//             <View style={styles.metaItem}>
//               <User size={16} color="#6B7280" />
//               <Text style={styles.metaText}>
//                 {blog.author?.name || 'Anonymous'}
//               </Text>
//             </View>

//             <View style={styles.metaItem}>
//               <Calendar size={16} color="#6B7280" />
//               <Text style={styles.metaText}>{formatDate(blog.createdAt)}</Text>
//             </View>

//             {blog.views && (
//               <View style={styles.metaItem}>
//                 <Eye size={16} color="#6B7280" />
//                 <Text style={styles.metaText}>{blog.views} views</Text>
//               </View>
//             )}
//           </View>

//           {/* Blog Content */}
//           <View style={styles.contentWrapper}>
//             <Text style={styles.blogContent}>
//               {blog.content || blog.description}
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* Bottom Actions */}
//       <View style={styles.bottomActions}>
//         {isOwner ? (
//           <>
//             <TouchableOpacity
//               style={[styles.actionButton, styles.secondaryButton]}
//               onPress={() => navigation.navigate('MyBlogs')}>
//               <Text style={styles.secondaryButtonText}>Back to My Blogs</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.actionButton, styles.primaryButton]}
//               onPress={handleEditBlog}>
//               <Text style={styles.primaryButtonText}>Edit Blog</Text>
//             </TouchableOpacity>
//           </>
//         ) : (
//           <TouchableOpacity
//             style={[styles.actionButton, styles.primaryButton]}
//             onPress={() => navigation.navigate('Home')}>
//             <Text style={styles.primaryButtonText}>Back to All Blogs</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// export default BlogDetailScreen;
