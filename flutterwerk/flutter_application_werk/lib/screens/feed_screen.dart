import 'package:flutter/material.dart';
import 'chats_screen.dart';
import 'friends_screen.dart';
import 'profile_screen.dart';
 
class FeedScreen extends StatelessWidget {
  const FeedScreen({super.key});
 
  final List<Map<String, String>> stories = const [
    {'naam': 'You', 'emoji': '🧑'},
    {'naam': 'Sude', 'emoji': '👩'},
    {'naam': 'Faye', 'emoji': '👧'},
    {'naam': 'Summe..', 'emoji': '🧝'},
  ];
 
  final List<Map<String, String>> posts = const [
    {
      'naam': 'Tugra',
      'tijd': '2 seconds ago',
      'tekst': "Ya'll never guess who I saw...",
      'emoji': '🧑',
    },
    {
      'naam': 'Faye',
      'tijd': '10 minutes ago',
      'tekst': 'Wii ball :3',
      'emoji': '👧',
    },
    {
      'naam': 'Sude',
      'tijd': '1 hour ago',
      'tekst': 'goede dag gehad vandaag 🌸',
      'emoji': '👩',
    },
  ];
 
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F0E8),
      body: SafeArea(
        child: Column(
          children: [
 
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Feed',
                    style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
                  ),
                  CircleAvatar(
                    radius: 24,
                    backgroundColor: const Color(0xFFE8E0D0),
                    child: const Icon(Icons.add, size: 28),
                  ),
                ],
              ),
            ),
 
            SizedBox(
              height: 100,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: stories.length,
                itemBuilder: (context, index) {
                  final story = stories[index];
                  return Padding(
                    padding: const EdgeInsets.only(right: 16),
                    child: Column(
                      children: [
                        CircleAvatar(
                          radius: 34,
                          backgroundColor: const Color(0xFFD8D0C0),
                          child: Text(
                            story['emoji']!,
                            style: const TextStyle(fontSize: 28),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(story['naam']!, style: const TextStyle(fontSize: 12)),
                      ],
                    ),
                  );
                },
              ),
            ),
 
            const SizedBox(height: 8),
 
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: posts.length,
                itemBuilder: (context, index) {
                  final post = posts[index];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 22,
                                backgroundColor: const Color(0xFFD8D0C0),
                                child: Text(post['emoji']!, style: const TextStyle(fontSize: 18)),
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    post['naam']!,
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                  ),
                                  Text(
                                    post['tijd']!,
                                    style: const TextStyle(color: Colors.grey, fontSize: 12),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const Divider(height: 20),
                          Text(post['tekst']!, style: const TextStyle(fontSize: 15)),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
 
          ],
        ),
      ),
 
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: const Color(0xFFF5F0E8),
        selectedItemColor: Colors.black,
        unselectedItemColor: Colors.grey,
        showSelectedLabels: false,
        showUnselectedLabels: false,
        type: BottomNavigationBarType.fixed,
        currentIndex: 0,
        onTap: (index) {
          if (index == 1) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const ChatsScreen()),
            );
          } else if (index == 3) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const FriendsScreen()),
            );
          } else if (index == 4) {   Navigator.pushReplacement(     context,     MaterialPageRoute(builder: (context) => const ProfileScreen()),   ); }
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.feed_outlined), label: 'Feed'),
          BottomNavigationBarItem(icon: Icon(Icons.chat_bubble_outline), label: 'Chats'),
          BottomNavigationBarItem(icon: Icon(Icons.add_circle_outline, size: 32), label: 'Nieuw'),
          BottomNavigationBarItem(icon: Icon(Icons.group_outlined), label: 'Vrienden'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profiel'),
        ],
      ),
    );
  }
}
 
 