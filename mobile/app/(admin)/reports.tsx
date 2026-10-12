import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../constants/theme';
import { applicationService } from '../../services/applicationService';
import { Case } from '../../types';

export default function ReportsScreen() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await applicationService.getCases();
      setCases(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalCases = cases.length;
  const approvedCases = cases.filter((c) => c.status === 'APPROVED' || c.status === 'COMPLETED').length;
  const inProgressCases = cases.filter(
    (c) => c.status === 'IN_PROGRESS' || c.status === 'DOCUMENTS_SUBMITTED' || c.status === 'PENDING_APPROVAL'
  ).length;
  const rejectedCases = cases.filter((c) => c.status === 'REJECTED').length;

  const totalFeeCollected = cases.reduce((acc, c) => acc + (c.fees?.paid || 0), 0);
  const totalFeePending = cases.reduce(
    (acc, c) => acc + ((c.fees?.total || 0) - (c.fees?.paid || 0)),
    0
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadData();
          }}
          colors={[colors.primary]}
        />
      }
    >
      <Text style={styles.title}>Analytics & Reports</Text>
      <Text style={styles.subtitle}>Overview of building applications & revenue</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
          {/* Revenue Summary */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cash-outline" size={20} color={colors.gold} />
              <Text style={styles.sectionTitle}>Fee & Financial Overview</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { backgroundColor: '#F0FDF4' }]}>
                <Text style={styles.statLabel}>Collected Fees</Text>
                <Text style={[styles.statValue, { color: colors.success }]}>
                  ₹{totalFeeCollected.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: '#FEF2F2' }]}>
                <Text style={styles.statLabel}>Pending Balance</Text>
                <Text style={[styles.statValue, { color: colors.danger }]}>
                  ₹{totalFeePending.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          </View>

          {/* Status Breakdown */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="pie-chart-outline" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Application Status Breakdown</Text>
            </View>

            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <View style={[styles.indicator, { backgroundColor: colors.primary }]} />
                <Text style={styles.statusName}>Total Applications</Text>
              </View>
              <Text style={styles.statusCount}>{totalCases}</Text>
            </View>

            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <View style={[styles.indicator, { backgroundColor: colors.success }]} />
                <Text style={styles.statusName}>Approved / Completed</Text>
              </View>
              <Text style={styles.statusCount}>{approvedCases}</Text>
            </View>

            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <View style={[styles.indicator, { backgroundColor: colors.gold }]} />
                <Text style={styles.statusName}>In Progress / Pending</Text>
              </View>
              <Text style={styles.statusCount}>{inProgressCases}</Text>
            </View>

            <View style={styles.statusRow}>
              <View style={styles.indicatorEmpty}>
                <View style={[styles.indicator, { backgroundColor: colors.danger }]} />
                <Text style={styles.statusName}>Rejected</Text>
              </View>
              <Text style={styles.statusCount}>{rejectedCases}</Text>
            </View>
          </View>

          {/* Operational Efficiency */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="checkmark-done-circle-outline" size={20} color={colors.deepBlue} />
              <Text style={styles.sectionTitle}>Performance Rates</Text>
            </View>

            <View style={styles.metricItem}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricTitle}>Approval Rate</Text>
                <Text style={styles.metricPercent}>
                  {totalCases > 0 ? Math.round((approvedCases / totalCases) * 100) : 0}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${totalCases > 0 ? Math.round((approvedCases / totalCases) * 100) : 0}%`,
                      backgroundColor: colors.success,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statBox: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  indicatorEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  statusCount: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  metricItem: {
    marginTop: spacing.xs,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  metricPercent: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.success,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
