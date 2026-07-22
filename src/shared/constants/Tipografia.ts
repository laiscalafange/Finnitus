export const FONTS = {
  raleway: {
    regular:    'Raleway_400Regular',
    medium:     'Raleway_500Medium',
    semibold:   'Raleway_600SemiBold',
    bold:       'Raleway_700Bold',
    extrabold:  'Raleway_800ExtraBold',
  },
  quicksand: {
    regular:    'Quicksand_400Regular',
    medium:     'Quicksand_500Medium',
    semibold:   'Quicksand_600SemiBold',
    bold:       'Quicksand_700Bold',
  },
} as const;

// como usar:
/*
import { FONTS } from '@/shared/components/Tipografia';

<Text style={{ fontFamily: FONTS.raleway.bold, fontSize: 26 }}>
  Dashboard
</Text>

<Text style={{ fontFamily: FONTS.quicksand.regular, fontSize: 14 }}>
  Olá, Maria
</Text>
*/