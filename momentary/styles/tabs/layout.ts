import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tabBarOuter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  tabBar: {
    backgroundColor: '#f1ede9',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 16,
  },
  tabBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 16,
  },
  tabButton: {
    padding: 4,
  },
  tabIconCircle: {
    padding: 10,
    borderRadius: 24,
  },
  tabIconCircleActive: {
    backgroundColor: 'rgba(194, 199, 205, 0.45)',
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 18,
    borderWidth: 4,
    borderColor: '#444444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 160,
    height: 5,
  },
  tabIconWrapper: {
    position: 'relative',
  },
  tabBadgeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#D9534F',
    borderWidth: 1.5,
    borderColor: '#f1ede9',
  },
});
