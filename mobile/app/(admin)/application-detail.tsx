import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  Linking,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { MobileHeader } from '../../components/MobileHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { Colors } from '../../constants/theme';
import { applicationService } from '../../services/applicationService';
import { uploadToCloudinary } from '../../services/uploadService';
import { Case } from '../../types';
import { Ionicons } from '@expo/vector-icons';

const REQUIRED_DOCS = [
  'SALE DEED',
  'PATTA',
  'FMB',
  'PAN CARD',
  'AADHAR CARD',
  'CUSTOMER PHOTOGRAPH',
  'CUSTOMER SIGNATURE',
  'BUILDING PLAN',
  'RECEIPT',
  'FINAL_APPROVAL',
];

export default function ApplicationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  // Status Modal
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      const res = await applicationService.getById(id);
      if (res.data) setCaseData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handlePickDocument = async (docType: string) => {
    Alert.alert(
      `Upload ${docType}`,
      'Choose source to attach document:',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const perm = await ImagePicker.requestCameraPermissionsAsync();
            if (!perm.granted) {
              Alert.alert('Permission Denied', 'Camera access is required to take document photos.');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              quality: 0.8,
            });
            if (!result.canceled && result.assets[0]) {
              processUpload(docType, result.assets[0].uri, `${docType.toLowerCase().replace(/ /g, '_')}.jpg`);
            }
          },
        },
        {
          text: 'Gallery / Photos',
          onPress: async () => {
            const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!perm.granted) {
              Alert.alert('Permission Denied', 'Photo library access is required.');
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              quality: 0.8,
            });
            if (!result.canceled && result.assets[0]) {
              processUpload(docType, result.assets[0].uri, `${docType.toLowerCase().replace(/ /g, '_')}.jpg`);
            }
          },
        },
        {
          text: 'Browse PDF / File',
          onPress: async () => {
            const result = await DocumentPicker.getDocumentAsync({
              type: ['application/pdf', 'image/*'],
              copyToCacheDirectory: true,
            });
            if (!result.canceled && result.assets[0]) {
              processUpload(docType, result.assets[0].uri, result.assets[0].name);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const processUpload = async (docType: string, fileUri: string, fileName: string) => {
    if (!caseData) return;
    setUploadingDoc(docType);

    try {
      const uploadRes = await uploadToCloudinary(fileUri, fileName);
      if (!uploadRes.url) {
        Alert.alert('Upload Failed', uploadRes.error || 'Could not upload file to Cloudinary.');
        return;
      }

      const updatedFiles = {
        ...(caseData.uploadedFiles || {}),
        [docType]: uploadRes.url,
      };

      const updateRes = await applicationService.update(caseData.id, {
        uploadedFiles: updatedFiles,
      });

      if (updateRes.data) {
        setCaseData(updateRes.data);
        Alert.alert('Success', `${docType} attached and saved to MongoDB!`);
      } else {
        Alert.alert('Save Error', updateRes.error || 'Failed to update case in MongoDB.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Error occurred while saving file.');
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleChangeStatus = async (newStatus: string) => {
    if (!caseData) return;
    setUpdatingStatus(true);
    try {
      const res = await applicationService.update(caseData.id, { status: newStatus });
      if (res.data) {
        setCaseData(res.data);
        setStatusModalVisible(false);
        Alert.alert('Status Updated', `Application status changed to ${newStatus}.`);
      } else {
        Alert.alert('Update Failed', res.error || 'Failed to update status.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!caseData) {
    return (
      <View style={styles.container}>
        <MobileHeader title="Application Details" showBack />
        <View style={[styles.center, { padding: 20 }]}>
          <Text style={{ color: Colors.textSecondary }}>Application not found.</Text>
        </View>
      </View>
    );
  }

  const uploadedFiles = caseData.uploadedFiles || {};

  return (
    <View style={styles.container}>
      <MobileHeader title={caseData.application_number || caseData.id} showBack />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status & Action Banner */}
        <View style={styles.statusBanner}>
          <View>
            <Text style={styles.bannerLabel}>Current Status</Text>
            <View style={{ marginTop: 4 }}>
              <StatusBadge status={caseData.status} />
            </View>
          </View>
          <TouchableOpacity
            style={styles.changeStatusBtn}
            onPress={() => setStatusModalVisible(true)}
          >
            <Text style={styles.changeStatusBtnText}>Update Status</Text>
          </TouchableOpacity>
        </View>

        {/* Applicant Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Applicant Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Owner Name:</Text>
            <Text style={styles.infoValue}>
              {caseData.property?.owner_name || caseData.fullData?.customerName || 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mobile Number:</Text>
            <Text style={styles.infoValue}>
              {caseData.property?.owner_phone || caseData.fullData?.mobile || 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>
              {caseData.property?.owner_email || caseData.fullData?.email || 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Service Type:</Text>
            <Text style={styles.infoValue}>{caseData.approval_type || 'Building Plan'}</Text>
          </View>
        </View>

        {/* Site Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Property & Site Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{caseData.property?.address || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Village / Area:</Text>
            <Text style={styles.infoValue}>{caseData.property?.village || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Taluk:</Text>
            <Text style={styles.infoValue}>{caseData.property?.taluk || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Survey Number:</Text>
            <Text style={styles.infoValue}>{caseData.property?.survey_number || 'N/A'}</Text>
          </View>
        </View>

        {/* Document Checklist & Uploads */}
        <View style={styles.sectionCard}>
          <View style={styles.docHeaderRow}>
            <Text style={styles.sectionHeader}>Documents Checklist</Text>
            <Text style={styles.docCount}>
              {Object.keys(uploadedFiles).length} / {REQUIRED_DOCS.length}
            </Text>
          </View>

          {REQUIRED_DOCS.map(docKey => {
            const isUploaded = !!uploadedFiles[docKey];
            const isUploadingThis = uploadingDoc === docKey;

            return (
              <View key={docKey} style={styles.docItem}>
                <View style={styles.docItemLeft}>
                  <Ionicons
                    name={isUploaded ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={isUploaded ? Colors.successGreen : Colors.textMuted}
                  />
                  <Text style={styles.docName}>{docKey}</Text>
                </View>

                <View style={styles.docItemRight}>
                  {isUploadingThis ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : isUploaded ? (
                    <TouchableOpacity
                      style={styles.viewDocBtn}
                      onPress={() => Linking.openURL(uploadedFiles[docKey])}
                    >
                      <Ionicons name="eye-outline" size={16} color={Colors.primary} />
                      <Text style={styles.viewDocText}>View</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.uploadDocBtn}
                      onPress={() => handlePickDocument(docKey)}
                    >
                      <Ionicons name="cloud-upload-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.uploadDocText}>Upload</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Status Modal */}
      <Modal visible={statusModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Application Status</Text>
            {[
              'Draft',
              'Submitted',
              'DOCUMENTS_VERIFIED',
              'SUBMITTED_FOR_APPROVAL',
              'Under Review',
              'Gov Verification',
              'Site Inspection',
              'Approved',
              'Completed',
              'Rejected',
            ].map(st => (
              <TouchableOpacity
                key={st}
                style={styles.statusOption}
                onPress={() => handleChangeStatus(st)}
                disabled={updatingStatus}
              >
                <Text style={styles.statusOptionText}>{st.replace(/_/g, ' ')}</Text>
                {caseData.status === st && (
                  <Ionicons name="checkmark" size={18} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setStatusModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  statusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bgSurface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  bannerLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  changeStatusBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  changeStatusBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  sectionCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '700',
    maxWidth: '60%',
    textAlign: 'right',
  },
  docHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  docCount: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  docItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  docItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  docName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  docItemRight: {
    marginLeft: 10,
  },
  viewDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#EBF1FF',
  },
  viewDocText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  uploadDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  uploadDocText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 14,
    textAlign: 'center',
  },
  statusOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statusOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  modalCloseBtn: {
    marginTop: 16,
    paddingVertical: 10,
    backgroundColor: Colors.bgSecondary,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
});
