import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import {Monitor, Smartphone, Tablet, X, LogOut} from 'lucide-react-native';
import useAuth from '../../../hooks/useAuth';
import {Button} from '../../common';
import styles from './styles';

const SessionManager = () => {
  const {
    sessions,
    sessionsLoading,
    getSessions,
    revokeSession,
    logoutFromAllDevices,
  } = useAuth();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    await getSessions();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSessions();
    setRefreshing(false);
  };

  const handleRevokeSession = (sessionId, deviceInfo) => {
    Alert.alert(
      'Revoke Session',
      `Are you sure you want to log out from "${deviceInfo}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => revokeSession(sessionId),
        },
      ],
    );
  };

  const handleLogoutAllDevices = () => {
    Alert.alert(
      'Logout All Devices',
      'Are you sure you want to log out from all devices? You will need to log in again.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout All',
          style: 'destructive',
          onPress: logoutFromAllDevices,
        },
      ],
    );
  };

  const getDeviceIcon = deviceInfo => {
    const device = deviceInfo?.toLowerCase() || '';
    if (
      device.includes('mobile') ||
      device.includes('android') ||
      device.includes('iphone')
    ) {
      return <Smartphone size={20} color="#6B7280" />;
    }
    if (device.includes('tablet') || device.includes('ipad')) {
      return <Tablet size={20} color="#6B7280" />;
    }
    return <Monitor size={20} color="#6B7280" />;
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderSession = ({item}) => (
    <View style={styles.sessionItem}>
      <View style={styles.sessionHeader}>
        <View style={styles.deviceInfo}>
          {getDeviceIcon(item.deviceInfo)}
          <View style={styles.deviceDetails}>
            <Text style={styles.deviceName}>
              {item.deviceInfo || 'Unknown Device'}
            </Text>
            <Text style={styles.sessionDate}>
              Last active: {formatDate(item.lastUsed || item.createdAt)}
            </Text>
            {item.isCurrent && (
              <Text style={styles.currentDevice}>Current Device</Text>
            )}
          </View>
        </View>
        {!item.isCurrent && (
          <TouchableOpacity
            style={styles.revokeButton}
            onPress={() => handleRevokeSession(item.id, item.deviceInfo)}>
            <X size={18} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.sessionDetails}>
        <Text style={styles.sessionInfo}>
          IP: {item.ipAddress || 'Unknown'}
        </Text>
        <Text style={styles.sessionInfo}>
          Location: {item.location || 'Unknown'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Active Sessions</Text>
        <Text style={styles.subtitle}>
          Manage your active sessions across all devices
        </Text>
      </View>

      <FlatList
        data={sessions}
        keyExtractor={item => item.id.toString()}
        renderItem={renderSession}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Monitor size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No active sessions found</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.footer}>
        <Button
          title="Logout All Devices"
          onPress={handleLogoutAllDevices}
          variant="outline"
          style={styles.logoutAllButton}
          textStyle={styles.logoutAllButtonText}
          icon={<LogOut size={18} color="#EF4444" />}
        />
      </View>
    </View>
  );
};

export default SessionManager;
