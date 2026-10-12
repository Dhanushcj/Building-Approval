import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { MobileHeader } from '../../components/MobileHeader';
import { Colors } from '../../constants/theme';
import { applicationService } from '../../services/applicationService';
import { Ionicons } from '@expo/vector-icons';

export default function NewApplicationScreen() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState('BUILDING_PLAN_APPROVAL');

  const [address, setAddress] = useState('');
  const [village, setVillage] = useState('');
  const [taluk, setTaluk] = useState('');
  const [surveyNo, setSurveyNo] = useState('');
  const [jurisdiction, setJurisdiction] = useState('DTCP');

  const handleNext = () => {
    if (step === 1) {
      if (!customerName.trim() || !mobile.trim()) {
        Alert.alert('Required Fields', 'Please enter customer name and mobile number.');
        return;
      }
      setStep(2);
    }
  };

  const handleSubmit = async (isPartial = false) => {
    setSubmitting(true);
    try {
      const now = new Date();
      const yy = String(now.getFullYear()).slice(-2);
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const rand = Math.floor(100 + Math.random() * 900);
      const appNumber = `APP-${yy}${mm}${dd}-${rand}`;

      const payload = {
        application_number: appNumber,
        approval_type: serviceType,
        status: isPartial ? 'Draft' : 'Submitted',
        property: {
          owner_name: customerName,
          owner_phone: mobile,
          owner_email: email,
          address: address || 'Site Address',
          village: village || 'Local Area',
          taluk: taluk || 'Taluk Area',
          survey_number: surveyNo || 'TBD',
          jurisdiction: jurisdiction,
        },
        fullData: {
          customerName,
          mobile,
          email,
          serviceType,
          propertyDetails: {
            address,
            village,
            taluk,
            surveyNo,
            jurisdiction,
          },
        },
      };

      const res = await applicationService.create(payload as any);
      if (res.data) {
        Alert.alert(
          'Success',
          `Application ${appNumber} ${isPartial ? 'saved as Draft' : 'created successfully'}!`,
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(admin)/applications'),
            },
          ]
        );
      } else {
        Alert.alert('Submission Error', res.error || 'Failed to submit application.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <MobileHeader title="New Application" showBack />

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]}>
          <Text style={[styles.stepDotText, step >= 1 && styles.stepDotTextActive]}>1</Text>
        </View>
        <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
        <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]}>
          <Text style={[styles.stepDotText, step >= 2 && styles.stepDotTextActive]}>2</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {step === 1 ? (
          <View style={styles.formCard}>
            <Text style={styles.cardHeading}>Step 1: Applicant & Service Info</Text>

            <Text style={styles.label}>Applicant Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Ramesh Kumar"
              value={customerName}
              onChangeText={setCustomerName}
            />

            <Text style={styles.label}>Mobile Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 9876543210"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
            />

            <Text style={styles.label}>Email Address (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. applicant@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Service / Approval Type</Text>
            <View style={styles.chipRow}>
              {[
                { label: 'Building Plan', val: 'BUILDING_PLAN_APPROVAL' },
                { label: 'Layout Approval', val: 'LAYOUT_APPROVAL' },
                { label: 'Patta Transfer', val: 'PATTA_TRANSFER' },
              ].map(item => (
                <TouchableOpacity
                  key={item.val}
                  style={[styles.typeChip, serviceType === item.val && styles.typeChipActive]}
                  onPress={() => setServiceType(item.val)}
                >
                  <Text style={[styles.typeChipText, serviceType === item.val && styles.typeChipTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
              <Text style={styles.primaryButtonText}>Next: Property Details →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.cardHeading}>Step 2: Property & Site Details</Text>

            <Text style={styles.label}>Site Door / Street Address</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Plot No 12, Gandhi Nagar"
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.label}>Village / Area</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Shoolagiri"
              value={village}
              onChangeText={setVillage}
            />

            <Text style={styles.label}>Taluk / District</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Krishnagiri"
              value={taluk}
              onChangeText={setTaluk}
            />

            <Text style={styles.label}>Survey Number</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 142/2A"
              value={surveyNo}
              onChangeText={setSurveyNo}
            />

            <Text style={styles.label}>Jurisdiction</Text>
            <View style={styles.chipRow}>
              {['DTCP', 'TOWN_PANCHAYAT', 'PANCHAYAT_UNION'].map(j => (
                <TouchableOpacity
                  key={j}
                  style={[styles.typeChip, jurisdiction === j && styles.typeChipActive]}
                  onPress={() => setJurisdiction(j)}
                >
                  <Text style={[styles.typeChipText, jurisdiction === j && styles.typeChipTextActive]}>
                    {j.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setStep(1)}
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.draftButton}
                onPress={() => handleSubmit(true)}
                disabled={submitting}
              >
                <Text style={styles.draftButtonText}>Save Draft</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => handleSubmit(false)}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitBtnText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: Colors.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.bgSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: {
    backgroundColor: Colors.primary,
  },
  stepDotText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  stepDotTextActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    width: 60,
    height: 3,
    backgroundColor: Colors.bgSecondary,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: Colors.primary,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    backgroundColor: Colors.bgPrimary,
  },
  typeChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  typeChipTextActive: {
    color: '#FFFFFF',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    height: 46,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  },
  backButton: {
    flex: 1,
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.textSecondary,
    fontWeight: '700',
    fontSize: 13,
  },
  draftButton: {
    flex: 1,
    height: 46,
    borderRadius: 8,
    backgroundColor: Colors.bgSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  draftButtonText: {
    color: Colors.primaryDark,
    fontWeight: '700',
    fontSize: 13,
  },
  submitBtn: {
    flex: 1.5,
    height: 46,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
