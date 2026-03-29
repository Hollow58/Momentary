import { Platform } from 'react-native';

// Backend URL
const API_BASE = 'https://102722.stu.sd-lab.nl/momentary/backend';
const PC_IP = '102722.stu.sd-lab.nl';

// User
export interface User {
  id: number;
  username: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

// Post
export interface Post {
  id: number;
  user_id: number;
  caption: string;
  image_uri: string | null;
  created_at: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
}

// Shared types
export type FriendRequestStatus = 'pending' | 'accepted' | 'declined';
export type MessageStatus = 'delivered' | 'read';
export type RelationshipState = 'self' | 'friends' | 'incoming' | 'outgoing' | 'none';

// Friend request
export interface FriendRequest {
  id: number;
  from_user_id: number;
  to_user_id: number;
  status: FriendRequestStatus;
  created_at: string;
  updated_at: string;
}

// Friendship
export interface Friendship {
  id: number;
  user_one_id: number;
  user_two_id: number;
  created_at: string;
}

// Message
export interface Message {
  id: number;
  friendship_id: number;
  sender_id: number;
  receiver_id: number;
  body: string;
  status: MessageStatus;
  created_at: string;
}

// Friend request with user info
export interface FriendRequestView extends FriendRequest {
  from_user: User;
  to_user: User;
}

// Chat thread
export interface ChatThread {
  friendship_id: number;
  friend: User;
  last_message: Message | null;
  unread_count: number;
}

// Turn a relative image path into a full URL
export function resolveImageUrl(uri: string | null): string | null {
  if (!uri) return null;
  if (uri.startsWith('http://') || uri.startsWith('https://')) return uri;
  return `https://${PC_IP}${uri}`;
}

// Register a new account
export async function registerUser(
  username: string,
  displayName: string,
  email: string,
  password: string,
): Promise<User> {
  const res = await fetch(`${API_BASE}/register.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      display_name: displayName,
      email,
      password,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data.user;
}

// Log in
export async function loginUser(email: string, password: string): Promise<User> {
  const res = await fetch(`${API_BASE}/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data.user;
}

// Get one user by ID
export async function getUserById(id: number): Promise<User | null> {
  try {
    const res = await fetch(`${API_BASE}/user.php?id=${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}

// Get all users
export async function getAllUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users.php`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load users');
  return Array.isArray(data.users) ? data.users : [];
}

// Upload an image and return the server URL
async function uploadImage(localUri: string): Promise<string> {
  const filename = localUri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const ext = match ? match[1].toLowerCase() : 'jpeg';

  const mimeMap: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    gif: 'image/gif', webp: 'image/webp', bmp: 'image/bmp',
    svg: 'image/svg+xml', tiff: 'image/tiff', tif: 'image/tiff',
    ico: 'image/x-icon', heic: 'image/heic', heif: 'image/heif',
    avif: 'image/avif',
  };
  const mimeType = mimeMap[ext] || 'application/octet-stream';

  const formData = new FormData();

  if (Platform.OS === 'web') {
    const response = await fetch(localUri);
    const blob = await response.blob();
    formData.append('image', blob, filename);
  } else {
    formData.append('image', {
      uri: localUri,
      name: filename,
      type: mimeType,
    } as any);
  }

  const res = await fetch(`${API_BASE}/upload.php`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Image upload failed');
  return data.url;
}

// Update profile fields
export async function updateUser(
  userId: number,
  fields: { display_name?: string; email?: string; avatar_url?: string | null },
): Promise<User> {
  const res = await fetch(`${API_BASE}/user.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: userId, ...fields }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update profile');
  return data.user;
}

// Upload and set a new avatar
export async function updateUserAvatar(userId: number, localUri: string): Promise<User> {
  const serverUrl = await uploadImage(localUri);
  return updateUser(userId, { avatar_url: serverUrl });
}

// Remove avatar
export async function removeUserAvatar(userId: number): Promise<User> {
  const res = await fetch(`${API_BASE}/user.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: userId, action: 'remove_avatar' }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to remove avatar');
  return data.user;
}

// Create a post
export async function createPost(
  userId: number,
  caption: string,
  imageUri: string | null,
): Promise<Post> {
  let serverImageUri: string | null = null;
  if (imageUri) {
    serverImageUri = await uploadImage(imageUri);
  }

  const res = await fetch(`${API_BASE}/posts.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      caption,
      image_uri: serverImageUri,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create post');
  return data.post as Post;
}

// Get all posts for the feed
export async function getFeedPosts(): Promise<Post[]> {
  const res = await fetch(`${API_BASE}/posts.php`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load posts');
  return Array.isArray(data.posts) ? data.posts : [];
}

// Delete a post
export async function deletePost(postId: number, userId: number): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/posts.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: postId, user_id: userId }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.success === true) return;
    throw new Error(data?.error || 'Delete failed');
  } catch {
    const res = await fetch(`${API_BASE}/posts.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', post_id: postId, user_id: userId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Failed to delete post');
  }
}

// Get incoming and outgoing friend requests
export async function getFriendRequests(userId: number): Promise<{ incoming: FriendRequestView[]; outgoing: FriendRequestView[] }> {
  const res = await fetch(`${API_BASE}/friends.php?action=requests&user_id=${userId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load friend requests');
  return { incoming: data.incoming ?? [], outgoing: data.outgoing ?? [] };
}

// Send a friend request
export async function sendFriendRequest(fromUserId: number, toUserId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/friends.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'send_request', from_user_id: fromUserId, to_user_id: toUserId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send friend request');
}

// Accept a friend request
export async function acceptFriendRequest(requestId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/friends.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'accept_request', request_id: requestId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to accept request');
}

// Decline a friend request
export async function declineFriendRequest(requestId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/friends.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'decline_request', request_id: requestId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to decline request');
}

// Cancel a sent request
export async function cancelFriendRequest(requestId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/friends.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'cancel_request', request_id: requestId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to cancel request');
}

// Get relationship status between two users
export async function getRelationshipState(currentUserId: number, otherUserId: number): Promise<RelationshipState> {
  const res = await fetch(`${API_BASE}/friends.php?action=relationship&user_id=${currentUserId}&other_id=${otherUserId}`);
  const data = await res.json();
  if (!res.ok) return 'none';
  return data.state ?? 'none';
}

// Get all chat threads
export async function getChatThreads(userId: number): Promise<ChatThread[]> {
  const res = await fetch(`${API_BASE}/messages.php?action=threads&user_id=${userId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load chat threads');
  return data.threads ?? [];
}

// Get messages between two users
export async function getConversation(userId: number, friendId: number): Promise<Message[]> {
  const res = await fetch(`${API_BASE}/messages.php?action=conversation&user_id=${userId}&friend_id=${friendId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load conversation');
  return data.messages ?? [];
}

// Send a message
export async function sendMessage(senderId: number, receiverId: number, body: string): Promise<Message> {
  const res = await fetch(`${API_BASE}/messages.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender_id: senderId, receiver_id: receiverId, body }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send message');
  return data.message;
}
