import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import 'chats_screen.dart';
import 'feed_screen.dart';
import 'friends_screen.dart';
import 'profile_screen.dart';
import 'create_post_screen.dart';

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int _currentIndex = 0;

  final _screens = const [
    FeedScreen(),
    ChatsScreen(),
    FriendsScreen(),
    ProfileScreen(),
  ];

  void _onTabTapped(int index) {
    if (_currentIndex == index && index == 0) {
      debugPrint('scrollFeedToTop');
    }

    setState(() => _currentIndex = index);
  }

  void _onCreatePost(BuildContext context) {
    Navigator.of(
      context,
    ).push(MaterialPageRoute(builder: (context) => const CreatePostScreen()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F0E8),
      body: IndexedStack(index: _currentIndex, children: _screens),
      bottomNavigationBar: CustomTabBar(
        currentIndex: _currentIndex,
        onTabTapped: _onTabTapped,
        onCreatePost: () => _onCreatePost(context),
      ),
    );
  }
}

class CustomTabBar extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTabTapped;
  final VoidCallback onCreatePost;

  const CustomTabBar({
    super.key,
    required this.currentIndex,
    required this.onTabTapped,
    required this.onCreatePost,
  });

  @override
  Widget build(BuildContext context) {
    final bottomPadding = MediaQuery.of(context).padding.bottom;

    return SafeArea(
      top: false,
      child: Container(
        decoration: const BoxDecoration(
          color: Color(0xFFF1EDE9),
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(36),
            topRight: Radius.circular(36),
          ),
          boxShadow: [
            BoxShadow(
              color: Color(0x14000000),
              offset: Offset(0, -2),
              blurRadius: 10,
            ),
          ],
        ),
        padding: EdgeInsets.only(
          top: 16,
          bottom: bottomPadding > 0 ? bottomPadding : 8,
        ),
        child: Row(
          children: [
            Expanded(
              child: _TabSection(
                asset: 'assets/icons/FeedIcon.svg',
                selected: currentIndex == 0,
                onTap: () => onTabTapped(0),
              ),
            ),
            Expanded(
              child: _TabSection(
                asset: 'assets/icons/ChatsIcon.svg',
                selected: currentIndex == 1,
                onTap: () => onTabTapped(1),
              ),
            ),
            _CreateButton(onTap: onCreatePost),
            Expanded(
              child: _TabSection(
                asset: 'assets/icons/FriendsIcon.svg',
                selected: currentIndex == 2,
                onTap: () => onTabTapped(2),
              ),
            ),
            Expanded(
              child: _TabSection(
                asset: 'assets/icons/ProfileIcon.svg',
                selected: currentIndex == 3,
                onTap: () => onTabTapped(3),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TabSection extends StatelessWidget {
  final String asset;
  final bool selected;
  final VoidCallback onTap;

  static const double _iconSize = 26;

  const _TabSection({
    required this.asset,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final iconColor = const Color(0xFF444444);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 6),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(28),
          onTap: onTap,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 160),
            curve: Curves.easeOut,
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                AnimatedContainer(
                  duration: const Duration(milliseconds: 160),
                  curve: Curves.easeOut,
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: selected
                        ? const Color(0xFFC2C7CD).withOpacity(0.45)
                        : Colors.transparent,
                    shape: BoxShape.circle,
                  ),
                  alignment: Alignment.center,
                  child: SvgPicture.asset(
                    asset,
                    width: _iconSize,
                    height: _iconSize,
                    fit: BoxFit.contain,
                    alignment: Alignment.center,
                    colorFilter: ColorFilter.mode(iconColor, BlendMode.srcIn),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _CreateButton extends StatelessWidget {
  final VoidCallback onTap;

  static const double _iconSize = 26;

  const _CreateButton({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: onTap,
        child: SvgPicture.asset(
          'assets/icons/PostIcon.svg',
          width: _iconSize,
          height: _iconSize,
          fit: BoxFit.contain,
          alignment: Alignment.center,
          colorFilter: const ColorFilter.mode(
            Color(0xFF444444),
            BlendMode.srcIn,
          ),
        ),
      ),
    );
  }
}
