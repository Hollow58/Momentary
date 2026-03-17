import 'package:flutter/material.dart';
import 'feed_screen.dart';
import 'chats_screen.dart';
import 'friends_screen.dart';
 
class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});
 
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F0E8),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
 
              // Profielfoto + naam + bio kaart
              Container(
                margin: const EdgeInsets.all(16),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  children: [
 
                    // Profielfoto
                    const CircleAvatar(
                      radius: 50,
                      backgroundColor: Color(0xFFD8D0C0),
                      child: Text('🧝', style: TextStyle(fontSize: 44)),
                    ),
 
                    const SizedBox(height: 16),
 
                    // Naam
                    const Text(
                      'SUMMER',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, letterSpacing: 2),
                    ),
 
                    // Username
                    const Text(
                      '@KAIZOMIIN',
                      style: TextStyle(fontSize: 14, color: Colors.grey, letterSpacing: 1),
                    ),
 
                    const Divider(height: 24),
 
                    // Bio
                    const Text(
                      'tex test text text bio text',
                      style: TextStyle(fontSize: 14, color: Colors.black54),
                      textAlign: TextAlign.center,
                    ),
 
                    const SizedBox(height: 20),
 
                    // Bewerk profiel knop
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFF0C0),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        'BEWERK PROFIEL',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 2),
                      ),
                    ),
 
                  ],
                ),
              ),
 
              // Tabs: POSTS / AUDIO / TEXTS / MUSIC
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: const Color(0xFFE8E0D0),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: ['POSTS', 'AUDIO', 'TEXTS', 'MUSIC'].map((tab) {
                    return Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        child: Text(
                          tab,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
 
              const SizedBox(height: 16),
 
              // Memories sectie
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
 
                    const Text(
                      'MEMORIES',
                      style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 2, fontSize: 13),
                    ),
 
                    const SizedBox(height: 12),
 
                    // Memory items
                    ...List.generate(2, (index) {
                      return Container(
                        margin: const EdgeInsets.only(bottom: 10),
                        decoration: BoxDecoration(
                          color: const Color(0xFFD0D8E0),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
 
                            // Placeholder afbeelding
                            Container(
                              width: 90,
                              height: 70,
                              decoration: BoxDecoration(
                                color: const Color(0xFFB8C4CC),
                                borderRadius: const BorderRadius.only(
                                  topLeft: Radius.circular(12),
                                  bottomLeft: Radius.circular(12),
                                ),
                              ),
                              child: const Icon(Icons.image_not_supported_outlined, color: Colors.white54),
                            ),
 
                            const SizedBox(width: 12),
 
    // Memory info
                            const Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('MEMORY XYZ', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                Text('DATUM XYZ', style: TextStyle(fontSize: 11, color: Colors.black54)),
                                SizedBox(height: 6),
                                Text('LIEDJE VAN DIE DAG', style: TextStyle(fontSize: 10, color: Colors.black45)),
                              ],
                            ),
 
                          ],
                        ),
                      );
                    }),
 
                  ],
                ),
              ),
 
              const SizedBox(height: 16),
 
            ],
          ),
        ),
      ),
 
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: const Color(0xFFF5F0E8),
        selectedItemColor: Colors.black,
        unselectedItemColor: Colors.grey,
        showSelectedLabels: false,
        showUnselectedLabels: false,
        type: BottomNavigationBarType.fixed,
        currentIndex: 4,
        onTap: (index) {
          if (index == 0) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const FeedScreen()),
            );
          } else if (index == 1) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const ChatsScreen()),
            );
          } else if (index == 3) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const FriendsScreen()),
            );
          }
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
 