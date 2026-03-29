import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
// Gradient background
import { LinearGradient } from 'expo-linear-gradient';
// Pick an image from the gallery
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { createPost } from '@/lib/api';
import { styles } from '@/styles/screens/create-post';
import { GRADIENT_COLORS, GRADIENT_LOCATIONS } from '@/styles/global';

// Screen to create a new post
export default function CreatePostScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // Caption text
  const [caption, setCaption] = useState('');
  // Selected image (null if no image)
  const [imageUri, setImageUri] = useState<string | null>(null);
  // Track if post is being sent to server
  const [loading, setLoading] = useState(false);

  // Open image picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    // Save the image if user didn't cancel
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Send post when pressing post 
  const handlePost = async () => {
    // Need at least a caption or image
    if (!caption.trim() && !imageUri) {
      Alert.alert('Error', 'Add a caption or image to post');
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      // Send to the backend
      await createPost(user.id, caption.trim(), imageUri);
      // Go back to feed after posting
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Move screen up when keyboard opens
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Background gradient */}
      <LinearGradient
        colors={[...GRADIENT_COLORS]}
        locations={[...GRADIENT_LOCATIONS]}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
        {/* Cancel, title, and Post button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <TouchableOpacity
            onPress={handlePost}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={[styles.postBtnText, loading && { opacity: 0.5 }]}>
              {loading ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Caption input */}
        <TextInput
          style={styles.captionInput}
          placeholder="What's on your mind?"
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          value={caption}
          onChangeText={setCaption}
        />

        {/* Show selected image with a remove button */}
        {imageUri ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            {/* Remove image button */}
            <TouchableOpacity
              style={styles.removeImage}
              onPress={() => setImageUri(null)}
            >
              <Text style={styles.removeImageText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Add or change the image */}
        <TouchableOpacity style={styles.addImageBtn} onPress={pickImage} activeOpacity={0.7}>
          <Text style={styles.addImageText}>
            {imageUri ? 'Change Image' : '+ Add Image'}
          </Text>
        </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}


