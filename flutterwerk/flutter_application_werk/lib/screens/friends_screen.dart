import 'package:flutter/material.dart';
import 'feed_screen.dart';
import 'profile_screen.dart';
import 'chats_screen.dart';
 
class FriendsScreen extends StatelessWidget {
  const FriendsScreen({super.key});
 
  final List<Map<String, String>> vrienden = const [
    {'naam': 'Faye', 'emoji': '👧'},
    {'naam': 'Sude', 'emoji': '👩'},
    {'naam': 'Tugra', 'emoji': '🧑'},
    {'naam': 'Soufyan', 'emoji': '🧒'},
    {'naam': 'Fabian', 'emoji': '👦'},
    {'naam': 'Guusje', 'emoji': '👱'},
  ];
 
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F0E8),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
 
            // Titel met profielfoto erbij
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Row(
                children: const [
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: Color(0xFFD8D0C0),
                    child: Text('🧝', style: TextStyle(fontSize: 18)),
                  ),
                  SizedBox(width: 12),
                  Text(
                    'Friends',
                    style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
 
            // Grid van vrienden
            Expanded(
              child: GridView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 1,
                ),
                itemCount: vrienden.length,
                itemBuilder: (context, index) {
                  final vriend = vrienden[index];
                  return Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFEDE8DF),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircleAvatar(
                          radius: 44,
                          backgroundColor: const Color(0xFFD8D0C0),
                          child: Text(
                            vriend['emoji']!,
                            style: const TextStyle(fontSize: 36),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          vriend['naam']!,
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
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
        currentIndex: 3,
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