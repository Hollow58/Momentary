import 'package:flutter/material.dart';
import 'feed_screen.dart';
 
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
 
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}
 
class _LoginScreenState extends State<LoginScreen> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  String foutmelding = '';
 
  // Nep accounts om te testen
  final Map<String, String> nepAccounts = {
    'test@test.com': '1234',
    'faye@test.com': 'welkom',
    'sude@test.com': 'welkom',
  };
 
  void login() {
    final email = emailController.text.trim();
    final wachtwoord = passwordController.text;
 
    if (email.isEmpty || wachtwoord.isEmpty) {
      setState(() {
        foutmelding = 'Vul je email en wachtwoord in.';
      });
      return;
    }
 
    if (nepAccounts[email] == wachtwoord) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const FeedScreen()),
      );
    } else {
      setState(() {
        foutmelding = 'Email of wachtwoord klopt niet.';
      });
    }
  }
 
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F0E8),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
 
              const Text(
                'Welcome to',
                style: TextStyle(fontSize: 20, color: Colors.black54),
              ),
              const Text(
                'Momentary',
                style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold),
              ),
 
              const SizedBox(height: 48),
 
              TextField(
                controller: emailController,
                decoration: const InputDecoration(
                  hintText: 'Email',
                  border: OutlineInputBorder(),
                  filled: true,
                  fillColor: Colors.white,
                ),
              ),
 
              const SizedBox(height: 16),
 
              TextField(
                controller: passwordController,
                obscureText: true,
                decoration: const InputDecoration(
                  hintText: 'Wachtwoord',
                  border: OutlineInputBorder(),
                  filled: true,
                  fillColor: Colors.white,
                ),
              ),
 
              const SizedBox(height: 12),
 
              if (foutmelding.isNotEmpty)
                Text(
                  foutmelding,
                  style: const TextStyle(color: Colors.red, fontSize: 14),
                ),
 
              const SizedBox(height: 20),
 
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: login,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text(
                    'Login',
                    style: TextStyle(color: Colors.white, fontSize: 16),
                  ),
                ),
              ),
 
              const SizedBox(height: 12),
 
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () {
                    // Later: navigeer naar register scherm
                  },
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text(
                    'Register',
                    style: TextStyle(fontSize: 16),
                  ),
                ),
              ),
 
            ],
          ),
        ),
      ),
    );
  }
}