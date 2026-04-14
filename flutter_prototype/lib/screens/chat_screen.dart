import 'package:flutter/material.dart';
 
class ChatScreen extends StatefulWidget {
  final String naam;
  final String emoji;
 
  const ChatScreen({super.key, required this.naam, required this.emoji});
 
  @override
  State<ChatScreen> createState() => _ChatScreenState();
}
 
class _ChatScreenState extends State<ChatScreen> {
  final berichtController = TextEditingController();
 
  final List<Map<String, dynamic>> berichten = [
    {'tekst': 'heyy!', 'vanMij': false},
    {'tekst': 'hey wat is er?', 'vanMij': true},
    {'tekst': 'gang reply to me lol', 'vanMij': false},
  ];
 
  void stuurBericht() {
    final tekst = berichtController.text.trim();
    if (tekst.isEmpty) return;
 
    setState(() {
      berichten.add({'tekst': tekst, 'vanMij': true});
    });
 
    berichtController.clear();
  }
 
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F0E8),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF5F0E8),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundColor: const Color(0xFFD8D0C0),
              child: Text(widget.emoji, style: const TextStyle(fontSize: 16)),
            ),
            const SizedBox(width: 10),
            Text(
              widget.naam,
              style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
      body: Column(
        children: [
 
          // Berichten lijst
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: berichten.length,
              itemBuilder: (context, index) {
                final bericht = berichten[index];
                final vanMij = bericht['vanMij'] as bool;
 
                return Align(
                  alignment: vanMij ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    constraints: const BoxConstraints(maxWidth: 260),
                    decoration: BoxDecoration(
                      color: vanMij ? Colors.black : Colors.white,
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: Text(
                      bericht['tekst'] as String,
                      style: TextStyle(
                        color: vanMij ? Colors.white : Colors.black,
                        fontSize: 15,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
 
          // Tekstveld onderaan
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            color: const Color(0xFFF5F0E8),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: berichtController,
                    decoration: InputDecoration(
                      hintText: 'Stuur een bericht...',
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                GestureDetector(
                  onTap: stuurBericht,
                  child: const CircleAvatar(
                    radius: 24,
                    backgroundColor: Colors.black,
                    child: Icon(Icons.send, color: Colors.white, size: 20),
                  ),
                ),
              ],
            ),
          ),
 
        ],
      ),
    );
  }
}