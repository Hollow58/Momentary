import 'package:flutter/material.dart';

import 'chat_screen.dart';

class ChatsScreen extends StatelessWidget {
  const ChatsScreen({super.key});

  final List<Map<String, String>> chats = const [
    {'naam': 'Faye', 'laatste': 'Gang reply to me.', 'emoji': '👧'},

    {
      'naam': 'Sude',
      'laatste': 'Summer weet jij waar ik miss...',
      'emoji': '👩',
    },

    {'naam': 'Tugra', 'laatste': 'Gelezen*', 'emoji': '🧑'},

    {
      'naam': 'Soufyan',
      'laatste': 'Heyy Summer ik heb een vr...',
      'emoji': '🧒',
    },

    {'naam': 'Fabian', 'laatste': 'Hoe gaat het.', 'emoji': '👦'},

    {'naam': 'Guusje', 'laatste': 'Delivered*', 'emoji': '👱'},
  ];

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,

        children: [
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),

            child: Text(
              'Chats',

              style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
            ),
          ),

          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),

              itemCount: chats.length,

              itemBuilder: (context, index) {
                final chat = chats[index];

                return GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,

                      MaterialPageRoute(
                        builder: (context) => ChatScreen(
                          naam: chat['naam']!,
                          emoji: chat['emoji']!,
                        ),
                      ),
                    );
                  },

                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),

                    padding: const EdgeInsets.all(16),

                    decoration: BoxDecoration(
                      color: Colors.white,

                      borderRadius: BorderRadius.circular(16),
                    ),

                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 26,

                          backgroundColor: const Color(0xFFD8D0C0),

                          child: Text(
                            chat['emoji']!,
                            style: const TextStyle(fontSize: 22),
                          ),
                        ),

                        const SizedBox(width: 14),

                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,

                          children: [
                            Text(
                              chat['naam']!,

                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),

                            const SizedBox(height: 2),

                            Text(
                              chat['laatste']!,

                              style: const TextStyle(
                                color: Colors.grey,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
