import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { SurfaceCard } from '@/components/surface-card';
import { useAppTheme } from '@/theme/provider';

import type { LegalDocument } from '../legal-documents';

interface LegalDocumentViewProps {
  document: LegalDocument;
}

function LegalDocumentMeta({ label, value }: { label: string; value: string }) {
  const theme = useAppTheme();
  const colors = theme.activeColors;

  return (
    <View
      style={[
        styles.metaItem,
        {
          backgroundColor: colors.surface,
          borderColor: colors.primary,
        },
      ]}>
      <AppText
        style={{
          color: colors.text,
          fontFamily: theme.typography.fontBody,
          fontSize: 11,
          fontWeight: '700',
        }}>
        {label.toUpperCase()}
      </AppText>
      <AppText
        style={{
          color: colors.text,
          fontFamily: theme.typography.fontBody,
          fontSize: 13,
          fontWeight: '700',
        }}>
        {value}
      </AppText>
    </View>
  );
}

function LegalSectionItem({ title, body }: { title: string; body: string }) {
  const theme = useAppTheme();
  const colors = theme.activeColors;

  return (
    <SurfaceCard>
      <AppText
        style={{
          color: colors.text,
          fontFamily: theme.typography.fontBody,
          fontSize: 17,
          fontWeight: '800',
        }}>
        {title}
      </AppText>
      <AppText
        style={{
          color: colors.text,
          fontFamily: theme.typography.fontBody,
          fontSize: 14,
          lineHeight: 21,
        }}>
        {body}
      </AppText>
    </SurfaceCard>
  );
}

export function LegalDocumentView({ document }: LegalDocumentViewProps) {
  const theme = useAppTheme();
  const colors = theme.activeColors;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppText
        style={{
          color: colors.text,
          fontFamily: theme.typography.fontFamily,
          fontSize: 28,
          fontWeight: '800',
        }}>
        {document.title}
      </AppText>
      <AppText
        style={{
          color: colors.text,
          fontFamily: theme.typography.fontBody,
          fontSize: 15,
          lineHeight: 22,
        }}>
        {document.summary}
      </AppText>
      <View style={styles.metaRow}>
        <LegalDocumentMeta label="Effective" value={document.effectiveDate} />
        <LegalDocumentMeta label="Last updated" value={document.lastUpdated} />
      </View>
      {document.sections.map((section) => (
        <LegalSectionItem body={section.body} key={section.id} title={section.title} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    padding: 20,
    paddingBottom: 28,
  },
  metaItem: {
    borderRadius: 10,
    borderWidth: 1,
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  screen: {
    flex: 1,
  },
});
