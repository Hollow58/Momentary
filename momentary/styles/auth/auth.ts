import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  title: {
    fontFamily: 'GildaDisplay_400Regular',
    fontSize: 48,
    color: '#444',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  input: {
    fontFamily: 'Nunito_400Regular',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#444',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: 'Nunito_600SemiBold',
    color: '#fff',
    fontSize: 17,
  },
  linkText: {
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    fontSize: 15,
    color: '#666',
  },
  linkBold: {
    fontWeight: '700',
    color: '#444',
  },
});
