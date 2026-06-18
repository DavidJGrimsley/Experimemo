import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppText } from '@/components/app-text';
import { SurfaceCard } from '@/components/surface-card';
import { useAppTheme } from '@/theme/provider';

import { onboardingLegalDocuments } from './legal-documents';

export default function OnboardingScreen() {
  const theme = useAppTheme();
  const colors = theme.activeColors;
  const [acceptedAgreement, setAcceptedAgreement] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();
  const canContinue = acceptedAgreement && acceptedTerms;
  const agreementUpdated = useMemo(
    () => new Date(onboardingLegalDocuments.agreement.lastUpdated).toLocaleDateString(),
    []
  );
  const termsUpdated = useMemo(
    () => new Date(onboardingLegalDocuments.terms.lastUpdated).toLocaleDateString(),
    []
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <AppText
          style={{
            color: colors.text,
            fontFamily: theme.typography.fontFamily,
            fontSize: 26,
            fontWeight: '800',
          }}>
          Before you begin
        </AppText>
        <AppText
          style={{
            color: colors.text,
            fontFamily: theme.typography.fontBody,
            fontSize: 15,
            lineHeight: 22,
          }}>
          Review the agreement and terms, then continue into the app once both are accepted.
        </AppText>
      </View>

      <SurfaceCard>
        <View style={styles.cardTopRow}>
          <AppText
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontBody,
              fontSize: 18,
              fontWeight: '800',
            }}>
            Agreement
          </AppText>
          <AppText
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontBody,
              fontSize: 12,
              fontWeight: '700',
            }}>
            {agreementUpdated}
          </AppText>
        </View>
        <AppText
          style={{
            color: colors.text,
            fontFamily: theme.typography.fontBody,
            fontSize: 14,
            lineHeight: 20,
          }}>
          Read the agreement so you know how your use of the app is framed.
        </AppText>
        <View style={styles.cardBottomRow}>
          <AppButton
            label="Read agreement"
            onPress={() => router.push('/onboarding/agreement')}
            style={{
              backgroundColor: colors.background,
              borderColor: colors.primary,
              borderRadius: 999,
              borderWidth: 1,
            }}
            variant="outlined"
          />
          <View style={styles.toggleWrap}>
            <AppText
              style={{
                color: colors.text,
                fontFamily: theme.typography.fontBody,
                fontSize: 13,
                fontWeight: '700',
              }}>
              Accepted
            </AppText>
            <Switch onValueChange={setAcceptedAgreement} value={acceptedAgreement} />
          </View>
        </View>
      </SurfaceCard>

      <SurfaceCard>
        <View style={styles.cardTopRow}>
          <AppText
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontBody,
              fontSize: 18,
              fontWeight: '800',
            }}>
            Terms of service
          </AppText>
          <AppText
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontBody,
              fontSize: 12,
              fontWeight: '700',
            }}>
            {termsUpdated}
          </AppText>
        </View>
        <AppText
          style={{
            color: colors.text,
            fontFamily: theme.typography.fontBody,
            fontSize: 14,
            lineHeight: 20,
          }}>
          Review the service terms before you start saving experiment data.
        </AppText>
        <View style={styles.cardBottomRow}>
          <AppButton
            label="Read terms"
            onPress={() => router.push('/onboarding/terms')}
            style={{
              backgroundColor: colors.background,
              borderColor: colors.primary,
              borderRadius: 999,
              borderWidth: 1,
            }}
            variant="outlined"
          />
          <View style={styles.toggleWrap}>
            <AppText
              style={{
                color: colors.text,
                fontFamily: theme.typography.fontBody,
                fontSize: 13,
                fontWeight: '700',
              }}>
              Accepted
            </AppText>
            <Switch onValueChange={setAcceptedTerms} value={acceptedTerms} />
          </View>
        </View>
      </SurfaceCard>

      <AppButton
        disabled={!canContinue}
        label="Continue"
        onPress={() => {
          if (canContinue) {
            router.push('/onboarding/account-setup');
          }
        }}
        style={{
          backgroundColor: canContinue ? colors.primary : colors.surface,
          borderRadius: 12,
          opacity: canContinue ? 1 : 0.7,
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardBottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  cardTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    gap: 14,
    padding: 20,
    paddingBottom: 28,
  },
  header: {
    gap: 8,
  },
  screen: {
    flex: 1,
  },
  toggleWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});
