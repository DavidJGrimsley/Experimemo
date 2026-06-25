import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppText } from '@/components/app-text';
import { openExternalLink } from '@/components/external-link';
import { SurfaceCard } from '@/components/surface-card';
import { APP_LINKS } from '@/config/app-links';
import { useAppTheme } from '@/theme/provider';

export default function OnboardingScreen() {
  const theme = useAppTheme();
  const colors = theme.activeColors;
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();
  const canContinue = acceptedPrivacy && acceptedTerms;

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
          Review the privacy policy and terms of service, then continue once both are accepted.
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
            Privacy policy
          </AppText>
        </View>
        <AppText
          style={{
            color: colors.text,
            fontFamily: theme.typography.fontBody,
            fontSize: 14,
            lineHeight: 20,
          }}>
          Read how experimemo handles local experiment data, attached photos, and support requests.
        </AppText>
        <View style={styles.cardBottomRow}>
          <AppButton
            label="Open policy"
            onPress={() => {
              void openExternalLink(APP_LINKS.privacy);
            }}
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
            <Switch onValueChange={setAcceptedPrivacy} value={acceptedPrivacy} />
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
        </View>
        <AppText
          style={{
            color: colors.text,
            fontFamily: theme.typography.fontBody,
            fontSize: 14,
            lineHeight: 20,
          }}>
          Review the live terms before you start saving and updating experiment records.
        </AppText>
        <View style={styles.cardBottomRow}>
          <AppButton
            label="Open terms"
            onPress={() => {
              void openExternalLink(APP_LINKS.terms);
            }}
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
