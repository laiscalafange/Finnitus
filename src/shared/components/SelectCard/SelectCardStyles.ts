import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#7C3AED', // roxo
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#0D0D0D',
  },
  containerSelected: {
    borderColor: '#A3E635', // verde-limão quando marcado
    backgroundColor: 'rgba(163, 230, 53, 0.08)',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  label: {
    color: '#C4B5FD',
    fontSize: 16,
    fontFamily: 'Raleway_600SemiBold',
  },
  labelSelected: {
    color: '#A3E635',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#A3E635',
    borderColor: '#A3E635',
  },
});