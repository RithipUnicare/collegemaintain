import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import {
    Text,
    Card,
    useTheme,
    ActivityIndicator,
    Icon,
    Divider,
} from 'react-native-paper';
import { ComplaintService } from '../services/ComplaintService';
import { UserService } from '../services/UserService';
import { MasterService } from '../services/MasterService';

const SuperAdminDashboardScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalComplaints: 0,
        pendingComplaints: 0,
        inProgressComplaints: 0,
        completedComplaints: 0,
        totalBlocks: 0,
        totalFloors: 0,
        totalRooms: 0,
    });

    const theme = useTheme();

    const fetchDashboardStats = async () => {
        try {
            // Fetch all data
            const [users, complaints, blocks] = await Promise.all([
                UserService.getAllUsers(),
                ComplaintService.getAllComplaints(),
                MasterService.getAllBlocks(),
            ]);

            // Calculate statistics
            const pending = complaints.filter(
                (c: any) => c.status?.toUpperCase() === 'PENDING',
            ).length;
            const inProgress = complaints.filter(
                (c: any) => c.status?.toUpperCase() === 'IN_PROGRESS',
            ).length;
            const completed = complaints.filter(
                (c: any) => c.status?.toUpperCase() === 'COMPLETED',
            ).length;

            // Calculate infrastructure stats
            let totalFloors = 0;
            let totalRooms = 0;
            blocks.forEach((block: any) => {
                totalFloors += block.floors?.length || 0;
                block.floors?.forEach((floor: any) => {
                    totalRooms += floor.rooms?.length || 0;
                });
            });

            setStats({
                totalUsers: users.length,
                totalComplaints: complaints.length,
                pendingComplaints: pending,
                inProgressComplaints: inProgress,
                completedComplaints: completed,
                totalBlocks: blocks.length,
                totalFloors,
                totalRooms,
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchDashboardStats();
    };

    const StatCard = ({
        title,
        value,
        icon,
        color,
        onPress,
    }: {
        title: string;
        value: number;
        icon: string;
        color: string;
        onPress?: () => void;
    }) => (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            style={styles.statCardWrapper}
        >
            <Card style={[styles.statCard, { borderLeftColor: color }]}>
                <Card.Content style={styles.statCardContent}>
                    <View style={styles.statIconContainer}>
                        <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
                            <Icon source={icon} size={28} color={color} />
                        </View>
                    </View>
                    <View style={styles.statTextContainer}>
                        <Text variant="displaySmall" style={[styles.statValue, { color }]}>
                            {value}
                        </Text>
                        <Text variant="bodyMedium" style={styles.statTitle}>
                            {title}
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    const QuickActionCard = ({
        title,
        description,
        icon,
        color,
        onPress,
    }: {
        title: string;
        description: string;
        icon: string;
        color: string;
        onPress: () => void;
    }) => (
        <TouchableOpacity onPress={onPress} style={styles.quickActionWrapper}>
            <Card style={styles.quickActionCard}>
                <Card.Content style={styles.quickActionContent}>
                    <View style={[styles.quickActionIcon, { backgroundColor: color + '15' }]}>
                        <Icon source={icon} size={24} color={color} />
                    </View>
                    <View style={styles.quickActionText}>
                        <Text variant="titleMedium" style={styles.quickActionTitle}>
                            {title}
                        </Text>
                        <Text variant="bodySmall" style={styles.quickActionDescription}>
                            {description}
                        </Text>
                    </View>
                    <Icon source="chevron-right" size={24} color="#64748B" />
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <Text variant="headlineMedium" style={styles.headerTitle}>
                    Super Admin Dashboard
                </Text>
                <Text variant="bodyMedium" style={styles.headerSubtitle}>
                    Complete system overview and management
                </Text>
            </View>

            {/* User Statistics */}
            <View style={styles.section}>
                <Text variant="titleLarge" style={styles.sectionTitle}>
                    User Statistics
                </Text>
                <View style={styles.statsGrid}>
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon="account-group"
                        color="#8B5CF6"
                        onPress={() => navigation.navigate('Users')}
                    />
                    <StatCard
                        title="Complaints"
                        value={stats.totalComplaints}
                        icon="alert-circle"
                        color="#3B82F6"
                        onPress={() => navigation.navigate('Complaints')}
                    />
                </View>
            </View>

            {/* Complaint Statistics */}
            <View style={styles.section}>
                <Text variant="titleLarge" style={styles.sectionTitle}>
                    Complaint Breakdown
                </Text>
                <View style={styles.statsGrid}>
                    <StatCard
                        title="Pending"
                        value={stats.pendingComplaints}
                        icon="clock-outline"
                        color="#F59E0B"
                    />
                    <StatCard
                        title="In Progress"
                        value={stats.inProgressComplaints}
                        icon="progress-clock"
                        color="#3B82F6"
                    />
                    <StatCard
                        title="Completed"
                        value={stats.completedComplaints}
                        icon="check-circle"
                        color="#10B981"
                    />
                </View>
            </View>

            {/* Infrastructure Statistics */}
            <View style={styles.section}>
                <Text variant="titleLarge" style={styles.sectionTitle}>
                    Infrastructure
                </Text>
                <View style={styles.statsGrid}>
                    <StatCard
                        title="Blocks"
                        value={stats.totalBlocks}
                        icon="office-building"
                        color="#EC4899"
                        onPress={() => navigation.navigate('Infrastructure')}
                    />
                    <StatCard
                        title="Floors"
                        value={stats.totalFloors}
                        icon="stairs"
                        color="#14B8A6"
                    />
                    <StatCard
                        title="Rooms"
                        value={stats.totalRooms}
                        icon="door"
                        color="#F97316"
                    />
                </View>
            </View>

            <Divider style={styles.divider} />

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text variant="titleLarge" style={styles.sectionTitle}>
                    Quick Actions
                </Text>
                <QuickActionCard
                    title="Manage Users"
                    description="View and manage all users, update roles"
                    icon="account-cog"
                    color="#8B5CF6"
                    onPress={() => navigation.navigate('Users')}
                />
                <QuickActionCard
                    title="All Complaints"
                    description="View and manage all system complaints"
                    icon="format-list-bulleted"
                    color="#3B82F6"
                    onPress={() => navigation.navigate('Complaints')}
                />
                <QuickActionCard
                    title="Infrastructure Management"
                    description="Manage blocks, floors, and rooms"
                    icon="office-building-cog"
                    color="#EC4899"
                    onPress={() => navigation.navigate('Infrastructure')}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    contentContainer: {
        padding: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginBottom: 24,
    },
    headerTitle: {
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    headerSubtitle: {
        color: '#64748B',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 12,
    },
    statsGrid: {
        gap: 12,
    },
    statCardWrapper: {
        marginBottom: 0,
    },
    statCard: {
        borderRadius: 12,
        elevation: 2,
        backgroundColor: 'white',
        borderLeftWidth: 4,
    },
    statCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    statIconContainer: {
        marginRight: 16,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statTextContainer: {
        flex: 1,
    },
    statValue: {
        fontWeight: 'bold',
        marginBottom: 2,
    },
    statTitle: {
        color: '#64748B',
    },
    quickActionWrapper: {
        marginBottom: 12,
    },
    quickActionCard: {
        borderRadius: 12,
        elevation: 1,
        backgroundColor: 'white',
    },
    quickActionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    quickActionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    quickActionText: {
        flex: 1,
    },
    quickActionTitle: {
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 2,
    },
    quickActionDescription: {
        color: '#64748B',
    },
    divider: {
        marginVertical: 16,
    },
});

export default SuperAdminDashboardScreen;
